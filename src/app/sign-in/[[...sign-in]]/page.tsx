import { SignInComponent } from '../../../components/auth/SignInComponent';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return <SignInComponent />;
}

export function generateStaticParams() {
  return [
    { "sign-in": [] },
    { "sign-in": ["start"] },
    { "sign-in": ["verify"] },
    { "sign-in": ["complete"] }
  ];
} 