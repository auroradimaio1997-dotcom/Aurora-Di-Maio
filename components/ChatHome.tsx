"use client";

import { useEffect, useState } from "react";
import ChatWidget from "./ChatWidget";

const CAPTION = "Fammi una domanda veloce o vai nell'Area di Ricerca e Lavoro di AI Aurora Studio.";
const HIGHLIGHT_START = CAPTION.indexOf("Area di Ricerca e Lavoro");
const HIGHLIGHT_END = HIGHLIGHT_START + "Area di Ricerca e Lavoro".length;

/**
 * Types the caption out letter by letter, like it's being written live,
 * then leaves it settled with a blinking cursor.
 */
function TypewriterCaption() {
  const [count, setCount] = useState(0);
  const done = count >= CAPTION.length;

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setCount((c) => c + 1), 28);
    return () => clearTimeout(t);
  }, [count, done]);

  const before = CAPTION.slice(0, Math.min(count, HIGHLIGHT_START));
  const highlight = CAPTION.slice(HIGHLIGHT_START, Math.min(count, HIGHLIGHT_END));
  const after = CAPTION.slice(HIGHLIGHT_END, count);

  return (
    <p className="text-center font-serif text-xl text-secondary md:text-2xl">
      {before}
      <span className="font-semibold text-blue-400">{highlight}</span>
      {after}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-blue-400 align-middle" style={{ height: "1em" }} />
    </p>
  );
}

/**
 * The chat landing view. Kept intentionally minimal — a single animated
 * caption, then the whole remaining space belongs to the chat itself.
 * "Nuova conversazione" lives inside ChatWidget's own header instead of a
 * separate quick-action grid.
 */
export default function ChatHome() {
  const [chatKey, setChatKey] = useState(0);

  return (
    <div className="flex h-[calc(100dvh-160px)] min-h-[520px] flex-col">
      <TypewriterCaption />

      <ChatWidget key={chatKey} onNewConversation={() => setChatKey((k) => k + 1)} />
    </div>
  );
}
