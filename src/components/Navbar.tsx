import { Sun } from "lucide-react";
import { useAppContext } from "@/context/context";

export default function Navbar () {
    const {} = useAppContext();

    return (
        <div className="w-full h-full border-b-1 border-slate-700 text-slate-300 flex items-center justify-between">
            <p className="font-medium text-lg">AI-CODE-ARENA</p>
            <div className="flex gap-x-4">
                <div className="size-8 rounded-full bg-slate-700 flex justify-center items-center font-medium text-sm cursor-pointer"><Sun className="size-5" /></div>    
                <div className="size-8 rounded-full bg-slate-700 flex justify-center items-center font-medium text-sm cursor-pointer">SP</div>
            </div>
        </div>
    )
}