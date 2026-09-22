"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  badge,
  onClick,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "row-span-1 rounded-2xl group/bento hover:shadow-2xl transition duration-300 shadow-input dark:shadow-none p-5 dark:bg-[#111624] dark:border-white/10 bg-white border border-transparent justify-between flex flex-col space-y-4 cursor-pointer relative overflow-hidden glass-panel glass-panel-hover",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover/bento:scale-110 group-hover/bento:text-white group-hover/bento:bg-indigo-500/30 transition-all duration-300">
            {icon}
          </div>
          {badge}
        </div>
        <div className="font-bold text-xl text-white mb-1.5 flex items-center gap-2">
          {title}
        </div>
        <div className="font-normal text-xs text-neutral-400 leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};
