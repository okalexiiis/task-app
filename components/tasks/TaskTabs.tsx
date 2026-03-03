"use client";
import { TaskStatus, TaskStatusEnum } from "@/entities/Task";
import { statusTranslations } from "@/utils/translations";
import clsx from "clsx";

interface TaskTabsProps {
  activeTab: TaskStatusEnum;
  onTabChange: (tab: TaskStatusEnum) => void;
}

const TABS: TaskStatusEnum[] = [...TaskStatus];

export default function TaskTabs({ activeTab, onTabChange }: TaskTabsProps) {
  return (
    <div className="flex border-b border-muted/50 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={clsx(
            "py-2 px-4 font-mono text-sm transition-colors",
            {
              "text-accent border-b-2 border-accent": activeTab === tab,
              "text-secondary hover:text-primary": activeTab !== tab,
            },
          )}
        >
          {statusTranslations[tab]}
        </button>
      ))}
    </div>
  );
}
