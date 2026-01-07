"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const colors = {
    success: "bg-success text-success-foreground",
    error: "bg-destructive text-destructive-foreground",
    warning: "bg-warning text-warning-foreground",
    info: "bg-primary text-primary-foreground",
};

interface ToastItemProps {
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    onRemove: (id: string) => void;
}

function ToastItem({ id, type, message, onRemove }: ToastItemProps) {
    const [isExiting, setIsExiting] = useState(false);
    const Icon = icons[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onRemove(id), 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, onRemove]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(id), 300);
    };

    return (
        <div
            className={cn(
                "flex items-center gap-3 px-4 py-3 shadow-card-lg min-w-[300px] max-w-[400px]",
                colors[type],
                isExiting ? "toast-exit" : "toast-enter"
            )}
        >
            <Icon size={20} className="flex-shrink-0" />
            <p className="flex-1 text-sm">{message}</p>
            <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 hover:opacity-80 transition-opacity"
            >
                <X size={16} />
            </button>
        </div>
    );
}

export function ToastContainer() {
    const { toasts, removeToast } = useAppStore();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    message={toast.message}
                    onRemove={removeToast}
                />
            ))}
        </div>
    );
}

// Hook for using toast
export function useToast() {
    const { addToast } = useAppStore();

    return {
        success: (message: string) => addToast({ type: "success", message }),
        error: (message: string) => addToast({ type: "error", message }),
        warning: (message: string) => addToast({ type: "warning", message }),
        info: (message: string) => addToast({ type: "info", message }),
    };
}
