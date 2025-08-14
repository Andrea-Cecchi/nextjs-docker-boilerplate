import { Suspense } from "react";
import ResetPasswordForm from "~/components/auth/reset-password-form";

function ResetPasswordWrapper() {
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
      <ResetPasswordForm />
    </Suspense>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Nuova Password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Inserisci la tua nuova password
          </p>
        </div>
        <ResetPasswordWrapper />
      </div>
    </div>
  );
}
