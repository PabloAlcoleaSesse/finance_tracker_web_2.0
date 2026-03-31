import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isDev = process.env.NODE_ENV !== "production";

function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let value = "";
  bytes.forEach((byte) => {
    value += String.fromCharCode(byte);
  });
  return btoa(value);
}

function buildCsp(nonce: string): string {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!apiBaseUrl) {
    throw new Error("Missing required env var NEXT_PUBLIC_API_BASE_URL");
  }
  const apiOrigin = new URL(apiBaseUrl).origin;

  const connectSrc = ["'self'", apiOrigin, "https:"];
  if (isDev) {
    connectSrc.push("ws:", "wss:");
  }

  // Permitir scripts y estilos de self y de _next/static y _next/
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'", // Next.js puede inyectar inline scripts
    "https:",
    "'unsafe-eval'" // Necesario para desarrollo, puedes quitarlo en prod si no usas eval
  ];
  const styleSrc = [
    "'self'",
    "'unsafe-inline'",
    "https:"
  ];

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "frame-src 'none'",
    "manifest-src 'self'",
    "media-src 'self'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `style-src ${styleSrc.join(' ')}`,
    `script-src ${scriptSrc.join(' ')}`,
    `connect-src ${connectSrc.join(' ')}`,
  ];

  if (!isDev) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join('; ');
}

export function middleware(request: NextRequest) {
  const nonce = createNonce();
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
