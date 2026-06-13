import type { Metadata } from "next";
import "./register.css";
import "../auth/auth.css";

export const metadata: Metadata = {
  title: "Register — YatraSetu",
  description: "Create your YatraSetu account.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
