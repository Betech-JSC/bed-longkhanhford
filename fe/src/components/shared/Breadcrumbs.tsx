"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  // Build full list starting with Home
  const fullList: BreadcrumbItem[] = [
    { label: "Trang chủ", href: "/" },
    ...items,
  ];

  // Generate JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": fullList.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://longkhanhford.com.vn${item.href}` : undefined,
    })),
  };

  return (
    <>
      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visual Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-1.5 text-xs text-gray-500 overflow-x-auto py-2.5 scrollbar-none select-none ${className}`}
      >
        {fullList.map((item, index) => {
          const isLast = index === fullList.length - 1;
          const isFirst = index === 0;

          return (
            <div key={index} className="flex items-center space-x-1.5 flex-shrink-0">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              )}

              {isLast || !item.href ? (
                <span className="font-medium text-gray-900 truncate max-w-[200px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#002f6c] transition-colors flex items-center gap-1 hover:underline"
                >
                  {isFirst && <Home className="w-3.5 h-3.5 -mt-0.5" />}
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
