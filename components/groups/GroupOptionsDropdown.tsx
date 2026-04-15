"use client";
import { useState, useRef, useEffect } from "react";
import { GroupRoleEnum } from "@/entities/Group";
import { GroupPermissions } from "@/shared/group-permissions";

interface GroupOptionsDropdownProps {
  role: GroupRoleEnum;
  onRename: () => void;
  onDelete: () => void;
  onLeave: () => void;
}

export default function GroupOptionsDropdown({
  role,
  onRename,
  onDelete,
  onLeave,
}: GroupOptionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-secondary hover:text-accent transition-colors cursor-pointer text-xl font-bold px-2"
      >
        ⋯
      </button>
      {isOpen && (
        <ul className="absolute right-0 top-full mt-1 bg-background rounded-lg z-50 w-40 p-2 shadow-lg border border-muted">
          {GroupPermissions.canRenameGroup(role) && (
            <li>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onRename();
                }}
                className="w-full text-left p-2 text-sm hover:bg-muted/20 rounded cursor-pointer"
              >
                Renombrar
              </button>
            </li>
          )}
          {GroupPermissions.canDeleteGroup(role) && (
            <li>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onDelete();
                }}
                className="w-full text-left p-2 text-sm text-accent hover:bg-accent/10 rounded cursor-pointer"
              >
                Eliminar
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
