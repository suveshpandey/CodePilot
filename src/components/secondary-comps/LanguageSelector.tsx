"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Language } from "@/types";

interface LanguageSelectorProps {
    selectedLanguage: Language;
    onSelectLanguage: (language: Language) => void;
}
export default function LanguageSelector ({selectedLanguage, onSelectLanguage}: LanguageSelectorProps) {

    return (
        <Select
            value={selectedLanguage}
            onValueChange={onSelectLanguage}
        >
            <SelectTrigger size="sm" className="w-[120px] text-gray-300 border-slate-500 rounded-sm shadow-sm shadow-slate-800 cursor-pointer">
                <SelectValue placeholder={selectedLanguage} />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 text-gray-300">
                <SelectItem value="c" className="cursor-pointer">C</SelectItem>
                <SelectItem value="cpp" className="cursor-pointer">Cpp</SelectItem>
                <SelectItem value="javascript" className="cursor-pointer">Javascript</SelectItem>
                <SelectItem value="typescript" className="cursor-pointer">Typescript</SelectItem>
                <SelectItem value="python" className="cursor-pointer">Python</SelectItem>
                <SelectItem value="java" className="cursor-pointer">Java</SelectItem>
            </SelectContent>
        </Select>
    )
}