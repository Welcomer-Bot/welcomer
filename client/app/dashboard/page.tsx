import { SignIn } from "./../../components/signinButton";

import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session?.user)
    return (
      <div>
        <SignIn />
      </div>
    );

  return (
    <span>
      {session.user.name}
      {session.user.image}
    </span>
  );
}
