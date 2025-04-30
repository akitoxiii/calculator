import { useState, useEffect } from 'react';
import { Category } from '@/types/expense';
import { storage } from '@/utils/storage';
import { DEFAULT_CATEGORIES } from '@/data/initialData';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Category>>({});

  useEffect(() => {
    const savedCategories = storage.getCategories();
    if (savedCategories.length === 0) {
      // 初期カテゴリーを設定
      storage.saveCategories(DEFAULT_CATEGORIES);
      setCategories(DEFAULT_CATEGORIES);
    } else {
      setCategories(savedCategories);
    }
  }, []);

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    const updatedCategories = categories.map((category) =>
      category.id === id ? { ...category, ...data } : category
    );
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
    setIsEditing(null);
    setEditData({});
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter((category) => category.id !== id);
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
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