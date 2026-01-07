import { create } from "zustand";
import { persist } from "zustand/middleware";

// Notification type
export interface Notification {
    id: string;
    type: "rental_overdue" | "contract_expiring" | "payment_received" | "info";
    title: string;
    message: string;
    link?: string;
    createdAt: string;
    read: boolean;
}

interface AppState {
    // Language & Direction
    language: "en" | "ar";
    direction: "ltr" | "rtl";
    setLanguage: (lang: "en" | "ar") => void;

    // Sidebar
    sidebarCollapsed: boolean;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;

    // Toast notifications
    toasts: Array<{
        id: string;
        type: "success" | "error" | "warning" | "info";
        message: string;
    }>;
    addToast: (toast: { type: "success" | "error" | "warning" | "info"; message: string }) => void;
    removeToast: (id: string) => void;

    // Notifications (bell icon)
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    clearAllNotifications: () => void;

    // Modal state
    activeModal: string | null;
    modalData: Record<string, unknown> | null;
    openModal: (modalId: string, data?: Record<string, unknown>) => void;
    closeModal: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Language & Direction
            language: "en",
            direction: "ltr",
            setLanguage: (lang) =>
                set({
                    language: lang,
                    direction: lang === "ar" ? "rtl" : "ltr",
                }),

            // Sidebar
            sidebarCollapsed: false,
            sidebarOpen: false,
            toggleSidebar: () =>
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),

            // Toast notifications
            toasts: [],
            addToast: (toast) =>
                set((state) => ({
                    toasts: [
                        ...state.toasts,
                        { ...toast, id: Math.random().toString(36).substring(7) },
                    ],
                })),
            removeToast: (id) =>
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id),
                })),

            // Notifications (bell icon)
            notifications: [],
            addNotification: (notification) =>
                set((state) => ({
                    notifications: [
                        {
                            ...notification,
                            id: Math.random().toString(36).substring(7),
                            createdAt: new Date().toISOString(),
                            read: false,
                        },
                        ...state.notifications,
                    ],
                })),
            removeNotification: (id) =>
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                })),
            markAsRead: (id) =>
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                })),
            clearAllNotifications: () => set({ notifications: [] }),

            // Modal state
            activeModal: null,
            modalData: null,
            openModal: (modalId, data = {}) =>
                set({ activeModal: modalId, modalData: data }),
            closeModal: () => set({ activeModal: null, modalData: null }),
        }),
        {
            name: "telal-app-store",
            partialize: (state) => ({
                language: state.language,
                direction: state.direction,
                sidebarCollapsed: state.sidebarCollapsed,
                notifications: state.notifications,
            }),
        }
    )
);
