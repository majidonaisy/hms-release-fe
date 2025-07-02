import { Skeleton } from '@/components/atoms/Skeleton';

const RoomFormSkeleton = () => {
    return (
        <div className="p-5 min-h-screen">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-7 w-48" />
            </div>

            {/* Form Skeleton */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side */}
                    <div className='px-7'>
                        <div className="space-y-6">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-32 w-full rounded-lg" />
                        </div>

                        <div className="space-y-4">
                            <Skeleton className="h-4 w-16" />
                            <div className="grid grid-cols-2 gap-3">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-3 pt-6">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
};

export default RoomFormSkeleton;