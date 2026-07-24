import type { Metadata } from "next";
import ChatHome from "@/components/ChatHome";

export const metadata: Metadata = {
  title: "Chat | AI Aurora Studio",
};

export default function ChatPage() {
  return (
    <div className="min-h-[calc(100dvh-65px)] bg-white">
      <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        <ChatHome />
      </div>
    </div>
  );
}
