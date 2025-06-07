import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");

  return (
    <div>
      <h1>Redireccionando al Dashborad</h1>
    </div>
  );
}
