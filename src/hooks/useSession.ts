import { useEffect, useState } from "react";

export function useSession() {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    email: "",
    usuario: "",
    establesimiento: "",
    rol: "",
  });

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("[useSession] - Error al obtener el perfil:", error);
        setLoading(false);
      }
    };

    obtenerPerfil();
  }, []);

  return { user, loading };
}
