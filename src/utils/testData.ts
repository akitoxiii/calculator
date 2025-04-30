import { supabase } from './supabase';

export const createTestUser = async () => {
  try {
    // 既存のセッションをクリア
    await supabase.auth.signOut();

    const email = 'test@example.com';
    const password = 'test123456';

    console.log('テストユーザー作成開始:', { email });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('ユーザー作成エラー:', error);
      throw new Error(`ユーザー作成エラー: ${error.message}`);
    }

    if (!data.user) {
      throw new Error('ユーザーデータが取得できませんでした');
    }

    console.log('テストユーザーが作成されました:', data.user);
    return {
      email,
      password,
      userId: data.user.id
    };
  } catch (error) {
    console.error('予期せぬエラー:', error);
    throw error;
  }
};

export const insertTestData = async () => {
  try {
    const userId = '85abb669-fcbf-460a-a338-3ec01c72ef45'; // akito62226@gmail.comのユーザーID

    // カテゴリーデータの挿入
    const categories = [
      { name: '食費', type: 'expense', user_id: userId },
      { name: '交通費', type: 'expense', user_id: userId },
      { name: '給与', type: 'income', user_id: userId },
      { name: '副業', type: 'income', user_id: userId }
    ];

    console.log('カテゴリーデータ挿入開始:', categories);

    const { data: insertedCategories, error: categoryError } = await supabase
      .from('categories')
      .insert(categories)
      .select();

    if (categoryError) {
      console.error('カテゴリーの挿入エラー:', categoryError);
      throw new Error(`カテゴリーの挿入エラー: ${categoryError.message}`);
    }

    console.log('カテゴリーデータ挿入成功:', insertedCategories);

    // 支出データの挿入
    const expenses = [
      {
        amount: 5000,
        date: new Date().toISOString().split('T')[0],
        category_id: insertedCategories[0].id,
        user_id: userId,
        type: 'expense',
        memo: 'スーパーでの買い物'
      },
      {
        amount: 2000,
        date: new Date().toISOString().split('T')[0],
        category_id: insertedCategories[1].id,
        user_id: userId,
        type: 'expense',
        memo: '電車代'
      }
    ];

    console.log('支出データ挿入開始:', expenses);

    const { error: expenseError } = await supabase
      .from('expenses')
      .insert(expenses);

    if (expenseError) {
      console.error('支出データの挿入エラー:', expenseError);
      throw new Error(`支出データの挿入エラー: ${expenseError.message}`);
    }

    console.log('支出データの挿入が完了しました');
    return true;
  } catch (error) {
    console.error('予期せぬエラー:', error);
    throw error;
  }
}; 