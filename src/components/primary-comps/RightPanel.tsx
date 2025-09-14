import { useAppContext } from "@/context/context";
import { RotateCcw, Sparkles, Terminal, TerminalSquare } from "lucide-react";
import OutputDisplay from "./OutputDisplay";
import Badge from "../secondary-comps/Badge";
import OutputComparison from "./OutputComparison";
import AskAIBlock from "./AskAIBlock";
import { BiBulb } from "react-icons/bi";
import ErrorHintsBlock from "./HintAIBlock";


//this is the starting/parent compoentnt of all right panel components
export default function RightPanel () {
    const {outputError, partialError, setOutput, setUserCodeInput, setUserCodeOutput, rightPanelOption} = useAppContext();

    let textColor = "text-slate-300";

    if(partialError) {
        textColor = "text-orange-300";
    }
    else if(outputError) {
        textColor = "text-red-300";
    }

    const handleReset = () => {
        setOutput("");
        setUserCodeInput("");
        setUserCodeOutput("");
        
    }

    return (
        <div className={`h-full w-full flex flex-col items-center justify-between bg-slate-800 ${textColor} rounded-md border-1 border-slate-600`}>
            <div className="py-1 w-full bg-slate-700 rounded-t-md px-2 flex items-center justify-between">
                <div className="flex gap-x-4">
                    <Badge icon={Terminal} color={"text-blue-500"} label={"Output"} selectionOption={"output"} isSelected={rightPanelOption === "output"} />
                    <div className="bg-slate-400 w-0.5 my-1"></div>
                    <Badge icon={TerminalSquare} color={"text-yellow-300"} label={"Compare"} selectionOption={"compare"} isSelected={rightPanelOption === "compare"}/>
                    <div className="bg-slate-400 w-0.5 my-1"></div>
                    <Badge icon={Sparkles} color={"text-red-300"} label={"Ask AI"}  selectionOption={"askAI"} isSelected={rightPanelOption === "askAI"}/>
                    <div className="bg-slate-400 w-0.5 my-1"></div>
                    <Badge icon={BiBulb} color={"text-green-300"} label={"Error Analysis"}  selectionOption={"errorAnalysis"} isSelected={rightPanelOption === "errorAnalysis"}/>
                </div>
                <div>
                    <button
                        onClick={handleReset}
                            className="flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                        ><RotateCcw  size={18} />
                    </button>
                </div>
            </div>
            <div className="h-full w-full overflow-y-auto">
                {
                    rightPanelOption === "output" && <OutputDisplay /> ||
                    rightPanelOption === "compare" && <OutputComparison /> ||
                    rightPanelOption === "askAI" && <AskAIBlock /> ||
                    rightPanelOption === "errorAnalysis" && <ErrorHintsBlock />
                }
            </div>
        </div>
    )
}