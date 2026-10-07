import { AIChatAgent } from "@cloudflare/ai-chat";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { tools } from "./tools";
import { SYSTEM_PROMPT } from "./system-prompt";

interface ENV {
  OPENAI_API_KEY: string;
}

export class DesignAgent extends AIChatAgent<ENV> {
  async onChatMessage() {
    const openai = createOpenAI({ apiKey: this.env.OPENAI_API_KEY });
    const res = streamText({
      model: openai("gpt-5.4-mini"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(this.messages),
      tools,
      stopWhen: stepCountIs(5), // 5 is an ambigious value here
      providerOptions: { openai: { strictJsonSchema: false } },
    });
    return res.toUIMessageStreamResponse();
  }
}
