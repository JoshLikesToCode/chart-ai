import { tool } from "ai";
import { z } from "zod";

export const tools = {
  // naive 1shot tool to generate a diagram from scratch
  generateDiagram: tool({
    description:
      "Generate a complete diagram as an array of Excalidraw elements. Use this when the user asks you to create, draw, or design a new diagram. Return all elements needed including shapes, text labels, and arrow lines connecting them.",
    inputSchema: z.object({
      elements: z.array(
        z.object({
          id: z.string().describe("Unique identifier"),
          type: z.enum([
            "rectangle",
            "ellipse",
            "diamond",
            "line",
            "text",
            "line",
            "arrow",
          ]),
          x: z.number().describe("X coordinate of the element"),
          y: z.number().describe("Y coordinate of the element"),
          width: z
            .number()
            .optional()
            .describe("Width of the element (for shapes)"),
          height: z
            .number()
            .optional()
            .describe("Height of the element (for shapes)"),
          strokeColor: z
            .string()
            .default("#1e1e1e")
            .describe("Stroke color (hex)"),
          backgroundColor: z
            .string()
            .default("transparent")
            .describe("Fill color"),
          fillStyle: z
            .enum(["solid", "hachure", "cross-hatch"])
            .default("solid"),
          strokeWidth: z.number().default(2),
          roughness: z
            .number()
            .default(1)
            .describe("0 for clean, 1 for sketchy"),
          opacity: z.number().default(100),
          text: z
            .string()
            .optional()
            .describe("Text content (for text elements)"),
          fontSize: z.number().default(20),
          fontFamily: z
            .number()
            .default(1)
            .describe("1: Virgil, 2: Helvetica, 3: Cascadia"),
          textAlign: z.enum(["left", "center", "right"]).default("center"),
          points: z
            .array(z.array(z.number()))
            .optional()
            .describe("Array of [x,y] points for lines and arrows"),
          startBinding: z
            .object({
              elementId: z.string(),
              focus: z.number(),
              gap: z.number(),
            })
            .optional()
            .describe("Bind arrow from start to an element"),
          endBinding: z
            .object({
              elementId: z.string(),
              focus: z.number(),
              gap: z.number(),
            })
            .optional()
            .describe("An array of excalidraw elements"),
        }),
      ),
    }),
    execute: async ({ elements }) => {
      return { elements };
    },
  }),
  // naive 1shoot tool at modifying an existing diagram
  modifyDiagram: tool({
    description:
      "Modify an existing diagram by adding, removing, or changing elements. Use this when the user asks you to update or edit a diagram. Return the updated array of Excalidraw elements.",
    inputSchema: z.object({
      elementId: z.string().describe("The id of the lement to modify"),
      updates: z.object({
        x: z.number().optional(),
        y: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        text: z.string().optional(),
        fontSize: z.number().optional(),
        textAlign: z.enum(["left", "center", "right"]).optional(),
        strokeColor: z.string().optional(),
        backgroundColor: z.string().optional(),
        fillStyle: z.enum(["solid", "hachure", "cross-hatch"]).optional(),
        strokeWidth: z.number().optional(),
        roughness: z.number().optional(),
        opacity: z.number().optional(),
      }),
    }),
    execute: async ({ elementId, updates }) => {
      // In a real implementation, you would fetch the existing elements from a database or state,
      // find the element with the given id, and apply the updates to it.
      // Here, we just return a placeholder response.
      return { elementId, updates };
    },
  }),
};
