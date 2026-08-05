"use client";

import { usePathname } from "next/navigation";
import ChatWidget from "./ChatWidget";

/** Hides the customer-facing chat widget on /admin — the owner dashboard shouldn't show it. */
export default function ConditionalChatWidget() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <ChatWidget />;
}
