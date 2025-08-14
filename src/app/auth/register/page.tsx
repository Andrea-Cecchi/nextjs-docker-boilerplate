import { Suspense } from "react";
import SignUp from "~/components/auth/sign-up";

function SignUpWrapper() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">
          <div className="h-96 w-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    }>
      <SignUp />
    </Suspense>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <SignUpWrapper />
    </div>
  );
}
