"use server";

import { redirect } from "next/navigation";
import { passcodeMatches, grantSession } from "@/lib/auth";

export async function enter(formData: FormData): Promise<void> {
  const code = String(formData.get("passcode") ?? "");
  if (!passcodeMatches(code)) redirect("/?error=1");
  await grantSession();
  redirect("/");
}
