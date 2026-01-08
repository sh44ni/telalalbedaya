import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper function to clean a db.json file
function cleanDatabaseFile(dbPath: string) {
    if (!fs.existsSync(dbPath)) {
        return null;
    }

    try {
        const fileContent = fs.readFileSync(dbPath, "utf-8");
        const db = JSON.parse(fileContent);

        // Count items before cleaning
        const counts = {
            customers: db.customers?.length || 0,
            projects: db.projects?.length || 0,
            properties: db.properties?.length || 0,
            rentals: db.rentals?.length || 0,
            contracts: db.contracts?.length || 0,
            documents: db.documents?.length || 0,
            receipts: db.receipts?.length || 0,
            rentalContracts: db.rentalContracts?.length || 0,
            transactions: db.transactions?.length || 0,
        };

        // Preserve users but clear all other data
        const cleanedDb = {
            users: db.users || [], // Keep users (admin account)
            projects: [],
            properties: [],
            customers: [],
            rentals: [],
            receipts: [],
            contracts: [],
            documents: [],
            rentalContracts: [],
            transactions: [],
        };

        fs.writeFileSync(dbPath, JSON.stringify(cleanedDb, null, 2), "utf-8");

        return counts;
    } catch (error) {
        console.error(`Error cleaning database at ${dbPath}:`, error);
        return null;
    }
}

// Helper function to clean a directory of files
function cleanDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        return 0;
    }

    let deletedCount = 0;
    try {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            try {
                const stat = fs.statSync(filePath);
                if (stat.isFile()) {
                    fs.unlinkSync(filePath);
                    deletedCount++;
                }
            } catch (err) {
                console.error(`Failed to delete file ${filePath}:`, err);
            }
        }
    } catch (err) {
        console.error(`Error reading directory ${dirPath}:`, err);
    }

    return deletedCount;
}

// DELETE - Clean all user data (customers, projects, properties, rentals, contracts, documents)
export async function DELETE() {
    try {
        const cwd = process.cwd();

        // Clean both possible db.json locations
        const mainDbPath = path.join(cwd, "data", "db.json");
        const nestedDbPath = path.join(cwd, "telalalbedaya", "data", "db.json");

        const mainCounts = cleanDatabaseFile(mainDbPath);
        const nestedCounts = cleanDatabaseFile(nestedDbPath);

        // Combine counts from both databases
        const totalCounts = {
            customers: (mainCounts?.customers || 0) + (nestedCounts?.customers || 0),
            projects: (mainCounts?.projects || 0) + (nestedCounts?.projects || 0),
            properties: (mainCounts?.properties || 0) + (nestedCounts?.properties || 0),
            rentals: (mainCounts?.rentals || 0) + (nestedCounts?.rentals || 0),
            contracts: (mainCounts?.contracts || 0) + (nestedCounts?.contracts || 0),
            documents: (mainCounts?.documents || 0) + (nestedCounts?.documents || 0),
            receipts: (mainCounts?.receipts || 0) + (nestedCounts?.receipts || 0),
            rentalContracts: (mainCounts?.rentalContracts || 0) + (nestedCounts?.rentalContracts || 0),
            transactions: (mainCounts?.transactions || 0) + (nestedCounts?.transactions || 0),
        };

        // Clean uploaded files from both locations
        let filesDeleted = 0;
        filesDeleted += cleanDirectory(path.join(cwd, "public", "uploads"));
        filesDeleted += cleanDirectory(path.join(cwd, "public", "documents"));
        filesDeleted += cleanDirectory(path.join(cwd, "telalalbedaya", "public", "uploads"));
        filesDeleted += cleanDirectory(path.join(cwd, "telalalbedaya", "public", "documents"));

        return NextResponse.json({
            success: true,
            message: "All data has been deleted successfully",
            deleted: totalCounts,
            filesDeleted,
        });
    } catch (error) {
        console.error("Error cleaning data:", error);
        return NextResponse.json(
            { error: "Failed to clean data" },
            { status: 500 }
        );
    }
}

