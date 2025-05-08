import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'お問い合わせ - マイリー家計簿',
  description: 'マイリー家計簿に関するお問い合わせはこちらからお願いいたします。',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">お問い合わせ</h1>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <ContactForm />
      </div>
    </div>
  );
} 