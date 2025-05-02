'use client';

import { SignIn } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default function SignInPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700',
              footerActionLink: 'text-indigo-600 hover:text-indigo-700',
            },
          }}
        />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [
    { "sign-in": [] },
    { "sign-in": ["start"] },
    { "sign-in": ["verify"] },
    { "sign-in": ["complete"] }
  ];
} 