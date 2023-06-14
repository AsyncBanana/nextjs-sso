import { currentUser, RedirectToSignIn, SignOutButton } from "@clerk/nextjs";
import buttonStyle from "../button.module.css";

export default async function Page() {
  const userdata = await currentUser();
  if (!userdata) {
    return <RedirectToSignIn />;
  }
  return (
    <div>
      <h1
        style={{
          "text-align": "center",
          "margin-top": "100px",
        }}
      >
        Welcome {userdata.emailAddresses[0].emailAddress} to the dashboard!
      </h1>
      <SignOutButton>
        <button className={buttonStyle.button}>Logout</button>
      </SignOutButton>
    </div>
  );
}
