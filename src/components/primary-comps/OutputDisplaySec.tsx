import { useAppContext } from "@/context/context";
import SkeletonDemo from "@/components/secondary-comps/Skeleton";

import { MonitorDot } from "lucide-react";

//seconday "Output" display -> present inside "Compare" section's below-section
export default function OutputDisplaySec() {
    const { output, isLoading } = useAppContext();

    return (
        <div className="h-full w-full p-4 bg-slate-800 overflow-y-auto custom-scroll rounded-md">
            {/* Header */}
            <p className="text-slate-300  text-md font-medium mb-3 flex items-center gap-2">
                Code Output
            </p>

            {isLoading ? (
                <SkeletonDemo />
            ) : output ? (
                <pre className="text-slate-200 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {output}
                </pre>
            ) : (
                <Message />
            )}
        </div>
    );
}

function Message() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center ">
            <MonitorDot className="w-12 h-12 text-slate-400 mb-2" />
            <p className="text-slate-400">
                Click on <span className="text-slate-300 font-medium">"Run"</span> to display the output
            </p>
        </div>
    );
}

