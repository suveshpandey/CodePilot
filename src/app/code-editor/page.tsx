"use client"

import LanguageSelector from "@/components/LanguageSelector";
import LeftPanel from "@/components/LeftPanel";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import RightPanel from "@/components/RightPanel";
import { codeSnippets } from "@/constants";
import { useAppContext } from "@/context/context";
import { executeCode } from "@/lib";
import { Language } from "@/types";
import { useEffect } from "react";
import { BiSolidLeftArrow } from "react-icons/bi";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";


export default function CodeEditor() {
    const {code, setCode, selectedLanguage, setSelectedLanguage, setOutput, setOutputError, isLoading, setIsLoading, setPartialError, userCodeInput} = useAppContext();

    const onSelectLanguage = (language: Language) => {
        setSelectedLanguage(language);
        setCode(codeSnippets[language]);
    }

    const handleRunCode = async () => {

        if(!code) {
            throw new Error("Source code not provided.");
        }

        try {
            setIsLoading(true);
            setOutput(null);
            setOutputError(false);
            setPartialError(false);

            //@ts-ignore
            const {run: result} = await executeCode({
                sourceCode: code, 
                language: selectedLanguage,
                userInput: userCodeInput
            });

            if(result.stderr !== "") {
                setOutputError(true);
            }

            setOutput(result.output);

            if(result.signal === "SIGKILL") {
                setOutput("⚠ Execution terminated — Your program took too long or used too much memory (possible infinite loop or recursion).");
                setPartialError(true);
            }

        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        setSelectedLanguage("javascript");
        setCode(codeSnippets[selectedLanguage]);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault(); // avoid accidental form submissions
                handleRunCode();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [code, selectedLanguage]);


    return (
        <div className="h-screen bg-gray-900 flex flex-col justify-around gap-y-2 px-10">
            <div className="h-[5%]">
                <Navbar />
            </div>
            
            <div className="w-[100%] h-[86%] ">  
                <PanelGroup autoSaveId="example" direction="horizontal">
                    <Panel defaultSize={50} minSize={30}>
                        <LeftPanel />
                    </Panel>
                    
                    <PanelResizeHandle className="w-0.5 my-2 mx-2 bg-slate-800 hover:bg-slate-400 rounded-full" />
                    
                    <Panel defaultSize={50} minSize={30}>
                        <RightPanel />    
                    </Panel>
                </PanelGroup>
            </div>

            <div className="h-[5%] flex align-middle items-center justify-end">
                <button 
                    onClick={handleRunCode} 
                    disabled={isLoading}
                    className="h-full w-26 border-1 disabled:cursor-no-drop border-green-600 hover:bg-green-600 shadow-sm shadow-green-800 flex items-center justify-center gap-x-2 rounded-md text-green-500 hover:text-white font-semibold text-lg cursor-pointer "
                    > 
                    {isLoading ? (
                        <Loader color={"green-500"} />
                    ) : (
                        <BiSolidLeftArrow />
                    )}
                    Run
                </button>

            </div>
        </div>
        
    
    )

}
