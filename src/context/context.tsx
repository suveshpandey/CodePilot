"use client"

import { createContext, useContext, useState, ReactNode } from "react";
import { Language } from "@/types";

interface CodeContextType {
    code: string | undefined;
    setCode: (code: string | undefined) => void;

    selectedLanguage: Language;
    setSelectedLanguage: (selectedLanguage: Language) => void;

    output: string | null;
    setOutput: (code: string | null) => void;

    outputError: boolean;
    setOutputError: (value: boolean) => void;

    isLoading: boolean;
    setIsLoading: (value: boolean) => void;

    partialError: boolean;
    setPartialError: (value: boolean) => void;

    rightPanelOption: string;
    setRightPanelOption: (option: string) => void;

    userCodeInput: string | undefined;
    setUserCodeInput: (userCodeInput: string | undefined) => void;
    
    userCodeOutput: string | undefined;
    setUserCodeOutput: (userCodeOutput: string | undefined) => void; 

    hasOutput: boolean;
    setHasOutput: (value: boolean) => void;

    isOutputCorrect: boolean;
    setIsOutputCorrect: (value: boolean) => void;

    aiPrompt: string | undefined;
    setAiPrompt: (value: string | undefined) => void;

    aiResponse: string | undefined;
    setAiResponse: (value: string | undefined) => void;

    isAiLoading: boolean;
    setIsAiLoading: (value: boolean) => void;

    aiHints: string | undefined;
    setAiHints: (value: string | undefined) => void;

}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

interface CodeProviderProps {
    children: ReactNode
}

export function CodeProvider ({children}: CodeProviderProps) {
    const [code, setCode] = useState<string | undefined>("");
    const [selectedLanguage, setSelectedLanguage] = useState<Language>("javascript");
    const [output, setOutput] = useState<string | null>(null);
    const [outputError, setOutputError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [partialError, setPartialError] = useState(false);
    const [rightPanelOption, setRightPanelOption] = useState("output");
    const [userCodeInput, setUserCodeInput] = useState<string | undefined>("");
    const [userCodeOutput, setUserCodeOutput] = useState<string | undefined>("");
    const [hasOutput, setHasOutput] = useState(false);
    const [isOutputCorrect, setIsOutputCorrect] = useState(false);
    const [aiPrompt, setAiPrompt] = useState<string | undefined>("");
    const [aiResponse, setAiResponse] = useState<string | undefined>("");
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
    const [aiHints, setAiHints] = useState<string | undefined>(undefined);


    const value = {
        code,
        setCode,
        selectedLanguage,
        setSelectedLanguage,
        output,
        setOutput,
        outputError, 
        setOutputError,
        isLoading, 
        setIsLoading,
        partialError, 
        setPartialError,
        rightPanelOption, 
        setRightPanelOption,
        userCodeInput,
        setUserCodeInput,
        userCodeOutput,
        setUserCodeOutput,
        hasOutput, 
        setHasOutput,
        isOutputCorrect, 
        setIsOutputCorrect,
        aiPrompt, 
        setAiPrompt,
        aiResponse, 
        setAiResponse,
        isAiLoading, 
        setIsAiLoading,
        aiHints, 
        setAiHints
    }

    return (
        <CodeContext.Provider value={value}>
            {children}
        </CodeContext.Provider>
    );
}

export function useAppContext () {
    const context = useContext(CodeContext);
    if(context === undefined) {
        throw new Error("useCode must be used within a CodeProvider");
    }
    return context;
}