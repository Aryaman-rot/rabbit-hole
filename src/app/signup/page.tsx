import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center p-4 sm:p-6">
      <section className="rh-glass rh-panel-in w-full max-w-md p-6 text-center sm:p-8">
        <h1 className="text-2xl font-bold text-white">Sign up is coming next</h1>
        <p className="mt-3 text-sm text-primary-soft">
          The real sign-up flow will live here.
        </p>
        <Link
          href="/onboarding"
          className="rh-focus rh-quiet mt-4 inline-block"
        >
          Back to the pitch
        </Link>
      </section>
    </main>
  );
}