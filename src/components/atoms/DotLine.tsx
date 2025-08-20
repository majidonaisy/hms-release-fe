import { cn } from "@/lib/utils";

interface ActivityLogEntry {
    className?: string;
}

const DotLine: React.FC<ActivityLogEntry> = ({ className }) => {
    return (
        <>
            <div className={cn(className, "flex-shrink-0")}>
                <div className="w-px h-7 bg-hms-primary mt-1 absolute left-20">
                    <div className='w-12 bg-hms-primary h-px relative top-6'></div>
                    <div className='w-2 h-2 rounded-full bg-hms-primary relative top-5 -left-1'></div>
                </div>
            </div>
        </>
    )
}

export default DotLine