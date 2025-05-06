'use client';

import { useEffect } from 'react';

interface JsonLdProps {
  type: 'WebSite' | 'WebPage' | 'Article' | 'BreadcrumbList';
  data: any;
}

export function JsonLd({ type, data }: JsonLdProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [type, data]);

  return null;
}

export function WebsiteJsonLd() {
  const data = {
    name: 'Pomo! 家計簿',
    description: '完全無料で使える、シンプルで使いやすい家計簿アプリ。収支の管理や予算の設定、グラフによる分析機能を提供します。',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com',
    potentialAction: {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return <JsonLd type="WebSite" data={data} />;
}

export function WebPageJsonLd({ 
  title, 
  description, 
  path 
}: { 
  title: string; 
  description: string; 
  path: string; 
}) {
  const data = {
    name: title,
    description: description,
    url: `${process.env.NEXT_PUBLIC_APP_URL}${path}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Pomo! 家計簿',
      url: process.env.NEXT_PUBLIC_APP_URL
    }
  };

  return <JsonLd type="WebPage" data={data} />;
}

export function BreadcrumbJsonLd({ 
  items 
}: { 
  items: { name: string; path: string; }[] 
}) {
  const data = {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_APP_URL}${item.path}`
    }))
  };

  return <JsonLd type="BreadcrumbList" data={data} />;
} 