import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function GET(req) {
  const code = new URL(req.url).searchParams.get("code");

  if (!code) {
    return new Response("No code provided", { status: 400 });
  }

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_GITHUB_OAUTH_ID,
          client_secret: process.env.GITHUB_OAUTH_SECRET,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    const { access_token } = tokenData;

    if (!access_token) {
      return new Response("GitHub login failed", { status: 400 });
    }

    const jwtToken = jwt.sign({ access_token }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });
    cookies().set("auth", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      maxAge: 3600, // 1 hour
      path: "/",
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
  redirect("/dashboard");
}
