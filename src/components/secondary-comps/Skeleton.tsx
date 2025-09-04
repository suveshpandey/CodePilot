import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDemo() {
    return (
        <div className="flex flex-col gap-y-4 w-full rounded-md py-3">
            <Skeleton className="w-[60%] h-4 rounded-sm bg-slate-700" />
            <Skeleton className="h-4 rounded-sm bg-slate-700" />
            <Skeleton className="w-[10%] h-4 rounded-sm bg-slate-700 mb-5" />
            <Skeleton className="w-[40%] h-4 rounded-sm bg-slate-700" />
            <Skeleton className="h-4 rounded-sm bg-slate-700" />
            <Skeleton className="h-4 rounded-sm bg-slate-700" />
            <Skeleton className="h-4 rounded-sm bg-slate-700" />
            <Skeleton className="h-4 rounded-sm bg-slate-700" />
            <Skeleton className="h-4 rounded-sm bg-slate-700" />
            <Skeleton className="h-4 rounded-sm bg-slate-700 mb-3" />
            <Skeleton className="h-4 w-[30%] rounded-sm bg-slate-700" />
        </div>
    )
}
