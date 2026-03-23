export interface ModelFeatures {
  // Proteins (9)
  ANG: number;
  FGFR2: number;
  HAVCR1: number;
  IL1R1: number;
  PTGDS: number;
  CCL3: number;
  CXCL14: number;
  ESAM: number;
  IGSF8: number;
  // Clinical (19)
  Age: number;
  Sex: number; // 0: Female, 1: Male
  Education: number;
  TDI: number;
  HbA1c: number;
  Glucose: number;
  TC: number;
  HDL: number;
  TG: number;
  LDL: number;
  LpA: number;
  ApoB: number;
  BMI: number;
  DBP: number;
  SBP: number;
  WC: number;
  Urea: number;
  eGFR: number;
  ACR: number;
}

export interface PredictionResult {
  riskScore: number;
  riskCategory: 'Low' | 'Moderate' | 'High';
  survivalProbability: number;
  cIndex: number;
}

export interface ModelMetadata {
  model_type: string;
  c_index: number;
  n_features: number;
  feature_names: string[];
  created_date: string;
}
