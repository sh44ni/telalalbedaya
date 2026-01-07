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

// DELETE /api/customers/[id] - Delete a customer
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const data = readData();

        const index = data.customers.findIndex((c: Customer) => c.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        data.customers.splice(index, 1);
        writeData(data);

        return NextResponse.json({ message: "Customer deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
    }
}
