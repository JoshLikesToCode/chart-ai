// Schema scorer: deterministic check that the agent produced valid Excalidraw
// element data. Returns 1 if every element has the required fields, 0 otherwise.
//
// This catches the worst class of failures: the agent returns nothing, returns
// garbage, or omits required properties that would crash the canvas.
//
// Braintrust scorer signature: ({ input, output, expected }) => Score | number

import type { EvalScorer } from "braintrust";
import type { GoldenTestCase } from "../buildMessages.ts";

// width/height are optional in the generateDiagram tool schema (lines, arrows
// and text may omit them), so only require what every element must have.
const REQUIRED_FIELDS = ["id", "type", "x", "y"] as const;
const VALID_TYPES = [
  "rectangle",
  "ellipse",
  "diamond",
  "text",
  "arrow",
  "line",
];

export interface AgentOutput {
  text: string;
  elements: unknown[];
}

export const schemaScorer: EvalScorer<
  GoldenTestCase,
  AgentOutput,
  GoldenTestCase
> = ({ output }) => {
  if (!Array.isArray(output.elements)) {
    return {
      name: "Schema",
      score: 0,
      metadata: { reason: "elements is not an array" },
    };
  }

  if (output.elements.length === 0) {
    return {
      name: "Schema",
      score: 0,
      metadata: { reason: "no elements produced" },
    };
  }

  for (const element of output.elements) {
    if (!element || typeof element !== "object") {
      return {
        name: "Schema",
        score: 0,
        metadata: { reason: "element is not an object" },
      };
    }
    const el = element as Record<string, unknown>;

    for (const field of REQUIRED_FIELDS) {
      if (el[field] === undefined || el[field] === null) {
        return {
          name: "Schema",
          score: 0,
          metadata: { reason: `element ${el.id} missing field: ${field}` },
        };
      }
    }

    if (typeof el.x !== "number" || typeof el.y !== "number") {
      return {
        name: "Schema",
        score: 0,
        metadata: { reason: `element ${el.id} has non-numeric x/y` },
      };
    }

    if (typeof el.type !== "string" || !VALID_TYPES.includes(el.type)) {
      return {
        name: "Schema",
        score: 0,
        metadata: { reason: `element ${el.id} has invalid type: ${el.type}` },
      };
    }
  }

  return {
    name: "Schema",
    score: 1,
    metadata: { elementCount: output.elements.length },
  };
};
