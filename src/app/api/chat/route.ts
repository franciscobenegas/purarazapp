import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/getUserFromToken";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "Servicio no configurado" }, { status: 503 });
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
          "X-Title": "PuraRazApp",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [{ role: "user", content: message }],
        }),
      }
    );

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sin respuesta.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error al usar OpenRouter:", error);
    return NextResponse.json(
      { error: "Fallo al obtener respuesta" },
      { status: 500 }
    );
  }
}
