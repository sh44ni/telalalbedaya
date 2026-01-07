"use client";

import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, useToast } from "@/components/ui";
import { useAppStore } from "@/stores/useAppStore";
import { Globe, User, Bell, Shield, Building2, Palette } from "lucide-react";

export default function SettingsPage() {
    const { t, i18n } = useTranslation();
    const toast = useToast();
    const { language, setLanguage } = useAppStore();

    const handleLanguageChange = (newLang: "en" | "ar") => {
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = newLang;
        toast.success(newLang === "ar" ? "تم تغيير اللغة إلى العربية" : "Language changed to English");
    };

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

                {/* Notifications */}
                <Card>
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary">
                            <Bell size={24} />
                        </div>
                        <div>
                            <CardTitle>{t("settings.notifications")}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Configure notification preferences
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { label: "Payment Reminders", desc: "Get notified about upcoming and overdue payments" },
                                { label: "Contract Expiry", desc: "Alerts for contracts nearing expiration" },
                                { label: "New Leads", desc: "Notifications for new customer inquiries" },
                                { label: "System Updates", desc: "Important system announcements" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border border-border">
                                    <div>
                                        <p className="font-medium">{item.label}</p>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-muted peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                                    </label>
                                </div>
                            ))}
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
            </div>
        </PageContainer>
    );
}
