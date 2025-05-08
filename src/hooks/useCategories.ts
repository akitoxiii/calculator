import { useState, useEffect } from 'react';
import { Category, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/types/expense';
import { supabase } from '@/utils/supabase';
import { useUser } from '@clerk/nextjs';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Category>>({});
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id);

    // カテゴリが0件なら初期データを自動挿入
    if (!error && data && data.length === 0) {
      const defaultCategories = [
        ...DEFAULT_EXPENSE_CATEGORIES,
        ...DEFAULT_INCOME_CATEGORIES,
      ].map(cat => ({
        ...cat,
        user_id: user.id,
        id: undefined, // idはDB側で自動生成
      }));
      await supabase.from('categories').insert(defaultCategories);
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
    const { error } = await supabase
      .from('categories')
      .insert([{ ...category, user_id: user.id }]);
    if (!error) loadCategories();
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    if (!user) return;
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