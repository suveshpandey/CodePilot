import { useAppContext } from "@/context/context";
import { Editor } from "@monaco-editor/react";
import { Code2, CopyCheck, CopyIcon, RotateCcw } from "lucide-react";
import Loader from "@/components/Loader";
import { codeSnippets } from "@/constants";
import { useState } from "react";

import LanguageSelector from "./LanguageSelector";
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
            }, 5000)
        }
    }

    const onSelectLanguage = (language: Language) => {
        setSelectedLanguage(language);
        setCode(codeSnippets[language]);
    }

    return (
        <div className="overflow-hidden rounded-md h-full w-full border-1 border-slate-600 ">
            <div className="py-1 w-full bg-slate-700 rounded-t-[5px] px-2 flex items-center justify-between">
                <div className="flex gap-x-3">
                    <div className="flex gap-x-1 items-center">
                        <Code2 className="size-5 text-green-500" /> 
                        <p className="text-md text-slate-200">Code</p>
                    </div>
                </div>
                <div className="flex gap-x-4">
                    <LanguageSelector selectedLanguage={selectedLanguage} onSelectLanguage={onSelectLanguage} />    
                    <button
                        onClick={handleCopyButton}
                        className="flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                        >{isCopied ? <CopyCheck size={18} className="text-green-500" /> : <CopyIcon  size={18} /> }
                    </button>
                    <button
                        onClick={() => setCode("")}
                        className="flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                        ><RotateCcw  size={18} />
                    </button>
                </div>
            </div>
            <Editor 
                width="100%"
                theme="vs-dark"
                className="rounded-md active:border-slate-100"
                value={code}
                loading={ <Loader color={"slate-400"} /> }
                onChange={(code) => setCode(code)}
                defaultLanguage="javascript"
                language={selectedLanguage} 
                defaultValue={codeSnippets[selectedLanguage]} 
            />
        </div>
    )
}