"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";

interface Message {
  from: "user" | "ai";
  text: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 👇 Referencia al final del scroll
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 👇 Scroll automático cada vez que cambian los mensajes o el estado de carga
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        from: "ai",
        text: data.reply || "No se recibió respuesta.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error al comunicarse con la IA:", error);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Hubo un error al responder." },
      ]);
    }

    setLoading(false);
  };

  return (
    <Card className="p-4 space-y-4 shadow-xl">
      <ScrollArea className="h-96 border rounded-md p-2 bg-muted">
        <div className="flex flex-col space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg  ${
                msg.from === "user"
                  ? "bg-blue-500 text-white self-end max-w-xs"
                  : "bg-gray-100 text-black self-start m-6"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="text-sm text-muted-foreground italic">
              IA está escribiendo...{" "}
              <Loader2 className="inline animate-spin" size={16} />
            </div>
          )}
          {/* 👇 Esto asegura que siempre se vea el final */}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <Input
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </Card>
  );
}
