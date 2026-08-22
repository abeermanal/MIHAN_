import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "سجلي الدخول إلى منصة MIHAN لمتابعة مسارك المهني.",
};

export default function LoginPage() {
  return <LoginForm />;
}
