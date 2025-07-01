"use client";

import { useState } from "react";
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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulación de respuesta de IA (puedes reemplazar esto por una llamada real)
    setTimeout(() => {
      const aiResponse: Message = {
        from: "ai",
        text: `Respuesta automática a: "${userMessage.text}"`,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);
    }, 2500);
  };

  return (
    <Card className="p-4 space-y-4 shadow-xl">
      <ScrollArea className="h-96 border rounded-md p-2 bg-muted ">
        <div className="flex flex-col space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg max-w-xs ${
                msg.from === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-100 text-black self-start"
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
        />
        <Button type="submit" disabled={loading}>
          <Send className="w-12 h-12" />
        </Button>
      </form>
    </Card>
  );
}
