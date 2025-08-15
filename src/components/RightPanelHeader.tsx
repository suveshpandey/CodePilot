// import { useAppContext } from "@/context/context";
// import { RotateCcw, Terminal, TerminalSquare, Sparkles} from "lucide-react";
// import OutputDisplay from "./OutputDisplay";
// import Badge from "./Badge";


// export default function RightPanelHeader () {
//     const {outputError, partialError, setOutput, rightPanelOption} = useAppContext();

//     let textColor = "text-slate-300";

//     if(partialError) {
//         textColor = "text-orange-300";
//     }
//     else if(outputError) {
//         textColor = "text-red-300";
//     }

//     return (
//         <div className={`flex flex-col bg-slate-800 ${textColor} h-full w-full rounded-md border-1 border-slate-600`}>

//             <div className="py-1 w-full bg-slate-700 rounded-t-[5px] px-2 flex items-center justify-between">
//                 <Badge icon={Terminal} color={"text-blue-500"} label={"Output"} selectionOption={"output"} isSelected={rightPanelOption === "output"} />
//                 <div className="bg-slate-400 h-full w-1 mx-1"></div>
//                 <Badge icon={TerminalSquare} color={"text-yellow-300"} label={"Compare"} selectionOption={"compare"} isSelected={rightPanelOption === "compare"}/>
//                 <div className="bg-slate-400 h-full w-1 mx-1"></div>
//                 <Badge icon={Sparkles} color={"text-red-300"} label={"Ask AI"}  selectionOption={"askAI"} isSelected={rightPanelOption === "askAI"}/>
//                 <div>
//                     <button
//                         onClick={() => setOutput("")}
//                             className="flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
//                         ><RotateCcw  size={18} />
//                     </button>
//                 </div>
//             </div>
            
//             <OutputDisplay />

//         </div>
//     )
// }