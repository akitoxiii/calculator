'use client';

import Link from 'next/link';
import { BreadcrumbJsonLd } from '../seo/JsonLd';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [
    { name: 'ホーム', path: '/' },
    ...items
  ];

  return (
    <>
      <BreadcrumbJsonLd items={allItems} />
      <nav className="text-sm mb-4">
        <Link href="/" className="hover:underline">ホーム</Link>
        {allItems.map((item, index) => (
          <span key={index}>
            <span className="mx-2">/</span>
            {index === allItems.length - 1 ? (
              <span>{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:underline">
                {item.name}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
} 