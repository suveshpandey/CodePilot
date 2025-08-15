import { useAppContext } from "@/context/context";
import SkeletonDemo from "./Skeleton";

//"Output" section display
export default function OutputDisplay () {
        const {output, isLoading} = useAppContext();
    
    return (
        <div className="h-full flex items-start px-3 pt-2 overflow-y-auto">
                { 
                    isLoading ? <SkeletonDemo /> : <pre>{ output ? output : <Message /> }</pre> 
                }
            </div>
    )
}

function Message () {
    return (
        <p className="text-slate-400">Click on <span className="text-slate-300">"Run"</span> to display the output</p>
    )
}