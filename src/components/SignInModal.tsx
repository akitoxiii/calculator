import { SignIn } from '@clerk/nextjs';

export default function SignInModal() {
  return <SignIn appearance={{ elements: { footer: { display: 'none' } } }} />;
} 