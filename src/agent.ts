import { AIChatAgent } from "@cloudflare/ai-chat";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { tools } from "./tools";

interface ENV {
  OPENAI_API_KEY: string;
}

const SYSTEM_PROMPT = `
    You are a helpful assistant that can generate and modify diagrams in Excalidraw format. 
    You will be given a user prompt and you should respond with a JSON object containing 
    an array of Excalidraw elements. Use the tools provided to generate or modify the 
    diagram as needed.
    
    Guidelines for generating diagrams:
     - Give each element a unique id (e.g. "react-1", "text-1", "arrow-1").
     - Position elements with reasonable spacing (at least 20px gap between elements).
     - Use rectangles for boxes/containers, ellipses for circles, and diamonds for decision points.
     - Add text labels inside or near shapes.
     - Connect related elements with arriws.
     - Use a clean layout: left to right or top to bottom, avoid overlapping elements.
     - Default to strokeColor "#1e1e1" and backGround "transparent"
     - Set roughness to 1 for a hand-drawn look, or 0 for a clean look.

     When a user asks to modify an element, use the modifyDiagram tool with the element's id."

    After a tool call finishes, reply with a short natural-language confirmation
    of what you did (e.g. "Done — added a rectangle labeled Hello."). Never repeat
    or restate the elements array, JSON, or tool output in your reply.
    `;

export class DesignAgent extends AIChatAgent<ENV> {
    async onChatMessage() {
        const openai = createOpenAI({apiKey: this.env.OPENAI_API_KEY});
        const res = streamText({
            model: openai("gpt-5.4-mini"),
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(this.messages),
            tools,
            stopWhen: stepCountIs(5), // 5 is an ambigious value here
            providerOptions: {openai: {strictJsonSchema: false}},
        })
        return res.toUIMessageStreamResponse();
    }
}