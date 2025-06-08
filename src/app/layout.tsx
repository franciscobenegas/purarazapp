import type { Metadata } from "next";
import { Noto_Sans_Display } from "next/font/google";
import "./globals.css";
// import SessionProvider from "../app/components/SessionProvider";
import Navbar from "@/components/Navbar/Navbar";
import { Sidebar } from "@/components/Sidebar";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "./authOptions";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ThemeDataProvider from "../context/theme-data-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Analytics } from "@vercel/analytics/next";

const noto = Noto_Sans_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestion Ganadera | PuraRazApp",
  description:
    "App de gestión ganadera que permite controlar en tiempo real los niveles de existencias, entradas y salidas del Ganado. Optimiza el seguimiento de inventarios, reduce errores y facilita la toma de decisiones con reportes automáticos y alertas personalizables",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession(authOptions);
  const session = {
    user: {
      name: "", //"Francisco",
      email: "", //"franciscobenegas@gmail.com",
    },
  };

  return (
    <html lang="es">
      <body className={noto.className}>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          {/* <SessionProvider> */}
          <ThemeDataProvider>
            <SidebarProvider>
              <div className="flex w-full h-full">
                {/* hidden xl:block w-80 h-full xl:fixed bg-red-500 */}
                <div
                  className={cn(
                    "h-full  hidden",
                    session?.user?.name && "xl:block w-72 xl:fixed"
                  )}
                >
                  <Sidebar />
                </div>

                {/* w-full xl:ml-80 bg-orange-300 */}

                <div
                  className={cn("w-full", session?.user?.name && "xl:ml-72")}
                >
                  <Navbar />
                  <div className="p-3 bg-[#fafbfc] dark:bg-secondary">
                    {children}
                    <Analytics />
                    <Toaster />
                  </div>
                </div>
              </div>
            </SidebarProvider>
          </ThemeDataProvider>
          {/* </SessionProvider> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
