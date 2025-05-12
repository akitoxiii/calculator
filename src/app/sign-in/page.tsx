import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function SignInPage() {
  const router = useRouter();

  // ゲストログイン処理（Supabase匿名認証）
  const handleGuestLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        alert('ゲストログインに失敗しました: ' + error.message);
        return;
      }
      // 成功時はトップページへ遷移
      router.push('/');
    } catch (e) {
      alert('ゲストログインで予期せぬエラーが発生しました');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-12 py-16 px-4">
        {/* 左側：テキスト・ボタン */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-8">
          <div>
            <span className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              自分に合った <span className="text-blue-500">家計管理スタイル</span> を作れる<br />家計簿アプリ
            </span>
          </div>
          <p className="text-base md:text-lg text-gray-700 font-medium mb-2">
            カレンダー・統計・資産管理・カテゴリ編集など、<br />必要な機能だけONにして自由にカスタマイズ。<br />シンプル＆直感的な操作で毎日続く！
          </p>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto justify-center md:justify-start">
            <button onClick={() => router.push('/sign-up')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition w-full md:w-auto">ユーザー登録</button>
            <button onClick={() => router.push('/sign-in')} className="px-6 py-3 bg-white text-blue-600 font-bold border border-blue-600 rounded-lg shadow hover:bg-blue-50 transition w-full md:w-auto">ログイン</button>
            <button onClick={handleGuestLogin} className="px-6 py-3 bg-white text-gray-700 font-bold border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition w-full md:w-auto">ゲストログイン</button>
          </div>
        </div>
        {/* 右側：イラスト画像 */}
        <div className="flex-1 flex items-center justify-center gap-8">
          <div className="bg-white rounded-2xl shadow p-8 flex items-center justify-center">
            <img src="/kakeibo-illust.png" alt="家計簿アプリイラスト" className="w-64 h-auto transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl cursor-pointer" />
          </div>
          <div className="bg-white rounded-2xl shadow p-8 flex items-center justify-center">
            <img src="/kakeibo-illust2.png" alt="家計簿アプリイラスト2" className="w-64 h-auto transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
} 