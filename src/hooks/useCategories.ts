import { useState, useEffect } from 'react';
import { Category, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/types/expense';
import { createBrowserSupabaseClient } from '@/utils/supabase';
import { useUser } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Category>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      loadCategories();
    }
  }, [isLoaded, isSignedIn, user]);

  const loadCategories = async () => {
    if (!isLoaded || !isSignedIn || !user || isLoading) return;
    
    try {
      setIsLoading(true);
      const token = await getToken({ template: 'supabase' });
      console.log('JWT token (loadCategories):', token);
      if (!token) {
        console.error('認証トークンの取得に失敗しました');
        return;
      }

      const supabase = createBrowserSupabaseClient(token);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('カテゴリ取得エラー:', error);
        return;
      }

      // カテゴリが0件なら初期データを自動挿入
      if (data && data.length === 0) {
        console.log('user.id:', user.id);
        const defaultCategories = [
          ...DEFAULT_EXPENSE_CATEGORIES,
          ...DEFAULT_INCOME_CATEGORIES,
        ].map(cat => ({
          ...cat,
          user_id: user.id,
          id: uuidv4(),
        }));
        console.log('defaultCategories:', defaultCategories);
        
        const { error: insertError } = await supabase
          .from('categories')
          .insert(defaultCategories);
        
        if (insertError) {
          console.error('カテゴリ挿入エラー:', insertError);
          return;
        }

        // 再取得
        const { data: newData, error: newError } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id);

        if (newError) {
          console.error('カテゴリ再取得エラー:', newError);
          return;
        }

        setCategories(newData || []);
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('カテゴリ操作エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!isLoaded || !isSignedIn || !user || isLoading) return;
    
    try {
      setIsLoading(true);
      const token = await getToken({ template: 'supabase' });
      console.log('JWT token (addCategory):', token);
      if (!token) {
        alert('認証トークンの取得に失敗しました。再ログインしてください。');
        return;
      }

      const supabase = createBrowserSupabaseClient(token);
      const payload = { ...category, user_id: user.id, id: uuidv4() };
      console.log('addCategory payload:', payload);

      const { error } = await supabase
        .from('categories')
        .insert([payload]);

      if (error) {
        console.error('カテゴリ追加エラー:', error);
        alert('カテゴリの追加に失敗しました。');
        return;
      }

      await loadCategories();
    } catch (error) {
      console.error('カテゴリ追加エラー:', error);
      alert('カテゴリの追加に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    if (!user) return;
    const token = await getToken({ template: 'supabase' });
    const supabase = createBrowserSupabaseClient(token ?? undefined);
    const { error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id);
    if (!error) loadCategories();
    setIsEditing(null);
    setEditData({});
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    const token = await getToken({ template: 'supabase' });
    const supabase = createBrowserSupabaseClient(token ?? undefined);
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (!error) loadCategories();
  };

  const startEditing = (category: Category) => {
    setIsEditing(category.id);
    setEditData(category);
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setEditData({});
  };

  return {
    categories,
    isEditing,
    editData,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    startEditing,
    cancelEditing,
  };
}; 