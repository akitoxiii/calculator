import { SignUpComponent } from '../../../components/auth/SignUpComponent';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  return <SignUpComponent />;
}

export function generateStaticParams() {
  return [
    { "sign-up": [] },
    { "sign-up": ["start"] },
    { "sign-up": ["verify"] },
    { "sign-up": ["complete"] }
  ];
} 