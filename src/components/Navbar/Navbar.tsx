"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Power, ChevronLeft, ChevronRight } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarRoutes } from "../SidebarRoutes";
import { ToggleTheme } from "../ToggleTheme";
import { ThemeColorToggle } from "@/app/components/theme-color-toggle";
import { useSession } from "@/hooks/useSession";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useSession();
  const { open, toggleSidebar } = useSidebar();
  const [openPopover, setOpenPopover] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);

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
        <div className="flex items-center gap-x-2">
          <div className="block xl:hidden">
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger className="flex items-center">
                <Menu />
              </SheetTrigger>
              <SheetContent side="left">
                <SidebarRoutes onItemClick={() => setOpenSheet(false)} />
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden xl:block">
            {open ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                title="Ocultar menú"
              >
                <ChevronLeft size={20} />
              </Button>
            ) : (
              <div className="flex items-center gap-x-2">
                <Popover open={openPopover} onOpenChange={setOpenPopover}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" title="Mostrar menú">
                      <Menu size={20} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="right" align="start" className="w-80 p-0">
                    <div className="max-h-[600px] overflow-y-auto">
                      <SidebarRoutes onItemClick={() => setOpenPopover(false)} />
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  title="Expandir menú"
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </div>
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
                      src={user.foto ?? ""}
                      alt={user.usuario ?? ""}
                    />
                    <AvatarFallback>
                      {user.usuario?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
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
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push("/perfil")}
                  >
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
