"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/layout";
import { Button, DataTable, Column, Modal, Input, Textarea, Select, Badge, useToast } from "@/components/ui";
import { useReceiptsStore, useCustomersStore, usePropertiesStore } from "@/stores/dataStores";
import type { Receipt } from "@/types";
import { Plus, Printer, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ReceiptsPage() {
    const { t } = useTranslation();
    const toast = useToast();
    const { items: receipts, addItem, deleteItem } = useReceiptsStore();
    const { items: customers } = useCustomersStore();
    const { items: properties } = usePropertiesStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: "rent",
        amount: "",
        paidBy: "",
        customerId: "",
        propertyId: "",
        paymentMethod: "cash",
        reference: "",
        description: "",
    });

    const columns: Column<Receipt>[] = [
        { key: "receiptNo", label: t("receipts.receiptNo"), sortable: true },
        {
            key: "type",
            label: t("receipts.receiptType"),
            render: (item) => {
                const variants: Record<string, "default" | "success" | "warning" | "secondary"> = {
                    rent: "default",
                    deposit: "success",
                    maintenance: "warning",
                    other: "secondary",
                };
                return <Badge variant={variants[item.type]}>{t(`receipts.${item.type === "rent" ? "rentPayment" : item.type}`)}</Badge>;
            },
        },
        {
            key: "amount",
            label: t("common.amount"),
            sortable: true,
            render: (item) => formatCurrency(item.amount),
        },
        { key: "paidBy", label: t("receipts.paidBy") },
        {
            key: "paymentMethod",
            label: t("receipts.paymentMethod"),
            render: (item) => t(`receipts.${item.paymentMethod}`),
        },
        {
            key: "date",
            label: t("common.date"),
            sortable: true,
            render: (item) => formatDate(item.date),
        },
    ];

    const generateReceiptNo = () => {
        const year = new Date().getFullYear();
        const count = receipts.length + 1;
        return `RCP-${year}-${count.toString().padStart(4, "0")}`;
    };

    const handleOpenModal = () => {
        setFormData({
            type: "rent",
            amount: "",
            paidBy: "",
            customerId: "",
            propertyId: "",
            paymentMethod: "cash",
            reference: "",
            description: "",
        });
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        const receiptData: Receipt = {
            id: `rcpt-${Date.now()}`,
            receiptNo: generateReceiptNo(),
            type: formData.type as Receipt["type"],
            amount: parseFloat(formData.amount) || 0,
            paidBy: formData.paidBy,
            customerId: formData.customerId || undefined,
            propertyId: formData.propertyId || undefined,
            paymentMethod: formData.paymentMethod as Receipt["paymentMethod"],
            reference: formData.reference || undefined,
            description: formData.description,
            date: new Date().toISOString().split("T")[0],
            createdAt: new Date().toISOString(),
        };

        addItem(receiptData);
        toast.success("Receipt generated successfully: " + receiptData.receiptNo);
        setIsModalOpen(false);
    };

    const handleDelete = (receipt: Receipt) => {
        if (confirm(`Delete receipt "${receipt.receiptNo}"?`)) {
            deleteItem(receipt.id);
            toast.success("Receipt deleted");
        }
    };

    const handlePrint = (receipt: Receipt) => {
        toast.info("Print functionality - Receipt: " + receipt.receiptNo);
        // In a real app, this would open a print dialog
    };

    const customerOptions = customers.map(c => ({ value: c.id, label: c.name }));
    const propertyOptions = properties.map(p => ({ value: p.id, label: p.name }));

    return (
        <PageContainer
            title={t("receipts.title")}
            actions={
                <Button onClick={handleOpenModal}>
                    <Plus size={18} />
                    {t("receipts.generateReceipt")}
                </Button>
            }
        >
            <DataTable
                data={receipts}
                columns={columns}
                keyField="id"
                onDelete={handleDelete}
                actions={(item) => (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePrint(item)}
                            className="p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                            title={t("common.print")}
                        >
                            <Printer size={16} />
                        </button>
                        <button
                            onClick={() => handlePrint(item)}
                            className="p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title={t("common.download")}
                        >
                            <Download size={16} />
                        </button>
                    </div>
                )}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t("receipts.generateReceipt")}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            {t("common.cancel")}
                        </Button>
                        <Button onClick={handleSubmit}>{t("receipts.generateReceipt")}</Button>
                    </>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label={t("receipts.receiptType")}
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        options={[
                            { value: "rent", label: t("receipts.rentPayment") },
                            { value: "deposit", label: t("receipts.deposit") },
                            { value: "maintenance", label: t("receipts.maintenance") },
                            { value: "other", label: t("receipts.other") },
                        ]}
                    />
                    <Input
                        label={t("common.amount") + " (OMR)"}
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                    <Input
                        label={t("receipts.paidBy")}
                        value={formData.paidBy}
                        onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                    />
                    <Select
                        label={t("receipts.paymentMethod")}
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        options={[
                            { value: "cash", label: t("receipts.cash") },
                            { value: "bank_transfer", label: t("receipts.bankTransfer") },
                            { value: "cheque", label: t("receipts.cheque") },
                            { value: "card", label: t("receipts.card") },
                        ]}
                    />
                    <Select
                        label="Customer (Optional)"
                        value={formData.customerId}
                        onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                        options={[{ value: "", label: "Select customer" }, ...customerOptions]}
                    />
                    <Select
                        label="Property (Optional)"
                        value={formData.propertyId}
                        onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                        options={[{ value: "", label: "Select property" }, ...propertyOptions]}
                    />
                    <Input
                        label={t("receipts.reference") + " (Optional)"}
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        placeholder="Transaction ID, Cheque No., etc."
                    />
                    <div className="md:col-span-2">
                        <Textarea
                            label={t("common.description")}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Payment description..."
                        />
                    </div>
                </div>
            </Modal>
        </PageContainer>
    );
}
