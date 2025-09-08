import { useRouter } from "next/navigation";
import { Calendar, FileText, Code2, ArrowRight } from "lucide-react";

interface BlogProps {
    id: string,
    title: string,
    description: string,
    code: string,
    postedOn: Date,
    setLoading: (value: boolean) => void;
}

export default function NoteCard ({id, title, description, code, postedOn, setLoading}: BlogProps) {
    const router = useRouter();
    
    const formatDate = (date: Date | undefined) => {
        if (!date) return;
        return new Date(date).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    const truncateWords = (text: string, wordLimit: number) => {
        const words = text.split(" ");
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(" ") + " ...";
    };

    return (
        <div
            onClick={() => {
                setLoading(true);
                router.push(`/my-notes/note/${id}`)
            }}
            className="w-[30vw] h-80 flex flex-col mx-auto bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-blue-500/30 hover:scale-[1.02] group"
        >
            {/* Header with gradient and icon */}
            <div className="p-5 pb-4 border-b border-slate-700/50">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <FileText className="text-blue-400" size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-white mt-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
                        {title}
                    </h1>
                </div>
            </div>
            
            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Description */}
                <div className="flex gap-3">
                    <div className="mt-0.5">
                        <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-purple-400"></div>
                        </div>
                    </div>
                    <p className="text-slate-300 text-sm flex-1">
                        {truncateWords(description, 20)}
                    </p>
                </div>
                
                {/* Code Block */}
                <div className="flex-1 bg-slate-850 border border-slate-700 rounded-lg p-4 overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                        <Code2 className="text-green-400" size={16} />
                        <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">Code Snippet</span>
                    </div>
                    <div className="h-16 overflow-hidden">
                        <pre className="text-slate-300 text-xs font-mono whitespace-pre-wrap">
                            {truncateWords(code, 25)}
                        </pre>
                    </div>
                </div>
            </div>
            
            {/* Footer Section */}
            <div className="p-5 pt-3 border-t border-slate-700/50 bg-slate-800/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Calendar className="text-slate-500" size={16} />
                    <span className="text-slate-400 text-sm">{formatDate(postedOn)}</span>
                </div>
                
                <div className="flex items-center gap-1 text-slate-500 group-hover:text-blue-400 transition-colors">
                    <span className="text-sm">Read more</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                </div>
            </div>
        </div>
    )
}