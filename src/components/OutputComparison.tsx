import { useAppContext } from "@/context/context";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import UserCodeInput from "./UserInputCode";
import UserDesiredOutput from "./UserDesiredOutput";
import OutputComparisonBlock from "./OutputComparisonBlock";
import OutputDisplaySec from "./OutputDisplaySec";

//"Compare" section display
export default function OutputComparison () {
    const {} = useAppContext();

    return (
        
            
            <div className="w-full h-full">
                <PanelGroup autoSaveId="example" direction="vertical">
                    {/* upper panel -> user input and user output */}
                    <Panel defaultSize={50} minSize={30}>
                        <div className="h-full w-full">
                            <PanelGroup autoSaveId="example" direction="horizontal">
                                <Panel defaultSize={50} minSize={30}>
                                    <div className="h-full w-full rounded-md ">
                                        <UserCodeInput />        
                                    </div>
                                </Panel>
                                
                                <PanelResizeHandle className="w-0.5 h-[97%] bg-slate-700 mx-1 my-auto hover:bg-slate-400 rounded-full" />
                                
                                <Panel defaultSize={50} minSize={30}>
                                    <div className="h-full w-full rounded-md ">
                                        <UserDesiredOutput />
                                    </div>
                                </Panel>
                            </PanelGroup>
                        </div>
                    </Panel>
                    
                    <PanelResizeHandle className="w-[97%] h-0.5 bg-slate-700 my-1 mx-auto hover:bg-slate-400 rounded-full" />
                    
                    {/* lower panel -> output and comparison-result */}
                    <Panel defaultSize={50} minSize={30}>
                        <div className="h-full w-full">
                            <PanelGroup autoSaveId="example" direction="horizontal">
                                <Panel defaultSize={50} minSize={30}>
                                    <div className="h-full w-full rounded-md ">
                                        <OutputDisplaySec />
                                    </div>
                                </Panel>
                                
                                <PanelResizeHandle className="w-0.5 h-[97%] bg-slate-700 mx-1 my-auto hover:bg-slate-400 rounded-full" />
                                
                                <Panel defaultSize={50} minSize={30}>
                                    <OutputComparisonBlock />
                                </Panel>
                            </PanelGroup>
                        </div>
                    </Panel>
                
                </PanelGroup>
            </div>

    )
}
