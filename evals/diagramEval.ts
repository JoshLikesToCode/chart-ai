import { readFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";
import { Eval } from "braintrust";
import { createOpenAI } from "@ai-sdk/openai";

import { runAgent } from "../src/agent-core.ts";
import { buildMessages, type GoldenTestCase } from "./buildMessages.ts";
import { schemaScorer } from "./scorers/schema.ts";

config({ path: ".dev.vars" });

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const testCases: GoldenTestCase[] = JSON.parse(
  readFileSync(join("evals", "datasets", "golden.json"), "utf-8"),
);

Eval("Chart AI", {
  data: () =>
    testCases.map((tc) => ({
      input: tc,
      expected: tc,
      metadata: {
        id: tc.id,
        difficulty: tc.difficulty,
        category: tc.category,
      },
    })),
  task: async (tc) => {
    const res = await runAgent({
      model: openai("gpt-5.4-mini"),
      messages: buildMessages(tc),
    });
    return { text: res.text, elements: res.elements };
  },
  scores: [schemaScorer],
});
