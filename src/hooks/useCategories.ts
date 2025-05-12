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
      console.log('[DEBUG] Loading categories for user:', user.id);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        console.error('[DEBUG] カテゴリ取得エラー:', error);
        return;
      }
      // カテゴリが0件なら初期データを自動挿入
      if (data && data.length === 0) {
        console.log('[DEBUG] No categories found, inserting default categories');
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
          console.error('[DEBUG] カテゴリ挿入エラー:', insertError);
          return;
        }
        // 再取得
        const { data: newData, error: newError } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id);
        if (newError) {
          console.error('[DEBUG] カテゴリ再取得エラー:', newError);
          return;
        }
        console.log('[DEBUG] Loaded categories after insert:', newData);
        setCategories(newData || []);
      } else {
        console.log('[DEBUG] Loaded existing categories:', data);
        setCategories(data || []);
      }
    } catch (error) {
      console.error('[DEBUG] カテゴリ操作エラー:', error);
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