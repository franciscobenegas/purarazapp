"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  //redirect("/dashboard");
  router.push("/dashboard");

  return (
    <div>
      <h1>Redireccionando al Dashborad</h1>
    </div>
  );
}
