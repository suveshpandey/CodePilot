"use client"

import LeftPanel from "@/components/LeftPanel";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import RightPanel from "@/components/RightPanel";
import { codeSnippets } from "@/constants";
import { useAppContext } from "@/context/context";
import { executeCode } from "@/lib";
import { CloudCheck, CloudFog, Upload } from "lucide-react";
import { useEffect } from "react";
import { BiSolidLeftArrow } from "react-icons/bi";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { toast } from "sonner";


export default function CodeEditor() {
    const {code, setCode, selectedLanguage, setSelectedLanguage, setOutput, setOutputError, isLoading, setIsLoading, setPartialError, userCodeInput} = useAppContext();

    const handleRunCode = async () => {

        if (!code) {
            toast.warning("Please write some code before running.");
            return;
        }

        try {
            setIsLoading(true);
            setOutput(null);
            setOutputError(false);
            setPartialError(false);

            //@ts-ignore
            const { run: result } = await executeCode({
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
        } catch (error: any) {
            console.error("Execution error:", error);
            toast.error(
                error?.message || "🚨 Execution service unavailable. Please try again."
            );
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
        <div className="h-screen max-h-auto w-full bg-gray-900 flex flex-col justify-start items-start px-10">
            <div className="h-[8%] w-full">
                <Navbar />
            </div>
            
            <div className="w-[100%] h-[92%] max-h-screen flex flex-col gap-y-2 ">  
                <PanelGroup autoSaveId="example" direction="horizontal">
                    <Panel defaultSize={50} minSize={30}>
                        <LeftPanel />
                    </Panel>
                    
                    <PanelResizeHandle className="w-0.5 my-2 mx-2 bg-slate-800 hover:bg-slate-400 rounded-full" />
                    
                    <Panel defaultSize={50} minSize={30}>
                        <RightPanel />    
                    </Panel>
                </PanelGroup>

                <div className="w-full bg-slate-900 flex items-center justify-center mb-2 gap-x-2">
                    <button 
                        onClick={handleRunCode} 
                        disabled={isLoading}
                        className=" w-26 h-10 border-1 disabled:cursor-no-drop border-green-600 hover:bg-green-600 shadow-sm shadow-green-800 flex items-center justify-center gap-x-2 rounded-md text-green-500 hover:text-white font-semibold text-lg cursor-pointer "
                        > 
                        {isLoading ? (
                            <Loader color={"green-500"} />
                        ) : (
                            <BiSolidLeftArrow />
                        )}
                        Run
                    </button>
                    <button 
                        onClick={handleRunCode} 
                        disabled={isLoading}
                        className=" w-26 h-10 border-1 disabled:cursor-no-drop bg-green-600 border-green-600 hover:bg-green-500 shadow-sm shadow-green-800 flex items-center justify-center gap-x-2 rounded-md text-white font-semibold text-lg cursor-pointer "
                        > 
                        {isLoading ? (
                            <Loader color={"green-500"} />
                        ) : (
                            <CloudCheck />
                        )}
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}