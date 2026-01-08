"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, useToast } from "@/components/ui";
import { useAppStore } from "@/stores/useAppStore";
import { Globe, User, Shield, Building2, HardDrive, Trash2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
    const { t, i18n } = useTranslation();
    const toast = useToast();
    const { language, setLanguage } = useAppStore();

    // Storage state
    const [storageInfo, setStorageInfo] = useState({
        total: 50, // GB
        system: 12, // GB
        userData: 0, // GB - will be calculated
        used: 12, // GB - will be calculated
    });

    // Clean data state
    const [showCleanConfirm, setShowCleanConfirm] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const CONFIRM_PHRASE = "DELETE ALL DATA";

    // Calculate storage usage
    useEffect(() => {
        const calculateStorage = async () => {
            try {
                // Fetch data counts to estimate storage
                const [customersRes, projectsRes, propertiesRes, rentalsRes, contractsRes, documentsRes] = await Promise.all([
                    fetch("/api/customers"),
                    fetch("/api/projects"),
                    fetch("/api/properties"),
                    fetch("/api/rentals"),
                    fetch("/api/contracts"),
                    fetch("/api/documents"),
                ]);

                const customers = customersRes.ok ? await customersRes.json() : [];
                const projects = projectsRes.ok ? await projectsRes.json() : [];
                const properties = propertiesRes.ok ? await propertiesRes.json() : [];
                const rentals = rentalsRes.ok ? await rentalsRes.json() : [];
                const contracts = contractsRes.ok ? await contractsRes.json() : [];
                const documents = documentsRes.ok ? await documentsRes.json() : [];

                // Estimate storage (rough calculation)
                const recordCount = customers.length + projects.length + properties.length + rentals.length + contracts.length;
                const documentCount = documents.length;

                // Assume ~5KB per record, ~500KB per document
                const estimatedUserDataMB = (recordCount * 0.005) + (documentCount * 0.5);
                const estimatedUserDataGB = Math.max(0.01, estimatedUserDataMB / 1024);

                setStorageInfo(prev => ({
                    ...prev,
                    userData: Number(estimatedUserDataGB.toFixed(2)),
                    used: Number((prev.system + estimatedUserDataGB).toFixed(2)),
                }));
            } catch (error) {
                console.error("Failed to calculate storage:", error);
            }
        };

        calculateStorage();
    }, []);

    const handleLanguageChange = (newLang: "en" | "ar") => {
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = newLang;
        toast.success(newLang === "ar" ? "تم تغيير اللغة إلى العربية" : "Language changed to English");
    };

    const handleCleanAllData = async () => {
        if (confirmText !== CONFIRM_PHRASE) {
            toast.error("Please type the confirmation phrase exactly");
            return;
        }

        setIsDeleting(true);

        try {
            // Delete all data via API
            const response = await fetch("/api/clean-data", {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("All data has been deleted successfully. Refreshing...");
                setShowCleanConfirm(false);
                setConfirmText("");
                // Recalculate storage
                setStorageInfo(prev => ({
                    ...prev,
                    userData: 0,
                    used: prev.system,
                }));
                // Reload page after a short delay to show the toast
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                const error = await response.json();
                toast.error(error.error || "Failed to delete data");
            }
        } catch (error) {
            toast.error("An error occurred while deleting data");
        } finally {
            setIsDeleting(false);
        }
    };

    const usedPercentage = (storageInfo.used / storageInfo.total) * 100;
    const systemPercentage = (storageInfo.system / storageInfo.total) * 100;
    const userDataPercentage = (storageInfo.userData / storageInfo.total) * 100;

    return (
        <PageContainer title={t("settings.title")}>
            <div className="grid gap-6 max-w-4xl">
                {/* Language Settings */}
                <Card>
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary">
                            <Globe size={24} />
                        </div>
                        <div>
                            <CardTitle>{t("settings.language")}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Choose your preferred language
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3">
                            <Button
                                variant={language === "en" ? "default" : "outline"}
                                onClick={() => handleLanguageChange("en")}
                            >
                                English
                            </Button>
                            <Button
                                variant={language === "ar" ? "default" : "outline"}
                                onClick={() => handleLanguageChange("ar")}
                            >
                                العربية
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Settings */}
                <Card>
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary">
                            <User size={24} />
                        </div>
                        <div>
                            <CardTitle>{t("settings.profile")}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage your account information
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input label="Full Name" defaultValue="Admin User" />
                            <Input label="Email" type="email" defaultValue="admin@telalalbidaya.ae" />
                            <Input label="Phone" defaultValue="+971 50 123 4567" />
                            <Input label="Role" defaultValue="Administrator" disabled />
                        </div>
                        <div className="mt-4">
                            <Button onClick={() => toast.success("Profile updated")}>
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Company Info */}
                <Card>
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <CardTitle>{t("settings.company")}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Company details and branding
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input label="Company Name" defaultValue="Telal Al-Bidaya Real Estate" />
                            <Input label="Trade License" defaultValue="DED-123456" />
                            <Input label="Email" type="email" defaultValue="info@telalalbidaya.ae" />
                            <Input label="Phone" defaultValue="+971 4 123 4567" />
                            <div className="md:col-span-2">
                                <Input label="Address" defaultValue="Dubai, United Arab Emirates" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button onClick={() => toast.success("Company info updated")}>
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary">
                            <Shield size={24} />
                        </div>
                        <div>
                            <CardTitle>{t("settings.security")}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Password and security settings
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input label="Current Password" type="password" />
                            <div />
                            <Input label="New Password" type="password" />
                            <Input label="Confirm New Password" type="password" />
                        </div>
                        <div className="mt-4">
                            <Button onClick={() => toast.success("Password updated")}>
                                Update Password
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Storage & Data Management */}
                <Card>
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary">
                            <HardDrive size={24} />
                        </div>
                        <div>
                            <CardTitle>{language === "ar" ? "التخزين وإدارة البيانات" : "Storage & Data Management"}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {language === "ar" ? "إدارة مساحة التخزين وتنظيف البيانات" : "Manage storage space and clean data"}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Storage Usage Display */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">
                                    {language === "ar" ? "مساحة التخزين المستخدمة" : "Storage Used"}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {storageInfo.used} GB / {storageInfo.total} GB
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-4 bg-muted w-full overflow-hidden">
                                <div className="h-full flex">
                                    {/* System storage (grey) */}
                                    <div
                                        className="h-full bg-secondary transition-all duration-500"
                                        style={{ width: `${systemPercentage}%` }}
                                        title={`System: ${storageInfo.system} GB`}
                                    />
                                    {/* User data storage (primary color) */}
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{ width: `${userDataPercentage}%` }}
                                        title={`User Data: ${storageInfo.userData} GB`}
                                    />
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex gap-6 mt-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-secondary" />
                                    <span className="text-xs text-muted-foreground">
                                        {language === "ar" ? "النظام" : "System"}: {storageInfo.system} GB
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary" />
                                    <span className="text-xs text-muted-foreground">
                                        {language === "ar" ? "بيانات المستخدم" : "User Data"}: {storageInfo.userData} GB
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-muted border border-border" />
                                    <span className="text-xs text-muted-foreground">
                                        {language === "ar" ? "متاح" : "Available"}: {(storageInfo.total - storageInfo.used).toFixed(2)} GB
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Clean Data Section */}
                        <div className="border-t border-border pt-6">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="p-2 bg-destructive/10 text-destructive">
                                    <Trash2 size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-destructive">
                                        {language === "ar" ? "حذف جميع البيانات" : "Clean All Data"}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {language === "ar"
                                            ? "سيؤدي هذا إلى حذف جميع العملاء والمشاريع والعقارات والإيجارات والعقود والمستندات نهائياً."
                                            : "This will permanently delete all customers, projects, properties, rentals, contracts, and documents."
                                        }
                                    </p>
                                </div>
                            </div>

                            {!showCleanConfirm ? (
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowCleanConfirm(true)}
                                    className="w-full sm:w-auto"
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    {language === "ar" ? "حذف جميع البيانات" : "Clean All Data"}
                                </Button>
                            ) : (
                                <div className="bg-destructive/5 border border-destructive/20 p-4 space-y-4">
                                    <div className="flex items-center gap-2 text-destructive">
                                        <AlertTriangle size={20} />
                                        <span className="font-medium">
                                            {language === "ar" ? "تحذير! هذا الإجراء لا يمكن التراجع عنه" : "Warning! This action cannot be undone"}
                                        </span>
                                    </div>

                                    <p className="text-sm">
                                        {language === "ar"
                                            ? `للتأكيد، اكتب "${CONFIRM_PHRASE}" أدناه:`
                                            : `To confirm, type "${CONFIRM_PHRASE}" below:`
                                        }
                                    </p>

                                    <Input
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                        placeholder={CONFIRM_PHRASE}
                                        className={confirmText === CONFIRM_PHRASE ? "border-destructive" : ""}
                                    />

                                    <div className="flex gap-3">
                                        <Button
                                            variant="destructive"
                                            onClick={handleCleanAllData}
                                            disabled={confirmText !== CONFIRM_PHRASE || isDeleting}
                                            loading={isDeleting}
                                        >
                                            {language === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowCleanConfirm(false);
                                                setConfirmText("");
                                            }}
                                            disabled={isDeleting}
                                        >
                                            {language === "ar" ? "إلغاء" : "Cancel"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
