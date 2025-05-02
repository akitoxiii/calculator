import { SignUpComponent } from '../../../components/auth/SignUpComponent';

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