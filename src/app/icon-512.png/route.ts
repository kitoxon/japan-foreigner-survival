import { createAppIcon } from "@/lib/icon-response";

export function GET() {
  return createAppIcon(512);
}
