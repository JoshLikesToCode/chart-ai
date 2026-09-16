import { useState, useCallback, useRef, useEffect } from "react";
import { useAgent } from "agents/react";
import { useAgentChat } from "@cloudflare/ai-chat/react";
import { convertToExcalidrawElements, newElementWith } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import Canvas from "./components/Canvas";
import ChatPanel from "./components/chat/ChatPanel";
import "./App.css";

const sessionId = crypto.randomUUID();

export default function App() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const appliedToolCalls = useRef(new Set<string>());

  const handleApiReady = useCallback((api: ExcalidrawImperativeAPI) => {
    setExcalidrawAPI(api);
  }, []);

  const agent = useAgent({ agent: "design-agent", name: sessionId });
  const { messages, sendMessage, status } = useAgentChat({ agent });

  useEffect(() => {
    if (!excalidrawAPI) return;

    for (const msg of messages) {
      if (msg.role !== "assistant") continue;

      for (const part of msg.parts ?? []) {
        if (!("type" in part) || !part.type.startsWith("tool-")) continue;
        if (!("state" in part) || part.state !== "output-available") continue;
        if (appliedToolCalls.current.has(part.toolCallId)) continue;

        if (part.type === "tool-generateDiagram") {
          appliedToolCalls.current.add(part.toolCallId);
          const output = part.output as { elements?: any };
          const skeletonElements = output.elements;

          if (Array.isArray(skeletonElements) && skeletonElements.length > 0) {
            const elements = convertToExcalidrawElements(skeletonElements, {
              regenerateIds: false,
            });
            excalidrawAPI.updateScene({ elements });
            excalidrawAPI.scrollToContent(elements, { fitToContent: true });
          }
        } else if (part.type === "tool-modifyDiagram") {
          appliedToolCalls.current.add(part.toolCallId);
          const output = part.output as {
            elementId?: string;
            updates?: Record<string, any>;
          };
          if(output?.elementId && output.updates) {
            const curr = excalidrawAPI.getSceneElements();
            const next = curr.map(el => {
              return el.id === output.elementId ? newElementWith(el, output.updates as any) : el;
            });
            excalidrawAPI.updateScene({ elements: next });
          }

      }
    }
    }
  }, [messages, excalidrawAPI]);

  return (
    <div className={`app ${theme}`}>
      <div className="canvas-container">
        <Canvas onApiReady={handleApiReady} onThemeChange={setTheme} />
      </div>
      <ChatPanel messages={messages} sendMessage={sendMessage} status={status} />
    </div>
  );
}

