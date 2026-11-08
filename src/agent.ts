import { AIChatAgent } from "@cloudflare/ai-chat";
import { convertToModelMessages, UIMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { streamAgent } from "./agent-core";

interface ENV {
  OPENAI_API_KEY: string;
}

type CanvasStatePart = { type: "data-canvas-state"; data: { elements: any[] } };
const extractCanvasState = (messages: UIMessage[]) => {
  // the last message in the array is always assumed to be the user message
  const last = messages.at(-1);
  const part = last?.parts.find((p) => p.type === "data-canvas-state") as
    CanvasStatePart | undefined;
  return part?.data.elements ?? [];
};

export class DesignAgent extends AIChatAgent<ENV> {
  async onChatMessage() {
    const openai = createOpenAI({ apiKey: this.env.OPENAI_API_KEY });
    const canvasState = extractCanvasState(this.messages);
    const res = streamAgent({
      model: openai("gpt-5.4-mini"),
      messages: await convertToModelMessages(this.messages),
      canvasState,
    });
    return res.toUIMessageStreamResponse();
  }
}
