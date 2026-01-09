import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { Customer } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/customers/[id] - Get a single customer
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const data = readData();
        const customer = data.customers.find((c: Customer) => c.id === id);

        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
    }
}

// PUT /api/customers/[id] - Update a customer
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const updates: Partial<Customer> = await request.json();
        const data = readData();

        const index = data.customers.findIndex((c: Customer) => c.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        // Merge updates with existing customer
        data.customers[index] = {
            ...data.customers[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        writeData(data);
        return NextResponse.json(data.customers[index]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
    }
}

// DELETE /api/customers/[id] - Delete a customer with cascade
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const data = readData();

        const index = data.customers.findIndex((c: Customer) => c.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        const customer = data.customers[index];

        // Track what gets deleted for the response
        let deletedTransactions = 0;
        let deletedRentals = 0;
        let freedProperties = 0;

        // 1. Delete all transactions for this customer from both receipts and transactions arrays
        // Note: Transactions are stored in data.receipts (legacy name from the codebase)
        if (data.receipts) {
            const originalLength = data.receipts.length;
            data.receipts = data.receipts.filter(
                (t: { customerId?: string }) => t.customerId !== id
            );
            deletedTransactions += originalLength - data.receipts.length;
        }
        // Also check the transactions array (if it exists and has data)
        if (data.transactions && data.transactions.length > 0) {
            const originalLength = data.transactions.length;
            data.transactions = data.transactions.filter(
                (t: { customerId?: string }) => t.customerId !== id
            );
            deletedTransactions += originalLength - data.transactions.length;
        }

        // 2. Find and delete rentals for this customer (tenant), mark properties as available
        if (data.rentals) {
            const customerRentals = data.rentals.filter(
                (r: { tenantId?: string }) => r.tenantId === id
            );

            // Mark rented properties as available
            for (const rental of customerRentals) {
                const propertyIndex = data.properties?.findIndex(
                    (p: { id: string }) => p.id === rental.propertyId
                );
                if (propertyIndex !== undefined && propertyIndex !== -1) {
                    data.properties[propertyIndex].status = "available";
                    freedProperties++;
                }
            }

            // Delete the rentals
            const originalRentalsLength = data.rentals.length;
            data.rentals = data.rentals.filter(
                (r: { tenantId?: string }) => r.tenantId !== id
            );
            deletedRentals = originalRentalsLength - data.rentals.length;
        }

        // 3. Delete the customer
        data.customers.splice(index, 1);
        writeData(data);

        return NextResponse.json({
            message: "Customer deleted successfully",
            deletedTransactions,
            deletedRentals,
            freedProperties,
            customerName: customer.name
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
    }
}
