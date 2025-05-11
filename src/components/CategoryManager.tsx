import { useState, useEffect } from 'react';
import { Category } from '@/types/expense';
import { supabase } from '@/utils/supabase';

interface CategoryManagerProps {
  onCategoryChange: (categories: Category[]) => void;
}

export function CategoryManager({ onCategoryChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<any>(null);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    type: 'expense',
    color: '#000000',
    user_id: '',
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id);
    if (!error) {
      setCategories(data || []);
      onCategoryChange(data || []);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !user) return;
    const { error } = await supabase
      .from('categories')
      .insert([{ ...newCategory, user_id: user.id || '' }]);
    if (!error) fetchCategories();
    setNewCategory({
      name: '',
      type: 'expense',
      color: '#000000',
      user_id: '',
    });
  };

  const handleDeleteCategory = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (!error) fetchCategories();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">カテゴリー管理</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            placeholder="カテゴリー名"
            className="flex-1 p-2 border rounded"
          />
          <select
            value={newCategory.type}
            onChange={(e) =>
              setNewCategory({
                ...newCategory,
                type: e.target.value as 'income' | 'expense',
              })
            }
            className="p-2 border rounded"
          >
            <option value="expense">支出</option>
            <option value="income">収入</option>
          </select>
          <input
            type="color"
            value={newCategory.color}
            onChange={(e) =>
              setNewCategory({ ...newCategory, color: e.target.value })
            }
            className="w-10 h-10 p-1 border rounded"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            追加
          </button>
        </div>

        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
                <span className="text-sm text-gray-500">
                  ({category.type === 'income' ? '収入' : '支出'})
                </span>
              </div>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="px-2 py-1 text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 