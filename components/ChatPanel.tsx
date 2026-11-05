"use client";
import { useEffect, useRef, useState } from "react";
import { chatHistory, requestChat } from "@/lib/api";
import type { ChatMessage, Idea } from "@/lib/schema";
import { Close } from "./icons";

const STARTERS = ["Make this easier to finish in my timeline", "How can I make this more research-focused?", "What should we build in the first month?"];

interface Props {
  idea: Idea;
  messages: ChatMessage[];
  onMessages: (messages: ChatMessage[]) => void;
  onClose: () => void;
}

export function ChatPanel({ idea, messages, onMessages, onClose }: Props) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    field.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    end.current?.scrollIntoView?.({ block: "end" });
  }, [messages, sending]);

  const send = async (text: string) => {
    const value = text.trim().slice(0, 2000);
    if (!value || sending) return;
    const next: ChatMessage[] = [...messages, { role: "user", text: value }];
    onMessages(next);
    setInput("");
    setSending(true);
    setError(null);
    try {
      const { reply } = await requestChat(idea, chatHistory(next));
      onMessages([...next, { role: "model", text: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Refine with AI chat"
        className="flex h-full w-full max-w-[460px] flex-col bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <h2 className="font-bold">Refine with AI chat</h2>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted">{idea.title}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close chat" className="rounded p-1 text-muted hover:text-ink"><Close className="h-4 w-4" /></button>
        </div>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5" aria-live="polite">
          {messages.length === 0 ? (
            <div className="flex flex-col gap-2">
              <p className="mb-1 text-sm text-muted">Ask anything about this idea, or start with:</p>
              {STARTERS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} className="rounded-lg border border-line px-3 py-2 text-left text-[13px] hover:bg-soft">{s}</button>
              ))}
            </div>
          ) : null}
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[88%] whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "self-end bg-ink text-white" : "self-start bg-soft text-ink"}`}>
              {m.text}
            </div>
          ))}
          {sending ? <div className="self-start rounded-xl bg-soft px-3.5 py-2.5 text-sm text-muted">Thinking...</div> : null}
          {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
          <div ref={end} />
        </div>
        <form
          className="flex items-end gap-2 border-t border-line p-4"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <textarea
            ref={field}
            rows={2}
            aria-label="Your message"
            className="input resize-none"
            maxLength={2000}
            placeholder="Ask about this idea..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />
          <button type="submit" disabled={sending || !input.trim()} className="btn-dark h-11 px-4">Send</button>
        </form>
      </aside>
    </div>
  );
}
