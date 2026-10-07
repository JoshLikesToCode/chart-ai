import { tools } from "../src/tools";
import { SYSTEM_PROMPT } from "../src/system-prompt";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, stepCountIs } from "ai";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import type { TestCase, EvalResult } from "./types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function runTestCase(testCase: TestCase): Promise<EvalResult> {
  const start = Date.now();
  try {
    const res = await generateText({
      model: openai("gpt-5.4-mini"),
      system: SYSTEM_PROMPT,
      prompt: testCase.input,
      tools,
      stopWhen: stepCountIs(5), // 5 is an ambigious value here
    });
    const elements: unknown[] = [];
    for (const step of res.steps) {
      for (const toolResult of step.toolResults ?? []) {
        if (toolResult.toolName === "generateDiagram") {
          const output = toolResult.output as any;
          if (Array.isArray(output?.elements)) {
            elements.push(...output.elements);
          }
        }
      }
    }
    return {
      testCaseId: testCase.id,
      input: testCase.input,
      response: res.text,
      elements,
      durationMs: Date.now() - start,
    };
  } catch (error) {
    return {
      testCaseId: testCase.id,
      input: testCase.input,
      response: "",
      elements: [],
      durationMs: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const datasetPath = join(ROOT, "evals/datasets/golden.json");
  const testCases: TestCase[] = JSON.parse(readFileSync(datasetPath, "utf-8"));
  console.log(`Running ${testCases.length} test cases\n`);

  const results: EvalResult[] = [];
  for (const testCase of testCases) {
    const result = await runTestCase(testCase);
    results.push(result);
    console.log(
      `${result.error ? "FAIL" : "ok  "} ${result.testCaseId} (${result.durationMs}ms, ${result.elements.length} elements)` +
        (result.error ? `: ${result.error}` : ""),
    );
  }

  const outDir = join(ROOT, "evals/results");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
