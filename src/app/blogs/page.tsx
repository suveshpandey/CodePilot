import Navbar from "@/components/Navbar";

export default function Blogs () {
    return (
        <div className="h-screen w-full bg-gray-900 flex flex-col justify-around gap-y-2 px-10">
            <div className="">
                <Navbar />
            </div>
            <div className="h-full w-full bg-slate-700">
                blogs
            </div>
        </div>
    )
}