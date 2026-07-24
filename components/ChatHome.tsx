"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChatWidget from "./ChatWidget";

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
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center font-serif text-lg text-secondary md:text-xl"
      >
        Fammi una domanda veloce o vai nell&apos;
        <span className="text-gold">Area di Ricerca e Lavoro</span> di AI
        Aurora Studio.
      </motion.p>

      <ChatWidget key={chatKey} onNewConversation={() => setChatKey((k) => k + 1)} />
    </div>
  );
}
