// src/app/login/page.tsx
import LoginButton from "@/components/LoginButton";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Sign in to AI Flow</h1>
      <LoginButton />
    </div>
  );
}
