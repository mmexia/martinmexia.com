import { NextResponse, type NextRequest } from "next/server";

const MARTINMEXIA_HOSTS = new Set(["martinmexia.com", "www.martinmexia.com"]);

export function middleware(req: NextRequest) {
  const host = req.headers.get("host")?.toLowerCase() ?? "";
  if (MARTINMEXIA_HOSTS.has(host)) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/bautizo", "/bautizo/:path*"],
};
