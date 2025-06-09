// app/login/layout.tsx
import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className=" p-2">{children}</div>
      </body>
    </html>
  );
}
