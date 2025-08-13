import { Suspense } from "react";
import SignUp from "~/components/auth/sign-up";

function SignUpWrapper() {
  return (
    <Suspense fallback={
      <div className="bg-background flex min-h-screen items-center justify-center">
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
    <div className="bg-background flex min-h-screen items-center justify-center">
      <SignUpWrapper />
    </div>
  );
}
