import { useAppContext } from "@/context/context";
import { RightPanelOptions } from "@/types";
import React from "react";

interface BadgeProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    label: string;
    selectionOption: RightPanelOptions;
    isSelected: boolean
}

export default function Badge({ icon: Icon, color, label, selectionOption, isSelected }: BadgeProps) {
    const {setRightPanelOption} = useAppContext();

    return (
        <div
            onClick={() => (setRightPanelOption(selectionOption))}
            className={`flex gap-x-1 items-center hover:bg-slate-600 px-2 py-0.5 rounded-sm cursor-pointer transition-all duration-200 `}>
            <Icon className={`size-4 ${color} ${isSelected ? "opacity-100" : "opacity-60"} `} strokeWidth={isSelected ? 3 : 2} />
            <p className={`text-sm ${isSelected && "font-medium"} ${isSelected ? "text-white" : "text-slate-300"}`}>{label}</p>
        </div>
    );
}
