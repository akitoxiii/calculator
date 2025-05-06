// UUIDを8-4-4-4-12形式に正規化する関数
export function normalizeUUID(id: string): string {
  const hex = id.replace(/-/g, '');
  if (hex.length !== 32) return id;
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20)
  ].join('-');
} 