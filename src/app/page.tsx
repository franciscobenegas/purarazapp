"use client";

import { SplineSceneBasic } from "./components/ui/demo";
import { useSession } from "@/hooks/useSession";
import Loading from "@/components/Loading/Loading";

export default function Home() {
  const { user } = useSession();

  return <div>{user?.usuario !== "" ? <SplineSceneBasic /> : <Loading />}</div>;
}
