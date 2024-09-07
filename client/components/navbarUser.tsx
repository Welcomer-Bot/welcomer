import { auth } from "../lib/options/auth";

import NavbarUserDropdown from "./navbarUserDropdown";
import { SignIn } from "./signinButton";

export default async function NavbarUser(): Promise<JSX.Element> {
  const session = await auth();

  if (!session?.user)
    return (
      <div>
        <SignIn />
      </div>
    );

  return (
    <span>
      <NavbarUserDropdown session={session} />
    </span>
  );
}
