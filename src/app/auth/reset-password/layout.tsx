import type { ReactNode } from "react";

export default function ResetPasswordLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="w-full">{children}</div>
      </body>
    </html>
  );
}
