import Link from 'next/link';

export default function SettingsContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm mb-4">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <span>設定</span>
      </nav>
      
      <h1 className="text-2xl font-bold mb-6">設定</h1>
      
      <div className="space-y-8">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">アカウント設定</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="example@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">パスワード</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
              更新する
            </button>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">通知設定</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="monthly-report"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="monthly-report" className="ml-2 block text-sm text-gray-700">
                月次レポートの通知
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="budget-alert"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="budget-alert" className="ml-2 block text-sm text-gray-700">
                予算超過の通知
              </label>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">データ管理</h2>
          <div className="space-y-4">
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
              データをエクスポート
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
              アカウントを削除
            </button>
          </div>
        </section>
      </div>
    </div>
  );
} 