import { z } from "zod";
import { tool } from "ai";

const updateFields = z.object({
  x: z.number().nullable(),
  y: z.number().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  text: z.string().nullable(),
  fontSize: z.number().nullable(),
  textAlign: z.enum(["left", "center", "right"]).nullable(),
  strokeColor: z.string().nullable(),
  backgroundColor: z.string().nullable(),
  fillStyle: z.enum(["solid", "hachure", "cross-hatch"]).nullable(),
  strokeWidth: z.number().nullable(),
  roughness: z.number().nullable(),
  opacity: z.number().nullable(),
});

export const updateElements = tool({
  description: `Update existing elements on the canvas. Each element must have a unique id and the fields to update. Pass null for any you do not want to update.
        Example: {id: "rect_start", x: 150, y: 150, width: 250, height: 150}`,
  inputSchema: z.object({
    elements: z.array(
      z.object({
        id: z.string(),
        fields: updateFields,
      }),
    ),
  }),
  strict: true,
});
