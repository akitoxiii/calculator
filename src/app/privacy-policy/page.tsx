import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div
      className="container mx-auto px-4 py-8 max-w-4xl sm:px-2 sm:py-4 pb-40"
      style={{ overflowX: 'auto', overflowY: 'auto', scrollbarGutter: 'stable' }}
    >
      <h1 className="text-3xl sm:text-2xl font-bold mb-8 sm:mb-4">プライバシーポリシー</h1>
      
      <section className="mb-8 sm:mb-4">
        <h2 className="text-2xl sm:text-xl font-semibold mb-4 sm:mb-2">1. 個人情報の収集について</h2>
        <p className="mb-4 sm:mb-2 text-base sm:text-sm">
          当アプリケーションでは、以下の目的で個人情報を収集する場合があります：
        </p>
        <ul className="list-disc pl-6 mb-4 sm:pl-4 sm:mb-2 text-base sm:text-sm">
          <li>ユーザーアカウントの管理</li>
          <li>サービスの提供・改善</li>
          <li>お問い合わせへの対応</li>
        </ul>
      </section>

      <section className="mb-8 sm:mb-4">
        <h2 className="text-2xl sm:text-xl font-semibold mb-4 sm:mb-2">2. 収集する情報</h2>
        <p className="mb-4 sm:mb-2 text-base sm:text-sm">
          当アプリケーションでは、以下の情報を収集する場合があります：
        </p>
        <ul className="list-disc pl-6 mb-4 sm:pl-4 sm:mb-2 text-base sm:text-sm">
          <li>メールアドレス</li>
          <li>ユーザー名</li>
          <li>利用履歴</li>
          <li>デバイス情報</li>
        </ul>
      </section>

      <section className="mb-8 sm:mb-4">
        <h2 className="text-2xl sm:text-xl font-semibold mb-4 sm:mb-2">3. クッキーの使用</h2>
        <p className="mb-4 sm:mb-2 text-base sm:text-sm">
          当アプリケーションでは、以下の目的でクッキーを使用しています：
        </p>
        <ul className="list-disc pl-6 mb-4 sm:pl-4 sm:mb-2 text-base sm:text-sm">
          <li>ユーザーセッションの維持</li>
          <li>サービスの利用状況の分析</li>
          <li>ユーザー体験の向上</li>
        </ul>
      </section>

      <section className="mb-8 sm:mb-4">
        <h2 className="text-2xl sm:text-xl font-semibold mb-4 sm:mb-2">4. 情報の利用目的</h2>
        <p className="mb-4 sm:mb-2 text-base sm:text-sm">
          収集した情報は、以下の目的で利用されます：
        </p>
        <ul className="list-disc pl-6 mb-4 sm:pl-4 sm:mb-2 text-base sm:text-sm">
          <li>サービスの提供・運営</li>
          <li>ユーザーサポート</li>
          <li>サービスの改善</li>
          <li>セキュリティの確保</li>
        </ul>
      </section>

      <section className="mb-8 sm:mb-4">
        <h2 className="text-2xl sm:text-xl font-semibold mb-4 sm:mb-2">5. 情報の保護</h2>
        <p className="mb-4 sm:mb-2 text-base sm:text-sm">
          当アプリケーションでは、収集した個人情報の保護に最大限の注意を払い、適切なセキュリティ対策を実施しています。
        </p>
      </section>

      <section className="mb-8 sm:mb-4">
        <h2 className="text-2xl sm:text-xl font-semibold mb-4 sm:mb-2">6. お問い合わせ</h2>
        <p className="mb-4 sm:mb-2 text-base sm:text-sm">
          プライバシーポリシーに関するお問い合わせは、お問い合わせフォームよりご連絡ください。
        </p>
      </section>

      <section className="mb-8 sm:mb-4">
        <h2 className="text-2xl sm:text-xl font-semibold mb-4 sm:mb-2">7. 改定について</h2>
        <p className="mb-4 sm:mb-2 text-base sm:text-sm">
          本プライバシーポリシーは、必要に応じて改定される場合があります。重要な変更がある場合は、アプリケーション内でお知らせします。
        </p>
      </section>

      <p className="text-sm sm:text-xs text-gray-600">
        最終更新日: 2025年5月8日
      </p>
    </div>
  );
} 