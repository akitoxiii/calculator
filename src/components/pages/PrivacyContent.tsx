import { lazy } from 'react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import Link from 'next/link';

const PolicySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </section>
);

const sections = [
  {
    title: '1. 個人情報の収集と利用',
    content: (
      <>
        <p>当アプリは、以下の目的で個人情報を収集・利用します：</p>
        <ul className="list-disc pl-6">
          <li>アカウントの作成と管理</li>
          <li>サービスの提供と改善</li>
          <li>お問い合わせへの対応</li>
        </ul>
      </>
    ),
  },
  {
    title: '2. 情報の保護',
    content: <p>当アプリは、収集した個人情報を適切に管理し、不正アクセス、紛失、破壊、改ざん、漏洩などを防止するための措置を講じます。</p>,
  },
  {
    title: '3. 第三者への提供',
    content: (
      <>
        <p>当アプリは、以下の場合を除き、個人情報を第三者に提供しません：</p>
        <ul className="list-disc pl-6">
          <li>法令に基づく場合</li>
          <li>ユーザーの同意がある場合</li>
          <li>人の生命、身体または財産の保護のために必要がある場合</li>
        </ul>
      </>
    ),
  },
  {
    title: '4. プライバシーポリシーの変更',
    content: <p>当アプリは、必要に応じて本ポリシーを変更することがあります。変更があった場合は、本ページでお知らせします。</p>,
  },
  {
    title: '5. お問い合わせ',
    content: <p>プライバシーポリシーに関するお問い合わせは、お問い合わせフォームよりご連絡ください。</p>,
  },
];

export default function PrivacyContent() {
  return (
    <div className="container mx-auto px-4 py-8 prose">
      <nav className="text-sm mb-4">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <span>プライバシーポリシー</span>
      </nav>
      
      <h1 className="text-2xl font-bold mb-6">プライバシーポリシー</h1>
      
      <div className="space-y-6 text-sm">
        <p>当アプリは、ユーザーのプライバシーを尊重し、適切な個人情報の取り扱いを行います。収集した情報は、サービス提供・改善、アカウント管理、お問い合わせ対応の目的でのみ使用します。</p>
        
        <p>情報は適切に管理され、法令に基づく場合やユーザーの同意がある場合を除き、第三者への提供は行いません。</p>
        
        <p>本ポリシーは予告なく変更される場合があります。変更時は本ページでお知らせします。</p>
        
        <p>ご不明点は<Link href="/contact" className="text-blue-600 hover:underline">お問い合わせフォーム</Link>よりご連絡ください。</p>
      </div>
    </div>
  );
} 