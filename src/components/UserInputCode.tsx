import { useAppContext } from "@/context/context"

export default function UserCodeInput() {
    const { userCodeInput, setUserCodeInput } = useAppContext();

    return (
        <div className="w-full h-full p-4 bg-slate-800 flex flex-col">
            {/* Header */}
            <p className="text-slate-300 mb-2 text-md font-medium">
                Enter the desired input:
            </p>

            {/* Textarea */}
            <textarea
                name="user-input"
                id="user-input"
                value={userCodeInput}
                onChange={(e) => setUserCodeInput(e.target.value)}
                placeholder="4   3 0 -1 2"
                className="flex-1 resize-none p-3 rounded-md bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-600 focus:border-slate-400 focus:outline-none transition-colors"
            />
        </div>
    );
}
