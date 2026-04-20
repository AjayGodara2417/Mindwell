export type TestType =
  | "simon"
  | "digit_span"
  | "reaction"
  | "color"
  | "stroop"

export type TestProps = {
  onComplete: (score: number) => void;
};

export interface CognitiveTestPayload {
  patient_id: number;
  test_type: TestType;
  score?: number;
  accuracy?: number;
  response_time?: number;
}

export interface CognitiveTestResult extends CognitiveTestPayload {
  id: number;
  created_at: string;
}

// 📁 /types/cognitive.ts

export type CognitiveScores = {
  memory: number;
  reaction: number;
  attention: number;
  digit: number;
  stroop: number;
};

export type CognitiveResultProps = {
  scores: CognitiveScores;
  onSubmit: () => void;
};