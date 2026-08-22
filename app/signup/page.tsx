import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "حساب جديد",
  description: "أنشئي حسابك في منصة MIHAN وابدئي رحلتك المهنية اليوم.",
};

export default function SignupPage() {
  return <SignupForm />;
}
