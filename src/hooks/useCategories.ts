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
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('useCategories: ユーザー情報を取得:', user);
        setUser(user);
      } catch (error) {
        console.error('useCategories: ユーザー情報取得エラー:', error);
        // エラー時は匿名ユーザーとして扱う
        setUser({ id: 'anonymous' });
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    loadCategories();
  }, [user]);

  const loadCategories = async () => {
    if (isLoading) {
      console.log('useCategories: ロード中です');
      return;
    }
    try {
      setIsLoading(true);
      console.log('useCategories: カテゴリーを読み込み中...');
      
      let query = supabase.from('categories').select('*');
      
      // ユーザーIDがある場合はそのユーザーのカテゴリーを取得
      if (user?.id && user.id !== 'anonymous') {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query;
      
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
    if (isLoading) return;
    try {
      setIsLoading(true);
      const payload = { 
        ...category, 
        user_id: user?.id || 'anonymous', 
        id: uuidv4() 
      };
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
    const { error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id);
    if (!error) loadCategories();
    setIsEditing(null);
    setEditData({});
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
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