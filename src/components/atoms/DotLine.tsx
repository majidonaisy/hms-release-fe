import { cn } from "@/lib/utils";

interface ActivityLogEntry {
    className?: string;
}

const DotLine: React.FC<ActivityLogEntry> = ({ className }) => {
    return (
        <>
            <div className={cn(className,"")}>
                <div className="w-px h-6 bg-hms-primary mt-1 absolute">
                    <div className='w-20 bg-hms-primary h-px relative top-6'></div>
                    <div className='w-2 h-2 rounded-full bg-hms-primary relative top-5 -left-0.5'></div>
                </div>
            </div></>
    )
}

export default DotLine