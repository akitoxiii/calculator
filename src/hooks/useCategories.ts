import { useState, useEffect } from 'react';
import { Category, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/types/expense';
import { supabase } from '@/utils/supabase';
import { v4 as uuidv4 } from 'uuid';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Category>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    if (!user || isLoading) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        return;
      }

      // カテゴリが0件の場合のみ初期データを挿入
      if (!data || data.length === 0) {
        const defaultCategories = [
          ...DEFAULT_EXPENSE_CATEGORIES,
          ...DEFAULT_INCOME_CATEGORIES,
        ].map(cat => ({
          ...cat,
          user_id: user.id,
          id: uuidv4(),
        }));

        const { error: insertError } = await supabase
          .from('categories')
          .insert(defaultCategories);
        if (insertError) {
          return;
        }

        // 挿入後のデータを再取得
        const { data: newData, error: newError } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id);
        if (newError) {
          return;
        }
        setCategories(newData || []);
      } else {
        // 既存のカテゴリをそのまま設定
        setCategories(data);
      }
    } catch (error) {
      // エラー処理
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!user || isLoading) return;
    try {
      setIsLoading(true);
      const payload = { ...category, user_id: user.id, id: uuidv4() };
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
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    startEditing,
    cancelEditing,
  };
}; 