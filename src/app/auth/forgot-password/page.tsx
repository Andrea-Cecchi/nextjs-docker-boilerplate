import { Suspense } from "react";
import ForgotPasswordForm from "~/components/auth/forgot-password-form";

function ForgotPasswordWrapper() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    }>
      <ForgotPasswordForm />
    </Suspense>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordWrapper />
      </div>
    </div>
  );
}
