import Link from 'next/link';

export default function TermsContent() {
  return (
    <div className="container mx-auto px-4 py-8 prose">
      <nav className="text-sm mb-4">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <span>利用規約</span>
      </nav>
      
      <h1 className="text-2xl font-bold mb-6">利用規約</h1>
      
      <div className="space-y-6 text-sm">
        <p>本利用規約（以下「本規約」）は、当アプリケーションの利用条件を定めるものです。</p>
        
        <p>本アプリケーションは、家計簿の記録・管理を目的としたサービスを提供します。利用者は本規約に同意の上でサービスを利用するものとします。</p>
        
        <p>当アプリケーションは、利用者に事前の通知なく、本規約およびサービス内容を変更できるものとします。</p>
        
        <p>本規約に関するお問い合わせは<Link href="/contact" className="text-blue-600 hover:underline">お問い合わせフォーム</Link>よりご連絡ください。</p>
      </div>
    </div>
  );
} 