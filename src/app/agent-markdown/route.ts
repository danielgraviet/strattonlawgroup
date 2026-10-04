import { NextRequest } from "next/server";
import { markdownForPath } from "@/lib/agent-content";

export function GET(request: NextRequest) {
  const originalPath =
    request.headers.get("x-agent-original-path") ?? request.nextUrl.searchParams.get("path") ?? "/";

  const result = markdownForPath(originalPath);
  return new Response(result.body, {
    status: result.status,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      vary: "Accept, Accept-Encoding",
      "cache-control": "public, max-age=300"
    }
  });
}
