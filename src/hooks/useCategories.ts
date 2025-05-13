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
      console.log('useCategories: ユーザー情報を取得:', user);
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      console.log('useCategories: ユーザーが設定されたのでカテゴリーを読み込みます');
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    if (!user || isLoading) {
      console.log('useCategories: ユーザーが存在しないか、ロード中です');
      return;
    }
    try {
      setIsLoading(true);
      console.log('useCategories: カテゴリーを読み込み中...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('useCategories: カテゴリー読み込みエラー:', error);
        return;
      }
      
      console.log('useCategories: 読み込んだカテゴリー:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('useCategories: 予期せぬエラー:', error);
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