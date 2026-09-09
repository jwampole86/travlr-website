import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";

const AGENT_NAME = "concierge";
const STORAGE_KEY = "travlr_concierge_conversation_id";

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [localMode, setLocalMode] = useState(false);
  const [visible, setVisible] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Reveal the chat button once the user scrolls past the hero
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Initialize / resume conversation when first opened
  useEffect(() => {
    if (!open || conversationId) return;
    let unsub = () => {};
    (async () => {
      try {
        setLoading(true);
        let id = localStorage.getItem(STORAGE_KEY);
        let conv;
        if (id) {
          try {
            conv = await base44.agents.getConversation(id);
          } catch {
            conv = null;
          }
        }
        if (!conv) {
          conv = await base44.agents.createConversation({
            agent_name: AGENT_NAME,
            metadata: { name: "TRAVLR Concierge Chat" },
          });
          id = conv.id;
        }
        localStorage.setItem(STORAGE_KEY, id);
        setConversationId(id);
        setMessages(conv.messages || []);
        unsub = base44.agents.subscribeToConversation(id, (data) => {
          setMessages(data.messages || []);
        });
      } catch {
        const id = `local-${Date.now()}`;
        localStorage.setItem(STORAGE_KEY, id);
        setConversationId(id);
        setLocalMode(true);
        setMessages([
          {
            role: "assistant",
            content: "Hi, I am the TRAVLR concierge. I can help with vacation homes, destinations, guest services, and planning your stay.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
    return () => unsub();
  }, [open, conversationId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open && !loading) inputRef.current?.focus();
  }, [open, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending || !conversationId) return;
    setInput("");
    setSending(true);
    if (localMode) {
      const response = getLocalResponse(text);
      setMessages((current) => [
        ...current,
        { role: "user", content: text },
        { role: "assistant", content: response },
      ]);
      setSending(false);
      return;
    }
    try {
      const conv = { id: conversationId, messages };
      await base44.agents.addMessage(conv, { role: "user", content: text });
    } catch {
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with TRAVLR concierge"}
        className={`fixed bottom-20 lg:bottom-6 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#b89968] text-white shadow-lg hover:bg-[#a68858] transition-all hover:scale-105 active:scale-95 ${
          visible || open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {open ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-36 lg:bottom-24 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px] h-[70vh] max-h-[560px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#b89968] text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium tracking-wide text-sm">TRAVLR Concierge</p>
              <p className="text-xs text-white/80">
                {loading ? "Connecting..." : "Here to help you find your stay"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#f8f6f3]"
          >
            {loading && messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-[#b89968] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!loading &&
              messages.map((m, i) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={i}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? "bg-[#b89968] text-white rounded-br-sm"
                          : "bg-white text-gray-700 border border-gray-200 rounded-bl-sm"
                      }`}
                    >
                      {m.content ? (
                        isUser ? (
                          <p className="whitespace-pre-wrap">{m.content}</p>
                        ) : (
                          <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          </div>
                        )
                      ) : (
                        <span className="text-gray-400 italic">...</span>
                      )}
                      {m.tool_calls?.map((tc, idx) => (
                        <ToolCallBadge key={idx} toolCall={tc} />
                      ))}
                    </div>
                  </div>
                );
              })}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a property or area..."
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 bg-[#f8f6f3] text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#b89968] focus:ring-1 focus:ring-[#b89968]"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending || loading}
              aria-label="Send message"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#b89968] text-white hover:bg-[#a68858] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function getLocalResponse(text) {
  const question = text.toLowerCase();
  if (question.includes("service") || question.includes("concierge")) {
    return "TRAVLR can arrange dedicated concierge support, private chef services, daily housekeeping, pre-villa stocking, transportation, and in-home spa experiences. Visit Guest Services to explore the options.";
  }
  if (question.includes("palm desert") || question.includes("desert")) {
    return "Palm Desert is a favorite for golf, dining, El Paseo, and spacious resort-style homes. I can help you browse homes or explore the Palm Desert area guide.";
  }
  if (question.includes("home") || question.includes("property") || question.includes("stay")) {
    return "We have 30 curated vacation homes across desert, mountain, and coastal destinations. Start with Vacation Homes to compare locations, bedrooms, nightly rates, and amenities.";
  }
  return "I can help you find a TRAVLR vacation home, explore destinations, arrange guest services, or plan a stay. Tell me what kind of trip you have in mind.";
}

function ToolCallBadge({ toolCall }) {
  const status = toolCall.status;
  const failed =
    status === "failed" ||
    status === "error" ||
    (typeof toolCall.results === "string" && /error|failed/i.test(toolCall.results));
  const label =
    toolCall.display_projection?.label ||
    (toolCall.name === "Property" ? "Searching properties" : toolCall.name === "Lead" ? "Saving your request" : toolCall.name);
  const dot =
    status === "pending" || status === "running" || status === "in_progress"
      ? "bg-amber-400 animate-pulse"
      : failed
      ? "bg-red-400"
      : "bg-green-400";
  return (
    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span className="capitalize">{label}</span>
    </div>
  );
}