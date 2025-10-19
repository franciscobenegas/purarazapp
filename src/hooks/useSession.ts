import { useEffect, useState } from "react";

type User = {
  email?: string;
  usuario?: string;
  establesimiento?: string;
  rol?: string;
  message?: string;
};

export function useSession() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("[useSession] - Error al obtener el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfil();
  }, []);

  return { user, loading };
}
