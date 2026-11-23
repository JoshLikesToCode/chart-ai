import { tool } from "ai";
import { elementSchema } from "./element-schema";
import { z } from "zod";

export const addElement = tool({
  description: `Add a new element to the canvas. Each new element needs a unique id, type, position, and size.
    Example: {id: "rect_start", type: "rectangle", x: 100, y: 100, width: 200, height: 100, text: null, containerId: null}`,
  inputSchema: z.object({
    elements: z.array(elementSchema),
  }),
  strict: true,
});
