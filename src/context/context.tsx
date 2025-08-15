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
        setIsOutputCorrect
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