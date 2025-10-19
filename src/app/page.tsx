"use client";

import { SplineSceneBasic } from "./components/ui/demo";
import { useSession } from "@/hooks/useSession";
import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useSession();
  const router = useRouter();

  if (user?.message === "No esta Logeado") {
    // o null mientras redirecciona
    router.push("/auth/login");
  }

  return <div>{user?.usuario !== "" ? <SplineSceneBasic /> : <Loading />}</div>;
}
