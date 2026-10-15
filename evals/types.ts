// Test cases live in evals/datasets/golden.json. Each one describes a single
// prompt the agent should handle, plus what a good response looks like.

export type Difficulty = "simple" | "medium" | "hard" | "edge";
export type Category = "create" | "modify" | "domain" | "edge";

// Prior conversation state for "modify" cases: the canvas the user already has.
export interface Seed {
  userPrompt: string;
  assistantConfirmation: string;
  elements: Record<string, unknown>[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedCharacteristics: string[];
  expectedKeywords?: string[];
  seed?: Seed;
  preservedIds?: string[];
  difficulty: Difficulty;
  category: Category;
}

// What we collect from running a test case through the agent.
export interface EvalResult {
  testCaseId: string;
  input: string;
  response: string;
  elements: unknown[];
  durationMs: number;
  error?: string;
}

// Same as EvalResult but with a manual score and notes the human added.
export interface ScoredResult extends EvalResult {
  score: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}
