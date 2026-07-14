"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "white" | "white-outline" | "outline-gray";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer select-none border";

  // Fully rounded pill corners matching ford.co.uk
  const roundedStyle = "rounded-full";

  const variantStyles = {
    primary:
      "bg-[#066FEF] hover:bg-[#0562D2] text-white border-[#066FEF] hover:border-[#0562D2]",
    secondary:
      "bg-[#00095B] hover:bg-[#002F6C] text-white border-[#00095B] hover:border-[#002F6C]",
    outline:
      "bg-transparent border-[#066FEF] text-[#066FEF] hover:bg-[#066FEF] hover:text-white",
    ghost: "bg-transparent hover:bg-neutral-50 text-neutral-600 hover:text-black border-transparent",
    white: "bg-white hover:bg-neutral-50 text-black border-white hover:border-neutral-50",
    "white-outline":
      "bg-transparent border-white text-white hover:bg-white hover:text-black hover:border-white",
    "outline-gray":
      "bg-transparent border-neutral-300 text-neutral-600 hover:bg-neutral-50 hover:text-black hover:border-neutral-400",
  };

  const sizeStyles = {
    sm: "h-10 px-6 text-sm",
    md: "h-12 px-8 text-sm",
    lg: "h-14 px-10 text-base",
  };

  const combinedStyles = `${baseStyles} ${roundedStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a href={href} className={combinedStyles} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
}
