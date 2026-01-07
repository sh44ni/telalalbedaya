"use client";

import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";

interface PageContainerProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export function PageContainer({ children, title, subtitle, actions }: PageContainerProps) {
    const { sidebarCollapsed, direction } = useAppStore();

    return (
        <main className={cn(
            "main-content min-h-screen pt-[70px] transition-all duration-300 bg-background",
            direction === "rtl"
                ? (sidebarCollapsed ? "mr-[70px]" : "mr-[260px]")
                : (sidebarCollapsed ? "ml-[70px]" : "ml-[260px]"),
            "max-md:ml-0 max-md:mr-0"
        )}>
            <div className="p-6">
                {(title || actions) && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            {title && (
                                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                            )}
                            {subtitle && (
                                <p className="text-muted-foreground mt-1">{subtitle}</p>
                            )}
                        </div>
                        {actions && (
                            <div className="flex items-center gap-2 flex-wrap">
                                {actions}
                            </div>
                        )}
                    </div>
                )}
                <div className="page-transition">
                    {children}
                </div>
            </div>
        </main>
    );
}
