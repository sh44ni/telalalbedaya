"use client";

import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = "md",
}: ModalProps) {
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="modal-overlay fixed inset-0"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    "relative bg-card border border-border shadow-card-lg w-full animate-in fade-in zoom-in-95 duration-200",
                    sizeClasses[size]
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-lg font-semibold">{title}</h2>
                        {description && (
                            <p className="text-sm text-muted-foreground mt-1">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-muted transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-2 p-6 border-t border-border">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

// Confirm Dialog
interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    loading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    loading = false,
}: ConfirmDialogProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === "destructive" ? "destructive" : "default"}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p className="text-muted-foreground">{message}</p>
        </Modal>
    );
}
