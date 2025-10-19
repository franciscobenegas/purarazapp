import ChatBox from "./components/ChatBox";
import { getUserFromToken } from "@/utils/getUserFromToken";

export default function ChatPage() {
  const user = getUserFromToken();
  const { usuario } = user || {};
  // if (!usuario) {
  //   return redirect("/");
  // }
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-100 p-4 rounded-2xl shadow-md mb-5">
        <h1 className="text-2xl font-bold text-gray-800 text-primary">
          ¡Hola, soy VAKI!
        </h1>
        <p className="text-lg text-gray-700">
          ¿En qué puedo ayudarte,{" "}
          <span className="font-semibold">{usuario}</span>?
        </p>
      </div>

      <ChatBox />
    </div>
  );
}
