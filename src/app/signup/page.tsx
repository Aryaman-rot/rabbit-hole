import { SignupForm } from "./signup-form";

export default async function SignupPage({
  searchParams,
}: PageProps<"/signup">) {
  const { mode } = await searchParams;
  return <SignupForm isLogin={mode === "login"} />;
}
