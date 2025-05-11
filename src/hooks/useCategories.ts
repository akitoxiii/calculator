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
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;
    const token = await getToken({ template: 'supabase' });
    const supabase = createBrowserSupabaseClient(token ?? undefined);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id);

    // カテゴリが0件なら初期データを自動挿入
    if (!error && data && data.length === 0) {
      console.log('user.id:', user.id);
      const defaultCategories = [
        ...DEFAULT_EXPENSE_CATEGORIES,
        ...DEFAULT_INCOME_CATEGORIES,
      ].map(cat => ({
        ...cat,
        user_id: user.id || '',
        id: uuidv4(), // idを必ずuuidで生成
      }));
      console.log('defaultCategories:', defaultCategories);
      const { error: insertError } = await supabase.from('categories').insert(defaultCategories);
      if (insertError) {
        console.error('カテゴリ挿入エラー:', JSON.stringify(insertError, null, 2));
      }
      // 再取得
      const { data: newData } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id);
      setCategories(newData || []);
      return;
    }

    if (!error) setCategories(data || []);
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!user) return;
    const token = await getToken({ template: 'supabase' });
    const supabase = createBrowserSupabaseClient(token ?? undefined);
    const payload = { ...category, user_id: user.id, id: uuidv4() };
    console.log('addCategory payload:', payload);
    const { error } = await supabase
      .from('categories')
      .insert([payload]);
    if (!error) loadCategories();
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
    addCategory,
    updateCategory,
    deleteCategory,
    startEditing,
    cancelEditing,
  };
}; 