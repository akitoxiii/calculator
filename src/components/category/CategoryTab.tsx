'use client';

import { useState, useEffect } from 'react';
import type { Category, CategoryType } from '@/types/expense';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/types/expense';
import { storage } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/utils/supabase';

export const CategoryTab = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryType>('expense');
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const savedCategories = storage.getCategories();
    setCategories(savedCategories);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !user) return;

    const category: Category = {
      id: uuidv4(),
      name: newCategory.trim(),
      type: activeTab,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      user_id: user.id,
    };

    // Supabaseにinsert
    const { error } = await supabase.from('categories').insert([category]);
    if (error) {
      alert('カテゴリーの追加に失敗しました: ' + error.message);
      return;
    }
    // ローカルにも保存
    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
    setNewCategory('');
  };

  const handleEditStart = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleEditSave = () => {
    if (!editingId || !editingName.trim()) return;

    const updatedCategories = categories.map((category) =>
      category.id === editingId
        ? { ...category, name: editingName.trim() }
        : category
    );

    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = (id: string) => {
    if (!confirm('このカテゴリーを削除してもよろしいですか？')) return;

    const updatedCategories = categories.filter(
      (category) => category.id !== id
    );
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
  };

  const handleResetCategories = () => {
    if (!confirm('カテゴリーをデフォルトの状態にリセットしてもよろしいですか？')) return;

    const defaultCategories = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];
    setCategories(defaultCategories);
    storage.saveCategories(defaultCategories);
  };

  const filteredCategories = categories.filter(
    (category) => category.type === activeTab
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">カテゴリー管理</h2>
          <button
            onClick={handleResetCategories}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            デフォルトに戻す
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-1 border-b mb-4">
            <button
              onClick={() => setActiveTab('expense')}
              className={`px-4 py-2 ${
                activeTab === 'expense'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              支出カテゴリー
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-4 py-2 ${
                activeTab === 'income'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              収入カテゴリー
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="新しいカテゴリーを入力"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddCategory();
              }
            }}
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            追加
          </button>
        </div>

        <div className="space-y-2">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
              style={{ borderLeft: `4px solid ${category.color}` }}
            >
              {editingId === category.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 p-2 border rounded mr-2"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleEditSave();
                    }
                  }}
                  autoFocus
                />
              ) : (
                <span>{category.name}</span>
              )}
              <div className="flex gap-2">
                {editingId === category.id ? (
                  <>
                    <button
                      onClick={handleEditSave}
                      className="text-green-600 hover:text-green-800"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditStart(category)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      削除
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              カテゴリーがありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 