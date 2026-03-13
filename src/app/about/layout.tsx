import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "愈见 YuJian — 产品展示",
  description: "面向大学生的AI情绪疗愈助手，每天3分钟，看见更好的自己",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
