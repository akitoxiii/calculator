-- transactions テーブルの type カラムの情報を取得
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'transactions' 
    AND column_name = 'type';

-- type カラムの制約（check constraints）を確認
SELECT 
    con.conname as constraint_name,
    con.contype as constraint_type,
    pg_get_constraintdef(con.oid) as constraint_definition
FROM 
    pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE 
    rel.relname = 'transactions'
    AND pg_get_constraintdef(con.oid) LIKE '%type%';

-- type カラムが列挙型の場合、その値を確認
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM 
    pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    JOIN information_schema.columns c ON t.typname = c.udt_name
WHERE 
    c.table_name = 'transactions'
    AND c.column_name = 'type'
ORDER BY 
    e.enumsortorder; 