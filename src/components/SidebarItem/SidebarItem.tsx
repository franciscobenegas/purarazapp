"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarItemProps {
  item: {
    label: string;
    icon: LucideIcon;
    href: string;
  };
  key: string;
  onItemClick?: () => void;
}

export function SidebarItem(props: SidebarItemProps) {
  const { item, onItemClick } = props;
  const { href, icon: Icon, label } = item;
  const pathname = usePathname();
  const activePath = pathname === href;

  return (
    <Link
      href={href}
      onClick={onItemClick}
      className={cn(
        "flex gap-x-2  mt-2 light:text-slate-700 dark:text-white text-sm items-center hover:bg-slate-300/20 p-2 rounded-lg cursor-pointer hover:text-blue-500",
        activePath && "bg-slate-400/20 text-blue-500",
      )}
    >
      <Icon className="h-5 w-5 hover:text-blue-700" strokeWidth={1} />
      {label}
    </Link>
  );
}
