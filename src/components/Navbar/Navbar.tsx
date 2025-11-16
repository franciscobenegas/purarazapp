"use client";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Power, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarRoutes } from "../SidebarRoutes";
import { ToggleTheme } from "../ToggleTheme";
import { ThemeColorToggle } from "@/app/components/theme-color-toggle";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useSession();

  useEffect(() => {
    if (!loading && user.usuario === "") {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout");
    } catch (error) {
      console.error(error);
    }
    router.push("/auth/login");
  };

  // Si está cargando, no mostrar nada o mostrar un loader
  if (loading) {
    return null; // o puedes retornar un <LoadingSpinner /> si prefieres
  }

  // Si no está logeado, no mostrar el navbar
  if (user.message === "No esta Logeado" || user.usuario === "") {
    return null;
  }

  return (
    <nav>
      <div className="flex items-center px-2 gap-x-4 md:px-6 justify-between w-full bg-background border-b h-20 ">
        <div className="block xl:hidden">
          <Sheet>
            <SheetTrigger className="flex items-center">
              <Menu />
            </SheetTrigger>
            <SheetContent side="left">
              <SidebarRoutes />
            </SheetContent>
          </Sheet>
        </div>
        <div className="relative w-[300px]">
          <Input placeholder="Buscar..." className="rounded-lg" />
          <Search strokeWidth={1} className="absolute top-2 right-2" />
        </div>
        <div className="flex gap-x-2 items-center">
          <div className="flex mr-2">
            <div className="flex gap-2 items-center justify-center">
              <div className="hidden md:block">
                <ThemeColorToggle />
              </div>
              <ToggleTheme />
            </div>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={"https://github.com/shadcn.png"}
                      alt="User Image"
                    />
                    <AvatarFallback>{user.usuario}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-3">
                    <p className="text-sm font-medium leading-none">
                      {user.usuario}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-sm font-medium leading-none">
                      {user.rol}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <div className={user.email ? "hidden" : "block"}>
                    <DropdownMenuItem>
                      <div>Iniciar</div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuItem className="cursor-pointer">
                    Configuraciones
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Ayuda
                  </DropdownMenuItem>
                  <div className="md:hidden block">
                    <DropdownMenuItem>
                      <ThemeColorToggle />
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <div
                    onClick={() => logout()}
                    className="flex justify-between cursor-pointer"
                  >
                    <p>Salir</p>
                    <Power className="h-10 w-10 mr-5" />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
