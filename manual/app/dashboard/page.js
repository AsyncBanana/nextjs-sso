import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import buttonStyle from "../button.module.css";

export default async function Page() {
  const auth = cookies().get("auth");
  if (!auth) {
    redirect(
      `https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.NEXT_PUBLIC_GITHUB_OAUTH_ID}`
    );
    return;
  }
  const user = jwt.verify(auth.value, process.env.JWT_SECRET);
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${user.access_token}`,
    },
    cache: "no-store",
  });
  const userdata = await response.json();
  return (
    <div>
      <h1
        style={{
          "text-align": "center",
          "margin-top": "100px",
        }}
      >
        Welcome {userdata.name} to the dashboard!
      </h1>
      <a href="/logout" className={buttonStyle.button}>
        Logout
      </a>
    </div>
  );
}
