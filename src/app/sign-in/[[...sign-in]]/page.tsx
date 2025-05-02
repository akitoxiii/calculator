import { SignInComponent } from '../../../components/auth/SignInComponent';

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