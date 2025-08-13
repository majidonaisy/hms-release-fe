import { Calendar, Users, Building, UserCheck, Settings, Wrench, Sparkles, UserCog, Shield, Clock, Zap } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/Organisms/Card"

const HomePage = () => {
    const systemCapabilities = [
        {
            title: "Reservation Management",
            description: "Create, modify, and track guest bookings with calendar integration",
            icon: Calendar,
            color: "text-hms-primary",
        },
        {
            title: "Room Operations and Tracking",
            description: "Monitor room status, availability, and housekeeping assignments",
            icon: Building,
            color: "text-hms-primary",
        },
        {
            title: "Users Management",
            description: "Organize team members, roles, and departmental responsibilities",
            icon: UserCog,
            color: "text-hms-primary",
        },
        {
            title: "Housekeeping Coordination",
            description: "Assign and track cleaning tasks with priority management",
            icon: Sparkles,
            color: "text-hms-primary",
        },
        {
            title: "Hotel Configuration",
            description: "Set up room types, amenities, rate plans, and operational settings",
            icon: Settings,
            color: "text-hms-primary",
        },
        {
            title: "Check-in/Check-out",
            description: "Process guest arrivals and departures with real-time updates",
            icon: UserCheck,
            color: "text-hms-primary",
        },
    ]

    const systemBenefits = [
        {
            title: "Streamlined Operations",
            description: "Centralize all hotel operations in one comprehensive platform",
            icon: Zap,
            color: "text-hms-primary",
        },
        {
            title: "Enhanced Guest Experience",
            description: "Deliver personalized service with detailed guest profiles and preferences",
            icon: Users,
            color: "text-hms-primary",
        },
        {
            title: "Real-time Monitoring",
            description: "Track room status, maintenance, and housekeeping in real-time",
            icon: Clock,
            color: "text-hms-primary",
        },
        {
            title: "Data Security",
            description: "Secure guest information and operational data with robust protection",
            icon: Shield,
            color: "text-hms-primary",
        },
    ]

    const operationalWorkflow = [
        {
            step: "1",
            title: "Guest Booking",
            description: "Reservations are created and managed through the scheduler",
            icon: Calendar,
        },
        {
            step: "2",
            title: "Room Preparation",
            description: "Housekeeping receives automated task assignments for room readiness",
            icon: Sparkles,
        },
        {
            step: "3",
            title: "Guest Arrival",
            description: "Check-in process updates room status and guest information",
            icon: UserCheck,
        },
        {
            step: "4",
            title: "Service Delivery",
            description: "Staff coordinate through maintenance and service request systems",
            icon: Wrench,
        },
    ]

    return (
        <div className="p-5 bg-gray-50">
            <div className="">
                <div className="">
                    <div className="animate-fade-in-up text-center mb-10">
                        <h1 className="text-3xl font-bold mb-3">
                            Welcome to Hotel Management
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Manage your hotel operations efficiently from this central dashboard with powerful tools designed for
                            modern hospitality
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-6 space-y-16">
                <section className="animate-fade-in-up animate-delay-300">
                    <div className="text-center mb-2 flex justify-center">
                        <h2 className="text-2xl font-bold mb-4 border-b border-hms-primary w-80 pb-4">System Benefits</h2>

                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
                        {systemBenefits.map((benefit, index) => (
                            <Card
                                key={index}
                                className="group border-hms-accent hover:shadow-xl hover:shadow-hms-primary/10 transition-all duration-300 bg-gradient-to-br from-white to-hms-accent/20 hover:scale-105 animate-scale-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <CardHeader className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-hms-primary/10 rounded-xl group-hover:bg-hms-primary/20 transition-colors duration-300">
                                            <benefit.icon
                                                className={`h-6 w-6 ${benefit.color} group-hover:scale-110 transition-transform duration-300`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-semibold mb-2 group-hover:text-hms-primary transition-colors duration-300">
                                                {benefit.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                                                {benefit.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="animate-fade-in-up animate-delay-400">
                    <div className="text-center mb-2 flex justify-center">
                        <h2 className="text-2xl font-bold mb-4 border-b border-hms-primary w-80 pb-4">What You Can Do</h2>

                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2  gap-6">
                        {systemCapabilities.map((capability, index) => (
                            <Card
                                key={index}
                                className="group border-hms-accent  hover:shadow-xl hover:shadow-hms-primary/10 transition-all duration-300 hover:scale-105 animate-scale-in bg-gradient-to-br from-white to-hms-accent/20"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <CardHeader className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-white/50 rounded-xl group-hover:bg-white/80 transition-colors duration-300">
                                            <capability.icon
                                                className={`h-6 w-6 ${capability.color} group-hover:scale-110 transition-transform duration-300`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-semibold mb-2 group-hover:text-hms-primary transition-colors duration-300">
                                                {capability.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                                                {capability.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="animate-fade-in-up animate-delay-500 mb-5">
                    <div className="text-center mb-2 flex justify-center">
                        <h2 className="text-2xl font-bold mb-4 border-b border-hms-primary w-80 pb-4">Daily Operations Workflow</h2>

                    </div>
                    <div className="relative">
                        <div className="grid grid-cols-1 lg:grid-cols-2  gap-6 relative z-10">
                            {operationalWorkflow.map((workflow, index) => (
                                <Card
                                    key={index}
                                    className="group border-hms-accent hover:shadow-xl hover:shadow-hms-primary/10 transition-all duration-300 bg-gradient-to-br from-white to-hms-accent/20 hover:scale-105 animate-slide-in-right"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <CardHeader className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 relative">
                                                <div className="w-12 h-12 bg-gradient-to-br from-hms-primary to-hms-primary/80 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                                    {workflow.step}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <CardTitle className="text-lg font-semibold group-hover:text-hms-primary transition-colors duration-300">
                                                        {workflow.title}
                                                    </CardTitle>
                                                </div>
                                                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                                                    {workflow.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default HomePage
