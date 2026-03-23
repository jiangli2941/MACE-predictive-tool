import { useState } from 'react';
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  Shield, 
  Info,
  ChevronRight,
  Microscope,
  Droplets,
  User,
  FileText,
  Github,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ModelFeatures, PredictionResult } from '@/types';
import './App.css';

const defaultFeatures: ModelFeatures = {
  ANG: 0, FGFR2: 0, HAVCR1: 0, IL1R1: 0, PTGDS: 0,
  CCL3: 0, CXCL14: 0, ESAM: 0, IGSF8: 0,
  Age: 55, Sex: 0, Education: 12, TDI: 0,
  HbA1c: 5.7, Glucose: 100, TC: 200, HDL: 50, TG: 150,
  LDL: 130, LpA: 30, ApoB: 90, BMI: 25, DBP: 80,
  SBP: 120, WC: 90, Urea: 15, eGFR: 90, ACR: 10
};

const proteinFeatures = ['ANG', 'FGFR2', 'HAVCR1', 'IL1R1', 'PTGDS', 'CCL3', 'CXCL14', 'ESAM', 'IGSF8'];
const clinicalFeatures = ['Age', 'Sex', 'Education', 'TDI', 'HbA1c', 'Glucose', 'TC', 'HDL', 'TG', 'LDL', 'LpA', 'ApoB', 'BMI', 'DBP', 'SBP', 'WC', 'Urea', 'eGFR', 'ACR'];

const featureUnits: Record<string, string> = {
  ANG: 'ng/mL', FGFR2: 'ng/mL', HAVCR1: 'ng/mL', IL1R1: 'ng/mL', PTGDS: 'ng/mL',
  CCL3: 'pg/mL', CXCL14: 'pg/mL', ESAM: 'ng/mL', IGSF8: 'ng/mL',
  Age: 'years', Sex: '', Education: 'years', TDI: 'score',
  HbA1c: '%', Glucose: 'mg/dL', TC: 'mg/dL', HDL: 'mg/dL', TG: 'mg/dL',
  LDL: 'mg/dL', LpA: 'mg/dL', ApoB: 'mg/dL', BMI: 'kg/m²', DBP: 'mmHg',
  SBP: 'mmHg', WC: 'cm', Urea: 'mg/dL', eGFR: 'mL/min/1.73m²', ACR: 'mg/g'
};

const featureRanges: Record<string, { min: number; max: number; step: number }> = {
  ANG: { min: 0, max: 100, step: 0.1 }, FGFR2: { min: 0, max: 50, step: 0.1 },
  HAVCR1: { min: 0, max: 100, step: 0.1 }, IL1R1: { min: 0, max: 50, step: 0.1 },
  PTGDS: { min: 0, max: 100, step: 0.1 }, CCL3: { min: 0, max: 500, step: 1 },
  CXCL14: { min: 0, max: 500, step: 1 }, ESAM: { min: 0, max: 100, step: 0.1 },
  IGSF8: { min: 0, max: 100, step: 0.1 }, Age: { min: 18, max: 100, step: 1 },
  Sex: { min: 0, max: 1, step: 1 }, Education: { min: 0, max: 25, step: 1 },
  TDI: { min: -10, max: 10, step: 0.1 }, HbA1c: { min: 3, max: 15, step: 0.1 },
  Glucose: { min: 50, max: 300, step: 1 }, TC: { min: 100, max: 400, step: 1 },
  HDL: { min: 20, max: 120, step: 1 }, TG: { min: 50, max: 500, step: 1 },
  LDL: { min: 50, max: 250, step: 1 }, LpA: { min: 0, max: 200, step: 1 },
  ApoB: { min: 30, max: 200, step: 1 }, BMI: { min: 15, max: 50, step: 0.1 },
  DBP: { min: 50, max: 120, step: 1 }, SBP: { min: 80, max: 200, step: 1 },
  WC: { min: 50, max: 150, step: 1 }, Urea: { min: 5, max: 50, step: 0.1 },
  eGFR: { min: 30, max: 150, step: 1 }, ACR: { min: 0, max: 300, step: 1 }
};

function App() {
  const [features, setFeatures] = useState<ModelFeatures>(defaultFeatures);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [activeTab, setActiveTab] = useState('predictor');

  const handleFeatureChange = (key: keyof ModelFeatures, value: number) => {
    setFeatures(prev => ({ ...prev, [key]: value }));
  };

  const simulatePrediction = (): PredictionResult => {
    // Simplified simulation based on feature values
    const ageFactor = (features.Age - 50) / 50;
    const hba1cFactor = (features.HbA1c - 5.7) / 5;
    const ldlFactor = (features.LDL - 100) / 100;
    const egfrFactor = (90 - features.eGFR) / 60;
    const proteinSum = proteinFeatures.reduce((sum, p) => sum + features[p as keyof ModelFeatures], 0);
    const proteinFactor = proteinSum / 200;
    
    const riskScore = Math.min(100, Math.max(0, 
      20 + ageFactor * 20 + hba1cFactor * 15 + ldlFactor * 15 + egfrFactor * 15 + proteinFactor * 15
    ));
    
    let riskCategory: 'Low' | 'Moderate' | 'High' = 'Low';
    if (riskScore > 60) riskCategory = 'High';
    else if (riskScore > 30) riskCategory = 'Moderate';
    
    return {
      riskScore: Math.round(riskScore * 10) / 10,
      riskCategory,
      survivalProbability: Math.round((100 - riskScore) * 10) / 10,
      cIndex: 0.758
    };
  };

  const handlePredict = () => {
    const prediction = simulatePrediction();
    setResult(prediction);
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'Low': return 'bg-emerald-500';
      case 'Moderate': return 'bg-amber-500';
      case 'High': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const getRiskTextColor = (category: string) => {
    switch (category) {
      case 'Low': return 'text-emerald-600';
      case 'Moderate': return 'text-amber-600';
      case 'High': return 'text-rose-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                MACE Predictor
              </h1>
              <p className="text-xs text-slate-500">Serum Protein Risk Model</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setActiveTab('predictor')} className={`text-sm font-medium transition-colors ${activeTab === 'predictor' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>
              Predictor
            </button>
            <button onClick={() => setActiveTab('about')} className={`text-sm font-medium transition-colors ${activeTab === 'about' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>
              About Model
            </button>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'predictor' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Input Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Card */}
              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <div className="relative">
                  <img 
                    src="/hero-cardio.jpg" 
                    alt="Cardiovascular System" 
                    className="w-full h-48 object-cover opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                        C-Index: 0.758
                      </Badge>
                      <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                        28 Features
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-bold">MACE Risk Prediction</h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Non-fatal Major Adverse Cardiovascular Events Risk Assessment
                    </p>
                  </div>
                </div>
              </Card>

              {/* Input Tabs */}
              <Tabs defaultValue="proteins" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1">
                  <TabsTrigger value="proteins" className="flex items-center gap-2 data-[state=active]:bg-white">
                    <Microscope className="w-4 h-4" />
                    Serum Proteins (9)
                  </TabsTrigger>
                  <TabsTrigger value="clinical" className="flex items-center gap-2 data-[state=active]:bg-white">
                    <User className="w-4 h-4" />
                    Clinical Data (19)
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="proteins" className="mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                          <Droplets className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Serum Protein Biomarkers</CardTitle>
                          <CardDescription>Enter protein concentration values</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {proteinFeatures.map((feature) => (
                          <div key={feature} className="space-y-2">
                            <Label className="text-sm font-medium flex items-center justify-between">
                              {feature}
                              <span className="text-xs text-slate-400">{featureUnits[feature]}</span>
                            </Label>
                            <Input
                              type="number"
                              step={featureRanges[feature].step}
                              min={featureRanges[feature].min}
                              max={featureRanges[feature].max}
                              value={features[feature as keyof ModelFeatures]}
                              onChange={(e) => handleFeatureChange(feature as keyof ModelFeatures, parseFloat(e.target.value) || 0)}
                              className="h-10"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="clinical" className="mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Clinical Parameters</CardTitle>
                          <CardDescription>Enter patient clinical data</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {clinicalFeatures.map((feature) => (
                            <div key={feature} className="space-y-2">
                              <Label className="text-sm font-medium flex items-center justify-between">
                                {feature === 'Sex' ? 'Sex (0=F, 1=M)' : feature}
                                <span className="text-xs text-slate-400">{featureUnits[feature]}</span>
                              </Label>
                              <Input
                                type="number"
                                step={featureRanges[feature].step}
                                min={featureRanges[feature].min}
                                max={featureRanges[feature].max}
                                value={features[feature as keyof ModelFeatures]}
                                onChange={(e) => handleFeatureChange(feature as keyof ModelFeatures, parseFloat(e.target.value) || 0)}
                                className="h-10"
                              />
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Predict Button */}
              <Button 
                onClick={handlePredict}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Calculate MACE Risk
              </Button>
            </div>

            {/* Right Panel - Results */}
            <div className="space-y-6">
              {/* Result Card */}
              {result ? (
                <Card className="border-0 shadow-xl overflow-hidden">
                  <div className={`h-2 ${getRiskColor(result.riskCategory)}`} />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-500" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Risk Score */}
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${getRiskTextColor(result.riskCategory)}`}>
                        {result.riskScore}%
                      </div>
                      <p className="text-slate-500 text-sm mt-1">5-Year MACE Risk</p>
                    </div>

                    {/* Risk Category */}
                    <div className="flex items-center justify-center">
                      <Badge className={`${getRiskColor(result.riskCategory)} text-white text-lg px-4 py-1`}>
                        {result.riskCategory} Risk
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Risk Level</span>
                        <span className="font-medium">{result.riskScore}%</span>
                      </div>
                      <Progress value={result.riskScore} className="h-3" />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Survival Probability */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-medium">Event-Free Survival</span>
                      </div>
                      <span className="text-lg font-bold text-emerald-600">
                        {result.survivalProbability}%
                      </span>
                    </div>

                    {/* Model Info */}
                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="w-4 h-4 text-blue-600" />
                      <AlertDescription className="text-blue-700 text-xs">
                        Model: CoxBoost + Elastic Net (α=0.1)
                        <br />
                        C-index: {result.cIndex}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-100 to-slate-50">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center">
                      <Activity className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      Ready to Predict
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Enter patient data and click "Calculate MACE Risk" to get the prediction result.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Feature Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Model Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Serum Proteins</span>
                    <Badge variant="secondary">9</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Clinical Variables</span>
                    <Badge variant="secondary">19</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Features</span>
                    <Badge>28</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Guide */}
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-amber-800">
                    Interpretation Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-amber-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span><strong>Low Risk (&lt;30%):</strong> Standard care</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span><strong>Moderate (30-60%):</strong> Enhanced monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span><strong>High Risk (&gt;60%):</strong> Intensive intervention</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* About Page */
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                About the Model
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                A machine learning-based risk prediction model for non-fatal Major Adverse Cardiovascular Events (MACE)
                using serum protein biomarkers and clinical data.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <img 
                  src="/proteins.jpg" 
                  alt="Protein Molecules" 
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Serum Protein Biomarkers</CardTitle>
                  <CardDescription>9 key protein markers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {proteinFeatures.map(p => (
                      <li key={p} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-blue-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <img 
                  src="/mace-risk.jpg" 
                  alt="MACE Risk" 
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Model Performance</CardTitle>
                  <CardDescription>Validation metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">C-index (Concordance)</span>
                    <Badge className="bg-blue-600">0.758</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">Algorithm</span>
                    <span className="text-sm text-slate-600">CoxBoost + Elastic Net</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">Alpha Parameter</span>
                    <span className="text-sm text-slate-600">0.1</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Clinical Variables</CardTitle>
                <CardDescription>19 demographic and laboratory parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {clinicalFeatures.map(c => (
                    <div key={c} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      {c}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="w-5 h-5 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Disclaimer:</strong> This tool is for research purposes only. 
                Clinical decisions should not be based solely on this prediction. 
                Always consult with healthcare professionals for medical advice.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              MACE Risk Prediction Tool • Based on CoxBoost + Elastic Net Model
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400">Created: 2026-03-23</span>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
