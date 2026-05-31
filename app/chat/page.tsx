"use client";

import { useEffect, useRef, useState } from "react";

// One message in the conversation.
type Message = {
  id: number;
  from: "you" | "minddumper";
  text: string;
};

export default function ChatPage() {
  // The list of messages. We start with a gentle welcome from MindDumper.
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: "minddumper",
      text: "hey, tum yahaan ho — that's enough for now. kya chal raha hai?",
    },
  ]);
  // What the person is currently typing.
  const [draft, setDraft] = useState("");
  // True while MindDumper is "thinking" (so we can show a typing hint).
  const [thinking, setThinking] = useState(false);

  // Used to auto-scroll to the newest message.
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Send the typed message, then echo it back 1 second later.
  function send() {
    const text = draft.trim();
    if (!text) return;

    const mine: Message = { id: Date.now(), from: "you", text };
    setMessages((prev) => [...prev, mine]);
    setDraft("");
    setThinking(true);

    // No real AI yet — just echo the same words back as MindDumper.
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        from: "minddumper",
        text,
      };
      setMessages((prev) => [...prev, reply]);
      setThinking(false);
    }, 1000);
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#e7efe3] via-[#f4ecd9] to-[#e6eef2]">
      {/* Header */}
      <header className="flex items-center gap-2 px-5 py-4 text-stone-600">
        <span className="h-3 w-3 rounded-full bg-[#9bb38f]" aria-hidden />
        <span className="text-sm italic">listening</span>
      </header>

      {/* Messages */}
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-3 overflow-y-auto px-5 pb-4">
        {messages.map((m) => (
          <Bubble key={m.id} from={m.from} text={m.text} />
        ))}

        {thinking && (
          <div className="self-start rounded-2xl rounded-bl-sm bg-[#f6e7d3]/70 px-4 py-2 text-stone-400 italic">
            typing…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="mx-auto w-full max-w-xl px-5 pb-6">
        <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="type here…"
            aria-label="type a message"
            className="flex-1 bg-transparent text-stone-700 placeholder-stone-400
                       focus:outline-none"
          />
          <button
            onClick={send}
            className="rounded-full bg-[#5b7053] px-5 py-1.5 text-sm font-medium
                       text-stone-50 transition hover:bg-[#4e6147]
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5b7053]"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}

// A single chat bubble. "You" sits on the right; MindDumper on the left.
function Bubble({ from, text }: { from: Message["from"]; text: string }) {
  const isYou = from === "you";
  return (
    <div
      className={[
        "max-w-[80%] rounded-2xl px-4 py-2 text-stone-700",
        isYou
          ? "self-end rounded-br-sm bg-[#dbe7d4]" // your messages: soft sage
          : "self-start rounded-bl-sm bg-[#f6e7d3]", // MindDumper: soft warm peach/cream
      ].join(" ")}
    >
      {text}
    </div>
  );
}
