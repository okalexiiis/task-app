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
        className="btn btn-sm btn-ghost"
      >
        ⋯
      </button>
      {isOpen && (
        <ul className="absolute right-0 top-full mt-1 bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg border border-muted">
          {GroupPermissions.canRenameGroup(role) && (
            <li>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onRename();
                }}
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
              >
                Eliminar
              </button>
            </li>
          )}
          <li>
            <button
              onClick={() => {
                setIsOpen(false);
                onLeave();
              }}
            >
              Salir
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
