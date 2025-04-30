import { supabase } from './supabase';

export const insertSampleData = async () => {
  try {
    // 現在のユーザーを取得
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('ユーザーが見つかりません');
      return;
    }

    const userId = user.id;
    console.log('サンプルデータを挿入するユーザーID:', userId);

    // public.usersテーブルにユーザーが存在するか確認
    const { data: publicUser, error: publicUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('既存のユーザー情報:', publicUser);

    if (publicUserError || !publicUser) {
      console.log('public.usersテーブルにユーザーを作成します');
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email: user.email,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (createUserError) {
        console.error('ユーザー作成エラー:', createUserError);
        throw new Error(`ユーザー作成エラー: ${createUserError.message}`);
      }
      console.log('作成されたユーザー:', newUser);
    }

    // カテゴリーの存在確認
    const { data: existingCategories, error: categoryCheckError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId);

    if (categoryCheckError) {
      console.error('カテゴリー確認エラー:', categoryCheckError);
      throw new Error(`カテゴリー確認エラー: ${categoryCheckError.message}`);
    }

    console.log('既存のカテゴリー:', existingCategories);

    if (existingCategories && existingCategories.length > 0) {
      console.log('カテゴリーが既に存在するため、サンプルデータは挿入しません');
      return;
    }

    // デフォルトカテゴリーを挿入（支出カテゴリー）
    console.log('支出カテゴリーを挿入中...');
    const expenseCategoriesData = [
      { user_id: userId, name: 'サブスク', type: 'expense', color: '#FF6384' },
      { user_id: userId, name: 'ネットショッピング', type: 'expense', color: '#36A2EB' },
      { user_id: userId, name: '家賃', type: 'expense', color: '#FFCE56' },
      { user_id: userId, name: '通信費', type: 'expense', color: '#4BC0C0' },
      { user_id: userId, name: 'ガス', type: 'expense', color: '#9966FF' }
    ];

    console.log('挿入する支出カテゴリーデータ:', expenseCategoriesData);

    const { data: expenseCategories, error: expenseError } = await supabase
      .from('categories')
      .insert(expenseCategoriesData)
      .select();

    if (expenseError) {
      console.error('支出カテゴリー挿入エラー:', expenseError);
      throw new Error(`支出カテゴリー挿入エラー: ${expenseError.message}`);
    }

    if (!expenseCategories || expenseCategories.length === 0) {
      console.error('支出カテゴリーが正しく挿入されませんでした');
      return;
    }

    console.log('挿入された支出カテゴリー:', expenseCategories);

    // 収入カテゴリーを挿入
    console.log('収入カテゴリーを挿入中...');
    const incomeCategoriesData = [
      { user_id: userId, name: '給与', type: 'income', color: '#4CAF50' },
      { user_id: userId, name: 'ボーナス', type: 'income', color: '#8BC34A' },
      { user_id: userId, name: '副業収入', type: 'income', color: '#CDDC39' }
    ];

    console.log('挿入する収入カテゴリーデータ:', incomeCategoriesData);

    const { data: incomeCategories, error: incomeError } = await supabase
      .from('categories')
      .insert(incomeCategoriesData)
      .select();

    if (incomeError) {
      console.error('収入カテゴリー挿入エラー:', incomeError);
      throw new Error(`収入カテゴリー挿入エラー: ${incomeError.message}`);
    }

    if (!incomeCategories || incomeCategories.length === 0) {
      console.error('収入カテゴリーが正しく挿入されませんでした');
      return;
    }

    console.log('挿入された収入カテゴリー:', incomeCategories);

    // サンプルの支出データを生成
    const expenses = [];
    const startDate = new Date('2024-04-01');
    const endDate = new Date('2024-04-30');
    const allCategories = [...expenseCategories, ...incomeCategories];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const isIncome = Math.random() < 0.2;
      const categories = isIncome ? incomeCategories : expenseCategories;
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      if (!randomCategory) {
        console.warn('カテゴリーが見つかりません:', { isIncome, categories });
        continue;
      }

      const amount = isIncome
        ? Math.floor(Math.random() * 300000) + 200000
        : Math.floor(Math.random() * 10000) + 500;

      expenses.push({
        user_id: userId,
        category_id: randomCategory.id,
        amount: amount,
        type: isIncome ? 'income' : 'expense',
        memo: `サンプルデータ ${date.toLocaleDateString()}`,
        date: new Date(date).toISOString().split('T')[0]
      });
    }

    console.log(`${expenses.length}件の支出データを挿入します:`, expenses[0]);

    // 支出データを挿入（バッチ処理）
    const batchSize = 10;
    for (let i = 0; i < expenses.length; i += batchSize) {
      const batch = expenses.slice(i, i + batchSize);
      const { error: expensesError } = await supabase
        .from('expenses')
        .insert(batch);

      if (expensesError) {
        console.error(`バッチ ${i/batchSize + 1} の挿入エラー:`, expensesError);
        throw new Error(`支出データ挿入エラー: ${expensesError.message}`);
      }
      console.log(`バッチ ${i/batchSize + 1} を挿入完了`);
    }

    console.log('すべてのサンプルデータが正常に挿入されました');
    return true;
  } catch (error) {
    console.error('サンプルデータ挿入エラー:', error);
    throw error;
  }
}; 