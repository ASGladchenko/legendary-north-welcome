import type { Metadata } from "next";

import { PasswordForm } from "./password-form";

export const metadata: Metadata = {
  title: "Change Password | Legendary North",
};

export default function PasswordPage() {
  return <PasswordForm />;
}
