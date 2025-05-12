-- 既存の制約を削除
ALTER TABLE transactions DROP CONSTRAINT transactions_type_check;

-- 新しい制約を追加（日本語と英語の両方を許可）
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check 
CHECK (type = ANY (ARRAY['支払い'::text, '振替'::text, '貯金'::text, 'savings'::text, 'transfer'::text])); 