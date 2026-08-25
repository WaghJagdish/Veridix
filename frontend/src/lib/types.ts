export type Provider = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'custom';
export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';
export type ScanPreset = 'quick' | 'indic' | 'full' | 'custom';
export type Language = 'en' | 'hi' | 'hinglish';
export type Verdict = 'safe' | 'borderline' | 'unsafe';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'none';
export type DriftLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface Target {
  id: string;
  name: string;
  provider: Provider;
  model: string;
  endpoint?: string;
  api_key_masked: string;
  system_prompt?: string;
  app_description?: string;
  verified_at?: string;
  created_at: string;
}

export interface Scan {
  id: string;
  target_id: string;
  target?: Target;
  name: string;
  status: ScanStatus;
  preset: ScanPreset;
  languages: Language[];
  categories: string[];
  judge_provider: string;
  judge_model: string;
  started_at?: string;
  completed_at?: string;
  total_tests: number;
  tests_completed: number;
  tests_failed: number;
  is_demo: boolean;
  created_at: string;
  summary?: ScanSummary;
}

export interface ScanSummary {
  overall_safety_score: number;
  safety_drift_score: number;
  critical_findings: number;
  high_findings: number;
  medium_findings: number;
  low_findings: number;
  total_findings: number;
  safe_tests: number;
  borderline_tests: number;
  unsafe_tests: number;
  total_tests: number;
  drift_events: number;
  high_drift_events: number;
  language_scores: Record<Language, number>;
  category_scores: Record<string, number>;
  heatmap_data: HeatmapCell[];
}

export interface HeatmapCell {
  language: Language;
  category: string;
  score: number;
  test_count: number;
}

export interface Finding {
  id: string;
  scan_id: string;
  finding_ref: string;
  title: string;
  category: string;
  severity: Severity;
  confidence: number;
  language: Language;
  attack_type: string;
  attack_strategy: string;
  owasp_ref?: string;
  prompt: string;
  model_response: string;
  evaluator_reasoning: string;
  remediation: string;
  drift_score?: number;
  drift_level?: DriftLevel;
  created_at: string;
  language_variants?: LanguageVariantDetail[];
}

export interface LanguageVariantDetail {
  language: Language;
  prompt: string;
  response: string;
  verdict: Verdict;
  severity: Severity;
  confidence: number;
  refusal_quality: number;
  policy_adherence: number;
  reasoning: string;
  evidence: string;
  latency_ms: number;
}

export interface ScanEvent {
  stage: 'generating' | 'executing' | 'evaluating' | 'analyzing' | 'complete' | 'error';
  message: string;
  language?: Language;
  category?: string;
  progress?: number;
  total?: number;
  completed?: number;
  timestamp: string;
}

export interface TestCaseDetail {
  id: string;
  semantic_intent: string;
  attack_category: string;
  attack_strategy?: string;
  base_prompt_en: string;
  owasp_ref?: string;
  drift_score?: number;
  drift_level?: DriftLevel;
  variants: LanguageVariantDetail[];
}
