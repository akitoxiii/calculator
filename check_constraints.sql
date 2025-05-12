-- transactionsテーブルの全ての制約を確認
SELECT 
    con.conname as constraint_name,
    con.contype as constraint_type,
    pg_get_constraintdef(con.oid) as constraint_definition
FROM 
    pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE 
    rel.relname = 'transactions';

-- テーブルの全カラム情報を確認
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'transactions';

-- 重複データがないか確認
SELECT 
    user_id, 
    amount, 
    type, 
    date, 
    from_account, 
    to_account, 
    note,
    COUNT(*) as count
FROM 
    transactions
GROUP BY 
    user_id, amount, type, date, from_account, to_account, note
HAVING 
    COUNT(*) > 1; 