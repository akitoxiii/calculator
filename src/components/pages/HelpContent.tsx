import Link from 'next/link';

export default function HelpContent() {
  return (
    <div className="container mx-auto px-4 py-8 prose">
      <nav className="text-sm mb-4">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <span>ヘルプ</span>
      </nav>
      
      <h1 className="text-2xl font-bold mb-6">ヘルプ</h1>
      
      <div className="space-y-6 text-sm">
        <section>
          <h2 className="text-xl font-semibold mb-4">基本的な使い方</h2>
          <p>家計簿の記録は簡単です。以下の手順で行えます：</p>
          <ul className="list-disc pl-6">
            <li>「収入/支出を追加」ボタンをクリック</li>
            <li>日付、カテゴリー、金額を入力</li>
            <li>必要に応じてメモを追加</li>
            <li>保存ボタンをクリック</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">よくある質問</h2>
          <p>ご不明点がございましたら、<Link href="/contact" className="text-blue-600 hover:underline">お問い合わせフォーム</Link>よりご連絡ください。</p>
        </section>
      </div>
    </div>
  );
} 