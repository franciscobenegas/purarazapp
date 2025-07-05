import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
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
          "HTTP-Referer": "http://localhost:3000", // o tu dominio en producción
          "X-Title": "MiChatApp", // nombre de tu app
        },
        body: JSON.stringify({
          model: "openai/gpt-4o", // o llama3, mistral, gpt-4o, etc. -- meta-llama/llama-3-70b-instruct
          messages: [{ role: "user", content: message }],
        }),
      }
    );

    const data = await response.json();

    console.log("data", data);

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
