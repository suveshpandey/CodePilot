"use-client"
import { useAppContext } from "@/context/context"
import { CheckCircle2, XCircle, Computer } from "lucide-react"
import { useEffect, useRef } from "react";

//sub-block of "Compare section", used to display the compare-result of output
export default function OutputComparisonBlock() {
    const { output, userCodeOutput, hasOutput, setHasOutput, isOutputCorrect, setIsOutputCorrect, isLoading} = useAppContext();
    
    const prevIsLoading = useRef(isLoading);

    useEffect(() => {
        // Detect "Run" completion (loading -> not loading)
        if (prevIsLoading.current === true && isLoading === false) {
            const has =
                typeof output === "string" &&
                typeof userCodeOutput === "string" &&
                output.trim() !== "" &&
                userCodeOutput.trim() !== "";

            let correct = false;
            if (has) {
                const trimmedOutput = output.trim();
                const trimmedUserOutput = userCodeOutput.trim();
                correct = trimmedOutput === trimmedUserOutput;
            }

            setHasOutput(has);
            setIsOutputCorrect(correct);
        }

        prevIsLoading.current = isLoading;
    }, [isLoading, output, userCodeOutput]);

    return (
        <div className="w-full h-full p-4 rounded-lg bg-slate-800 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-slate-300">Output Comparison</h3>
                
                {hasOutput ? (
                    isOutputCorrect ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-900/50 text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Correct</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-900/50 text-red-400">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Incorrect</span>
                        </span>
                    )
                ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-700 text-slate-400">
                        <span className="text-sm font-medium">Pending</span>
                    </span>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col items-center justify-center flex-1 text-center">
                {hasOutput ? (
                    <>
                        {isOutputCorrect ? (
                            <>
                                <CheckCircle2 className="w-16 h-16 text-green-400 mb-2" />
                                <p className="text-green-400 font-semibold text-lg">Great job! Your output matches perfectly.</p>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-16 h-16 text-red-400 mb-2" />
                                <p className="text-red-400 font-semibold text-lg">Oops! The outputs don't match.</p>
                            </>
                        )}

                        {/* Side-by-side outputs */}
                        <div className="mt-4 w-full flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 p-3 rounded bg-slate-900/50 border border-slate-700">
                                <h4 className="text-slate-400 text-sm mb-1">Your Output</h4>
                                <pre className="text-slate-200 whitespace-pre-wrap">{output}</pre>
                            </div>
                            <div className="flex-1 p-3 rounded bg-slate-900/50 border border-slate-700">
                                <h4 className="text-slate-400 text-sm mb-1">Expected Output</h4>
                                <pre className="text-slate-200 whitespace-pre-wrap">{userCodeOutput}</pre>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col items-center justify-center text-center ">
                            <Computer className="w-12 h-12 text-slate-400 mb-2" />
                            <p className="text-slate-400 font-medium">Awaiting code execution...</p>
                            <p className="text-slate-500 text-sm">Run your code to compare with expected output.</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
