-- デフォルトカテゴリーの追加
INSERT INTO public.categories (id, name, user_id, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  name,
  auth.uid(),
  NOW(),
  NOW()
FROM (
  VALUES 
    ('食費'),
    ('交通費'),
    ('住居費'),
    ('光熱費'),
    ('通信費'),
    ('医療費'),
    ('教育費'),
    ('娯楽費'),
    ('その他')
) AS default_categories(name)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories 
  WHERE user_id = auth.uid()
); 