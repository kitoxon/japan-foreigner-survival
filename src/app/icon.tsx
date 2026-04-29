import { createAppIcon } from "@/lib/icon-response";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return createAppIcon(32);
}
