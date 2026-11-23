import { NextRequest, NextResponse } from "next/server";

// Protege /admin y /api/admin con usuario y contraseña (Basic Auth).
export function middleware(req: NextRequest) {
  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const credenciales = atob(header.slice(6));
    const corte = credenciales.indexOf(":"); // la contraseña puede contener ":"
    const user = credenciales.slice(0, corte);
    const pass = credenciales.slice(corte + 1);
    const { ADMIN_USER, ADMIN_PASS } = process.env;
    if (corte > 0 && ADMIN_USER && ADMIN_PASS && user === ADMIN_USER && pass === ADMIN_PASS) {
      return NextResponse.next();
    }
  }
  return new NextResponse("Acceso restringido", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Fractale Admin"' },
  });
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
