import MessageBubble from "./MessageBubble";
import type { Message } from "./types";
import {useEffect, useRef} from "react";

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  // keep track of scrolling
  const containerRef = useRef<HTMLDivElement>(null);
  const wasAtBottom = useRef(true);
  const normalizedMessages = messages.map((msg) => ({
    ...msg,
    parts: "parts" in msg && Array.isArray(msg.parts) ? msg.parts : [],
  }));

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    wasAtBottom.current = distanceFromBottom < 50;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if(wasAtBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <p className="placeholder-text">
          Describe a diagram and the AI will create it for you.
        </p>
      </div>
    );
  }

  return (
    <div className="message-list" ref={containerRef} onScroll={handleScroll}>
      {normalizedMessages.map((msg) => (
        <MessageBubble key={msg.id} message={msg as any} />
      ))}
    </div>
  );
}
