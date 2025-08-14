import { Suspense } from "react";
import { LoginForm } from "~/components/auth/login-form";

function LoginFormWrapper() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Benvenuto in Farmix
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Accedi al tuo account per continuare
            </p>
          </div>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Benvenuto in Farmix
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Accedi al tuo account per continuare
          </p>
        </div>
        <LoginFormWrapper />
      </div>
    </div>
  );
}
