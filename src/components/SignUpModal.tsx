import { SignUp } from '@clerk/nextjs';

export default function SignUpModal() {
  return <SignUp appearance={{ elements: { footer: { display: 'none' } } }} />;
} 