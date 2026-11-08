import { encode } from "@toon-format/toon";
import type { ExcalidrawElement } from "../schemas";

export function serializeCanvasState(elements: ExcalidrawElement[]) {
  if (!elements.length) return "canvas: empty";
  const rows = elements.map((el) => ({
    id: el.id,
    type: el.type,
    x: Math.round(el.x), // cut down on variance by rounding
    y: Math.round(el.y),
    w: Math.round(el.width),
    h: Math.round(el.height),
    label: el.type === "text" ? el.text : "",
    from: el.type === "arrow" ? (el.startBinding?.elementId ?? "") : "",
    to: el.type === "arrow" ? (el.endBinding?.elementId ?? "") : "",
  }));
  return encode(
    { elements: rows },
    { indent: 2, delimiter: "," }, // using TOON format for token-efficient diffing in test output
  );
}
