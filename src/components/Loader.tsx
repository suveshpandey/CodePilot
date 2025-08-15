import { LoaderCircle } from 'lucide-react';

interface LoaderProps {
    color: String
}

export default function Loader ({ color }: LoaderProps) {
    return (
        <LoaderCircle size={18} className={`animate-spin text-${color}`} />
    );
};
