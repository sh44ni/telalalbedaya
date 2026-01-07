"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/layout";
import { Button, DataTable, Column, Modal, Input, Select, Badge, Tabs, useToast, Card, CardContent } from "@/components/ui";
import { useDocumentsStore } from "@/stores/dataStores";
import type { Document } from "@/types";
import { Plus, Upload, FileText, Download, Trash2, FolderOpen, File, Image, FileSpreadsheet } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DocumentsPage() {
    const { t } = useTranslation();
    const toast = useToast();
    const { items: documents, addItem, deleteItem } = useDocumentsStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [formData, setFormData] = useState({
        name: "",
        category: "other",
    });

    const tabs = [
        { id: "all", label: t("common.all"), count: documents.length },
        { id: "contracts", label: t("documents.contracts"), count: documents.filter(d => d.category === "contracts").length },
        { id: "receipts", label: t("documents.receipts"), count: documents.filter(d => d.category === "receipts").length },
        { id: "identities", label: t("documents.identities"), count: documents.filter(d => d.category === "identities").length },
        { id: "property", label: t("documents.property"), count: documents.filter(d => d.category === "property").length },
        { id: "other", label: t("documents.other"), count: documents.filter(d => d.category === "other").length },
    ];

    const filteredDocuments = activeTab === "all"
        ? documents
        : documents.filter(d => d.category === activeTab);

    const getFileIcon = (fileType: string) => {
        if (fileType.includes("pdf")) return <FileText size={16} className="text-destructive" />;
        if (fileType.includes("image")) return <Image size={16} className="text-success" />;
        if (fileType.includes("spreadsheet") || fileType.includes("excel")) return <FileSpreadsheet size={16} className="text-success" />;
        return <File size={16} className="text-muted-foreground" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const columns: Column<Document>[] = [
        {
            key: "name",
            label: t("documents.fileName"),
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-2">
                    {getFileIcon(item.fileType)}
                    <span>{item.name}</span>
                </div>
            ),
        },
        {
            key: "category",
            label: t("documents.category"),
            render: (item) => (
                <Badge variant="secondary">{t(`documents.${item.category}`)}</Badge>
            ),
        },
        {
            key: "fileSize",
            label: t("documents.fileSize"),
            render: (item) => formatFileSize(item.fileSize),
        },
        {
            key: "uploadDate",
            label: t("documents.uploadDate"),
            sortable: true,
            render: (item) => formatDate(item.uploadDate),
        },
    ];

    const handleOpenModal = () => {
        setFormData({
            name: "",
            category: "other",
        });
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        // Simulate file upload
        const documentData: Document = {
            id: `doc-${Date.now()}`,
            name: formData.name || "Uploaded Document.pdf",
            category: formData.category as Document["category"],
            fileType: "application/pdf",
            fileSize: Math.floor(Math.random() * 500000) + 50000,
            fileUrl: `/documents/${formData.name}`,
            uploadDate: new Date().toISOString().split("T")[0],
            createdAt: new Date().toISOString(),
        };

        addItem(documentData);
        toast.success("Document uploaded successfully");
        setIsModalOpen(false);
    };

    const handleDelete = (document: Document) => {
        if (confirm(`Delete document "${document.name}"?`)) {
            deleteItem(document.id);
            toast.success("Document deleted");
        }
    };

    return (
        <PageContainer
            title={t("documents.title")}
            actions={
                <Button onClick={handleOpenModal}>
                    <Upload size={18} />
                    {t("documents.uploadDocument")}
                </Button>
            }
        >
            {/* Drag and Drop Zone */}
            <Card className="mb-6 border-dashed border-2 hover:border-primary transition-colors cursor-pointer" onClick={handleOpenModal}>
                <CardContent className="p-8 text-center">
                    <FolderOpen size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t("documents.dragDrop")}</p>
                    <p className="text-xs text-muted-foreground mt-2">PDF, Images, Documents (Max 10MB)</p>
                </CardContent>
            </Card>

            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="mt-4">
                <DataTable
                    data={filteredDocuments}
                    columns={columns}
                    keyField="id"
                    onDelete={handleDelete}
                    actions={(item) => (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => toast.info("Download: " + item.name)}
                                className="p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                                title={t("common.download")}
                            >
                                <Download size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(item)}
                                className="p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                                title={t("common.delete")}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t("documents.uploadDocument")}
                size="md"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            {t("common.cancel")}
                        </Button>
                        <Button onClick={handleSubmit}>
                            <Upload size={16} />
                            {t("common.upload")}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label={t("documents.fileName")}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="document-name.pdf"
                    />
                    <Select
                        label={t("documents.category")}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        options={[
                            { value: "contracts", label: t("documents.contracts") },
                            { value: "receipts", label: t("documents.receipts") },
                            { value: "identities", label: t("documents.identities") },
                            { value: "property", label: t("documents.property") },
                            { value: "other", label: t("documents.other") },
                        ]}
                    />
                    <div className="border-2 border-dashed border-border p-8 text-center">
                        <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click or drag file to upload</p>
                        <input type="file" className="hidden" />
                    </div>
                </div>
            </Modal>
        </PageContainer>
    );
}
