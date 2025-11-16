"use client";

import { SplineSceneBasic } from "./components/ui/demo";
import { useSession } from "@/hooks/useSession";
import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useSession(); // Asumiendo que tu hook tiene un estado de loading
  const router = useRouter();

  useEffect(() => {
    // Si ya se cargó el usuario y no está logeado, redirigir
    if (user && user.message === "No esta Logeado") {
      router.push("/auth/login");
    }
  }, [user, router]);

  // Mostrar loading mientras se carga la sesión
  if (loading || !user) {
    return <Loading />;
  }

  // Si el usuario está logeado, mostrar el componente principal
  if (user.message !== "No esta Logeado") {
    return <SplineSceneBasic />;
  }

  // Estado intermedio (mientras se redirige)
  return <Loading />;
}

// "use client";

// import { SplineSceneBasic } from "./components/ui/demo";
// import { useSession } from "@/hooks/useSession";
// import Loading from "@/components/Loading/Loading";
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const { user } = useSession();
//   const router = useRouter();

//   if (user?.message === "No esta Logeado") {
//     // o null mientras redirecciona
//     router.push("/auth/login");
//   }

//   return (
//     <div>
//       {user?.usuario !== "" && user?.message !== "No esta Logeado" ? (
//         <SplineSceneBasic />
//       ) : (
//         <Loading />
//       )}
//     </div>
//   );
// }
