import { useAppContext } from "@/context/context"

export default function UserDesiredOutput() {
    const {userCodeOutput, setUserCodeOutput} = useAppContext();

    return (
        <div className="w-full h-full p-4 bg-slate-800 flex flex-col">
            {/* Header */}
            <p className="text-slate-300 mb-2 text-md font-medium">
                Enter the expected output:
            </p>

            {/* Textarea */}
            <textarea
                name="user-outout" 
                id="user-output"
                value={userCodeOutput}
                onChange={(e) => setUserCodeOutput(e.target.value)}
                placeholder="elements: 3, 0, -1, 2" 
                className="flex-1 resize-none p-3 rounded-md bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-600 focus:border-slate-400 focus:outline-none transition-colors"
            />
        </div>
    );
}
