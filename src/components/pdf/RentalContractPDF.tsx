"use client";

import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";
import type { RentalContract } from "@/types";

// Disable hyphenation for proper text rendering
Font.registerHyphenationCallback((word) => [word]);

// Styles
const styles = StyleSheet.create({
    page: {
        position: "relative",
    },
    // Container that holds everything
    container: {
        position: "relative",
        width: "100%",
        height: "100%",
    },
    // Background image covering full page
    backgroundImage: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    },
    // Text overlay base style
    overlay: {
        position: "absolute",
        fontSize: 9,
        fontFamily: "Helvetica",
        color: "#000",
    },
});

interface RentalContractPDFProps {
    contract: RentalContract;
}

// Format date helper
const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
        return dateString;
    }
};

export function RentalContractPDF({ contract }: RentalContractPDFProps) {
    // Field positions in percentages of page dimensions
    // This makes positioning more reliable across different renderers

    return (
        <Document>
            {/* PAGE 1 - Contract Form */}
            <Page size="A4" style={styles.page}>
                <View style={styles.container}>
                    {/* Background template image */}
                    <Image
                        style={styles.backgroundImage}
                        src="/pdf-template-page1.png"
                    />

                    {/* === HEADER SECTION === */}
                    {/* Agreement No */}
                    <Text style={[styles.overlay, { top: "5.5%", left: "78%", fontSize: 8 }]}>
                        {contract.contractNumber || ""}
                    </Text>

                    {/* Date */}
                    <Text style={[styles.overlay, { top: "7.5%", left: "78%", fontSize: 8 }]}>
                        {formatDate(contract.createdAt)}
                    </Text>

                    {/* === LANDLORD DETAILS === */}
                    {/* Name */}
                    <Text style={[styles.overlay, { top: "15.5%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.landlordName || ""}
                    </Text>

                    {/* CR No */}
                    <Text style={[styles.overlay, { top: "18%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.landlordCR || ""}
                    </Text>

                    {/* P.O. Box */}
                    <Text style={[styles.overlay, { top: "20.5%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.landlordPOBox || ""}
                    </Text>

                    {/* Postal Code */}
                    <Text style={[styles.overlay, { top: "23%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.landlordPostalCode || ""}
                    </Text>

                    {/* Address */}
                    <Text style={[styles.overlay, { top: "25.5%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.landlordAddress || ""}
                    </Text>

                    {/* === TENANT DETAILS === */}
                    {/* Name */}
                    <Text style={[styles.overlay, { top: "31%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.tenantName || ""}
                    </Text>

                    {/* Id/Passport */}
                    <Text style={[styles.overlay, { top: "34%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.tenantIdPassport || ""}
                    </Text>

                    {/* Labour Card */}
                    <Text style={[styles.overlay, { top: "37%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.tenantLabourCard || "N/A"}
                    </Text>

                    {/* Sponsor Name */}
                    <Text style={[styles.overlay, { top: "40%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.tenantSponsor || "N/A"}
                    </Text>

                    {/* CR (For Companies) */}
                    <Text style={[styles.overlay, { top: "43%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.tenantCR || "N/A"}
                    </Text>

                    {/* Phone Number */}
                    <Text style={[styles.overlay, { top: "46%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.tenantPhone || ""}
                    </Text>

                    {/* Email */}
                    <Text style={[styles.overlay, { top: "52%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.tenantEmail || ""}
                    </Text>

                    {/* === AGREEMENT DETAILS === */}
                    {/* From Date */}
                    <Text style={[styles.overlay, { top: "61%", left: "17%", width: "18%", textAlign: "center" }]}>
                        {formatDate(contract.validFrom)}
                    </Text>

                    {/* Expiring Date */}
                    <Text style={[styles.overlay, { top: "61%", left: "45%", width: "18%", textAlign: "center" }]}>
                        {formatDate(contract.validTo)}
                    </Text>

                    {/* Monthly Rental Fee */}
                    <Text style={[styles.overlay, { top: "64%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {`OMR ${contract.monthlyRent?.toFixed(3) || "0.000"}`}
                    </Text>

                    {/* Payment Frequency */}
                    <Text style={[styles.overlay, { top: "67%", left: "22%", width: "48%", textAlign: "center" }]}>
                        {contract.paymentFrequency === "monthly" ? "Monthly" :
                            contract.paymentFrequency === "quarterly" ? "Quarterly" :
                                contract.paymentFrequency === "yearly" ? "Yearly" : ""}
                    </Text>

                    {/* === SIGNATURES === */}
                    {/* Left side - Tenant */}
                    <Text style={[styles.overlay, { top: "77%", left: "8%", width: "30%", textAlign: "left" }]}>
                        {contract.tenantName || ""}
                    </Text>

                    <Text style={[styles.overlay, { top: "83%", left: "8%", width: "30%", textAlign: "left" }]}>
                        {formatDate(contract.tenantSignDate)}
                    </Text>

                    {/* Right side - Landlord */}
                    <Text style={[styles.overlay, { top: "77%", left: "55%", width: "30%", textAlign: "left" }]}>
                        {contract.landlordName || ""}
                    </Text>

                    <Text style={[styles.overlay, { top: "83%", left: "55%", width: "30%", textAlign: "left" }]}>
                        {formatDate(contract.landlordSignDate)}
                    </Text>
                </View>
            </Page>

            {/* PAGE 2 - Terms and Conditions (static, no dynamic content) */}
            <Page size="A4" style={styles.page}>
                <View style={styles.container}>
                    <Image
                        style={styles.backgroundImage}
                        src="/pdf-template-page2.png"
                    />
                </View>
            </Page>
        </Document>
    );
}

export default RentalContractPDF;
