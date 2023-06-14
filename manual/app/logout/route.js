import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function GET(req) {
  cookies().delete("auth");
  redirect("/");
}
