import { useRouter } from "next/navigation";

interface BlogProps {
    id: string,
    title: string,
    description: string,
    code: string,
    postedBy: string,
    postedOn: Date,
    setLoading: (value: boolean) => void;

}
export default function BlogCard ({id, title, description, code, postedBy, postedOn, setLoading}: BlogProps) {
    const router = useRouter();
    
    const formatDate = (date: Date | undefined) => {
        if (!date) return;
        return new Date(date).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'long',
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
            router.push(`/blogs/blog/${id}`)
        }}
        className="w-xl h-80 flex flex-col mx-auto bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-lg shadow-lg overflow-hidden transition-colors duration-300 cursor-pointer">
            {/* Header Section */}
            <div className="p-6 h-[85%] border-b border-slate-700">
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                <div className="h-auto overflow-y-auto">
                    <p className="text-slate-300 mb-2">
                        {truncateWords(description, 20)}
                    </p>
                </div>
                
                <div className="h-auto w-full bg-gray-900 rounded-lg p-3 text-gray-400 overflow-hidden overflow-y-auto">
                    <pre className="">{truncateWords(code, 20)}</pre>
                </div>
            </div>
            
            {/* Footer Section */}
            <div className="h-[15%] px-6 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center mr-3">
                        <span className="text-slate-300 text-sm font-medium">{postedBy[0]}</span>
                    </div>
                    <span className="text-slate-400 text-sm">{postedBy}</span>
                </div>
                <span className="text-slate-500 text-sm">{formatDate(postedOn)}</span>
            </div>
        </div>
    )
}