import { useAppContext } from "@/context/context";
import { Editor } from "@monaco-editor/react";
import { Check, Code2, Copy, CopyCheck, CopyIcon, RotateCcw } from "lucide-react";
import Loader from "@/components/secondary-comps/Loader";
import { codeSnippets } from "@/constants";
import { useState } from "react";

import LanguageSelector from "@/components/secondary-comps/LanguageSelector";

import { Language } from "@/types";

export default function LeftPanel () {
    const {code, setCode, selectedLanguage, setSelectedLanguage} = useAppContext();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyButton = async () => {
        if(code !== undefined) {
            await navigator.clipboard.writeText(code!);
            setIsCopied(true);

            setTimeout(() => {
                setIsCopied(false);
            }, 2000)
        }
    }

    const onSelectLanguage = (language: Language) => {
        setSelectedLanguage(language);
        setCode(codeSnippets[language]);
    }

    return (
        <div className="h-[100%] w-full rounded-md border-1 border-slate-600 flex flex-col ">
            <div className="py-1 w-full bg-slate-700 rounded-t-[5px] px-2 flex items-center justify-between">
                <div className="flex gap-x-3">
                    <div className="flex gap-x-1 items-center">
                        <Code2 className="size-4 text-green-500" strokeWidth={3} /> 
                        <p className="text-md text-slate-200 font-medium">Code</p>
                    </div>
                </div>
                <div className="flex gap-x-4">
                    <LanguageSelector selectedLanguage={selectedLanguage} onSelectLanguage={onSelectLanguage} />    
                    <button
                        onClick={handleCopyButton}
                        className="flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                        >
                            {isCopied ? (
                                <Check className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4 text-slate-300" />
                            )}
                    </button>
                    <button
                        onClick={() => setCode("")}
                        className="flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                        ><RotateCcw  size={18} />
                    </button>
                </div>
            </div>
            <div className="h-full rounded-b-md overflow-hidden">
                <Editor 
                    width="100%"
                    height="100%"
                    theme="vs-dark"
                    className="rounded-md active:border-slate-100"
                    value={code}
                    loading={ <Loader color={"slate-400"} /> }
                    onChange={(code) => setCode(code)}
                    defaultLanguage="cpp"
                    language={selectedLanguage} 
                    defaultValue={codeSnippets[selectedLanguage]} 
                />
            </div>
        </div>
        
    )
}