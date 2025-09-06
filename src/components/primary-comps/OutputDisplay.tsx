import { useAppContext } from "@/context/context";
import SkeletonDemo from "../secondary-comps/Skeleton";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import HintAi from "./HintAIBlock";


//"Output" section display
export default function OutputDisplay () {
        const {output, isLoading} = useAppContext();
    
    return (
        <div className="h-full flex items-center justify-center rounded-md">
            <PanelGroup autoSaveId="example" direction="vertical">
                <Panel defaultSize={90} minSize={30}>
                    <div className="h-full w-full flex items-start px-3 pt-2 overflow-y-auto">
                        { 
                            isLoading ? <SkeletonDemo /> : <pre>{ output ? output : <Message /> }</pre> 
                        }
                    </div>
                </Panel>
                
                <PanelResizeHandle className="w-[97%] h-0.5 my-2 mx-auto bg-slate-700 hover:bg-slate-400 rounded-full" />
                
                <Panel defaultSize={10} minSize={10}>
                    <HintAi />
                </Panel>
            </PanelGroup>
        </div>
    )
}

function Message () {
    return (
        <p className="text-slate-400">Click on <span className="text-slate-300">"Run"</span> to display the output</p>
    )
}