import { create } from "zustand";
import type { Project, Property, Customer, Rental, Receipt, Contract, Document } from "@/types";

// ============ Mock Data ============

export const mockProjects: Project[] = [
    {
        id: "proj-001",
        name: "Al Noor Tower",
        description: "Luxury residential tower with 40 apartments",
        budget: 15000000,
        spent: 8500000,
        completion: 65,
        status: "in_progress",
        startDate: "2024-01-15",
        endDate: "2025-06-30",
        costs: { materials: 5000000, labor: 2500000, overhead: 1000000 },
        createdAt: "2024-01-10",
        updatedAt: "2025-12-15",
    },
    {
        id: "proj-002",
        name: "Palm Villas Complex",
        description: "10 luxury villas with private gardens",
        budget: 25000000,
        spent: 22000000,
        completion: 92,
        status: "in_progress",
        startDate: "2023-06-01",
        endDate: "2025-02-28",
        costs: { materials: 12000000, labor: 7000000, overhead: 3000000 },
        createdAt: "2023-05-20",
        updatedAt: "2025-12-20",
    },
    {
        id: "proj-003",
        name: "Business Hub Mall",
        description: "Commercial center with 50 retail units",
        budget: 35000000,
        spent: 5000000,
        completion: 15,
        status: "in_progress",
        startDate: "2025-01-01",
        endDate: "2026-12-31",
        costs: { materials: 2500000, labor: 1500000, overhead: 1000000 },
        createdAt: "2024-12-01",
        updatedAt: "2025-12-28",
    },
];

export const mockProperties: Property[] = [
    {
        id: "prop-001",
        name: "Al Noor Tower - Unit 101",
        type: "apartment",
        status: "rented",
        price: 1200000,
        rentalPrice: 85000,
        area: 150,
        bedrooms: 3,
        bathrooms: 2,
        location: "Dubai Marina",
        address: "Al Noor Tower, Unit 101, Dubai Marina, Dubai",
        description: "Spacious 3BR apartment with marina view",
        features: ["Marina View", "Gym", "Pool", "Parking"],
        images: [],
        projectId: "proj-001",
        createdAt: "2024-03-01",
        updatedAt: "2025-12-01",
    },
    {
        id: "prop-002",
        name: "Palm Villa 5",
        type: "villa",
        status: "available",
        price: 4500000,
        rentalPrice: 250000,
        area: 450,
        bedrooms: 5,
        bathrooms: 6,
        location: "Palm Jumeirah",
        address: "Palm Villas Complex, Villa 5, Palm Jumeirah, Dubai",
        description: "Luxury villa with private pool and beach access",
        features: ["Private Pool", "Beach Access", "Garden", "Maid Room", "Driver Room"],
        images: [],
        projectId: "proj-002",
        createdAt: "2024-08-15",
        updatedAt: "2025-11-20",
    },
    {
        id: "prop-003",
        name: "Business Hub - Shop 12",
        type: "shop",
        status: "available",
        price: 800000,
        rentalPrice: 120000,
        area: 80,
        location: "Business Bay",
        address: "Business Hub Mall, Shop 12, Business Bay, Dubai",
        description: "Prime retail location with high foot traffic",
        features: ["Corner Unit", "Display Window", "Storage"],
        images: [],
        projectId: "proj-003",
        createdAt: "2025-01-15",
        updatedAt: "2025-12-25",
    },
    {
        id: "prop-004",
        name: "Al Noor Tower - Unit 205",
        type: "apartment",
        status: "available",
        price: 950000,
        rentalPrice: 65000,
        area: 120,
        bedrooms: 2,
        bathrooms: 2,
        location: "Dubai Marina",
        address: "Al Noor Tower, Unit 205, Dubai Marina, Dubai",
        description: "Modern 2BR apartment with city view",
        features: ["City View", "Gym", "Pool", "Parking"],
        images: [],
        projectId: "proj-001",
        createdAt: "2024-04-10",
        updatedAt: "2025-12-10",
    },
    {
        id: "prop-005",
        name: "Business Hub - Office 301",
        type: "office",
        status: "rented",
        price: 1500000,
        rentalPrice: 180000,
        area: 200,
        location: "Business Bay",
        address: "Business Hub Mall, Office 301, Business Bay, Dubai",
        description: "Premium office space with meeting rooms",
        features: ["Meeting Room", "Reception Area", "Pantry", "Parking"],
        images: [],
        projectId: "proj-003",
        createdAt: "2025-02-01",
        updatedAt: "2025-12-20",
    },
];

export const mockCustomers: Customer[] = [
    {
        id: "cust-001",
        name: "Ahmed Al Rashid",
        type: "tenant",
        email: "ahmed.rashid@email.com",
        phone: "+971501234567",
        address: "Al Noor Tower, Unit 101, Dubai",
        emiratesId: "784-XXXX-XXXXXXX-X",
        nationality: "UAE",
        notes: "Long-term tenant, pays on time",
        assignedPropertyIds: ["prop-001"],
        createdAt: "2024-03-15",
        updatedAt: "2025-12-01",
    },
    {
        id: "cust-002",
        name: "Sarah Johnson",
        type: "buyer",
        email: "sarah.j@email.com",
        phone: "+971502345678",
        address: "JBR, Dubai",
        passportNo: "US12345678",
        nationality: "USA",
        notes: "Interested in luxury villas",
        assignedPropertyIds: [],
        createdAt: "2025-01-10",
        updatedAt: "2025-12-15",
    },
    {
        id: "cust-003",
        name: "Mohammed Hassan",
        type: "tenant",
        email: "m.hassan@email.com",
        phone: "+971503456789",
        address: "Business Hub, Office 301, Dubai",
        emiratesId: "784-XXXX-XXXXXXX-X",
        nationality: "Egypt",
        notes: "Corporate tenant - Tech company",
        assignedPropertyIds: ["prop-005"],
        createdAt: "2025-02-20",
        updatedAt: "2025-12-10",
    },
    {
        id: "cust-004",
        name: "Fatima Al Maktoum",
        type: "lead",
        email: "fatima.m@email.com",
        phone: "+971504567890",
        address: "Downtown Dubai",
        nationality: "UAE",
        notes: "Looking for investment properties",
        assignedPropertyIds: [],
        createdAt: "2025-12-01",
        updatedAt: "2025-12-28",
    },
];

export const mockRentals: Rental[] = [
    {
        id: "rent-001",
        propertyId: "prop-001",
        tenantId: "cust-001",
        monthlyRent: 85000,
        depositAmount: 85000,
        leaseStart: "2024-04-01",
        leaseEnd: "2025-03-31",
        dueDay: 1,
        paymentStatus: "paid",
        paidUntil: "2026-01-01",
        notes: "Annual contract, auto-renewal",
        createdAt: "2024-03-20",
        updatedAt: "2025-12-26",
    },
    {
        id: "rent-002",
        propertyId: "prop-005",
        tenantId: "cust-003",
        monthlyRent: 15000,
        depositAmount: 30000,
        leaseStart: "2025-03-01",
        leaseEnd: "2026-02-28",
        dueDay: 1,
        paymentStatus: "overdue",
        paidUntil: "2025-11-01",
        notes: "Monthly payment plan",
        createdAt: "2025-02-25",
        updatedAt: "2025-12-28",
    },
];

export const mockReceipts: Receipt[] = [
    {
        id: "rcpt-001",
        receiptNo: "RCP-2025-0001",
        type: "rent",
        amount: 85000,
        paidBy: "Ahmed Al Rashid",
        customerId: "cust-001",
        propertyId: "prop-001",
        rentalId: "rent-001",
        paymentMethod: "bank_transfer",
        reference: "TRF-123456",
        description: "Rent payment for January 2026",
        date: "2025-12-26",
        createdAt: "2025-12-26",
    },
    {
        id: "rcpt-002",
        receiptNo: "RCP-2025-0002",
        type: "deposit",
        amount: 30000,
        paidBy: "Mohammed Hassan",
        customerId: "cust-003",
        propertyId: "prop-005",
        paymentMethod: "cheque",
        reference: "CHQ-789012",
        description: "Security deposit for Office 301",
        date: "2025-02-25",
        createdAt: "2025-02-25",
    },
];

export const mockContracts: Contract[] = [
    {
        id: "cont-001",
        contractNo: "CTR-2024-0001",
        type: "rental",
        status: "signed",
        propertyId: "prop-001",
        customerId: "cust-001",
        amount: 85000,
        startDate: "2024-04-01",
        endDate: "2025-03-31",
        signatureDate: "2024-03-20",
        terms: "12-month lease with option to renew",
        createdAt: "2024-03-15",
        updatedAt: "2024-03-20",
    },
    {
        id: "cont-002",
        contractNo: "CTR-2025-0001",
        type: "rental",
        status: "signed",
        propertyId: "prop-005",
        customerId: "cust-003",
        amount: 180000,
        startDate: "2025-03-01",
        endDate: "2026-02-28",
        signatureDate: "2025-02-25",
        terms: "12-month commercial lease",
        createdAt: "2025-02-20",
        updatedAt: "2025-02-25",
    },
];

export const mockDocuments: Document[] = [
    {
        id: "doc-001",
        name: "Rental Agreement - Ahmed Al Rashid.pdf",
        category: "contracts",
        fileType: "application/pdf",
        fileSize: 245000,
        fileUrl: "/documents/contract-001.pdf",
        relatedTo: { type: "contract", id: "cont-001" },
        uploadDate: "2024-03-20",
        createdAt: "2024-03-20",
    },
    {
        id: "doc-002",
        name: "Emirates ID - Ahmed Al Rashid.pdf",
        category: "identities",
        fileType: "application/pdf",
        fileSize: 125000,
        fileUrl: "/documents/id-001.pdf",
        relatedTo: { type: "customer", id: "cust-001" },
        uploadDate: "2024-03-15",
        createdAt: "2024-03-15",
    },
];

// ============ Data Stores ============

interface DataStore<T> {
    items: T[];
    loading: boolean;
    error: string | null;
    fetchItems: () => Promise<void>;
    addItem: (item: T) => void;
    updateItem: (id: string, item: Partial<T>) => void;
    deleteItem: (id: string) => void;
    getById: (id: string) => T | undefined;
}

// Projects Store
export const useProjectsStore = create<DataStore<Project>>((set, get) => ({
    items: [],
    loading: false,
    error: null,
    fetchItems: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch("/api/projects");
            if (!response.ok) throw new Error("Failed to fetch");
            const projects = await response.json();
            set({ items: projects, loading: false });
        } catch (error) {
            console.warn("API unavailable:", error);
            set({ items: [], loading: false, error: "Failed to fetch projects" });
        }
    },
    addItem: async (item) => {
        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            if (response.ok) {
                const newProject = await response.json();
                set((state) => ({ items: [...state.items, newProject] }));
                return;
            }
        } catch (error) {
            console.error("Failed to add project:", error);
        }
        set((state) => ({ items: [...state.items, item] }));
    },
    updateItem: async (id, updates) => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (response.ok) {
                const updated = await response.json();
                set((state) => ({
                    items: state.items.map((i) => (i.id === id ? updated : i)),
                }));
                return;
            }
        } catch (error) {
            console.error("Failed to update project:", error);
        }
        set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
    },
    deleteItem: async (id) => {
        try {
            await fetch(`/api/projects/${id}`, { method: "DELETE" });
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    },
    getById: (id) => get().items.find((item) => item.id === id),
}));

// Properties Store
export const usePropertiesStore = create<DataStore<Property>>((set, get) => ({
    items: [],
    loading: false,
    error: null,
    fetchItems: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch("/api/properties");
            if (!response.ok) throw new Error("Failed to fetch");
            const properties = await response.json();
            set({ items: properties, loading: false });
        } catch (error) {
            console.warn("API unavailable:", error);
            set({ items: [], loading: false, error: "Failed to fetch properties" });
        }
    },
    addItem: async (item) => {
        try {
            const response = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            if (response.ok) {
                const newProperty = await response.json();
                set((state) => ({ items: [...state.items, newProperty] }));
                return;
            }
        } catch (error) {
            console.error("Failed to add property:", error);
        }
        set((state) => ({ items: [...state.items, item] }));
    },
    updateItem: async (id, updates) => {
        try {
            const response = await fetch(`/api/properties/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (response.ok) {
                const updated = await response.json();
                set((state) => ({
                    items: state.items.map((i) => (i.id === id ? updated : i)),
                }));
                return;
            }
        } catch (error) {
            console.error("Failed to update property:", error);
        }
        set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
    },
    deleteItem: async (id) => {
        try {
            await fetch(`/api/properties/${id}`, { method: "DELETE" });
        } catch (error) {
            console.error("Failed to delete property:", error);
        }
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    },
    getById: (id) => get().items.find((item) => item.id === id),
}));

// Customers Store
export const useCustomersStore = create<DataStore<Customer>>((set, get) => ({
    items: [],
    loading: false,
    error: null,
    fetchItems: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch("/api/customers");
            if (!response.ok) throw new Error("Failed to fetch");
            const customers = await response.json();
            set({ items: customers, loading: false });
        } catch (error) {
            console.warn("API unavailable:", error);
            set({ items: [], loading: false, error: "Failed to fetch customers" });
        }
    },
    addItem: async (item) => {
        try {
            const response = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            if (response.ok) {
                const newCustomer = await response.json();
                set((state) => ({ items: [...state.items, newCustomer] }));
                return;
            }
        } catch (error) {
            console.error("Failed to add customer:", error);
        }
        set((state) => ({ items: [...state.items, item] }));
    },
    updateItem: async (id, updates) => {
        try {
            const response = await fetch(`/api/customers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (response.ok) {
                const updated = await response.json();
                set((state) => ({
                    items: state.items.map((i) => (i.id === id ? updated : i)),
                }));
                return;
            }
        } catch (error) {
            console.error("Failed to update customer:", error);
        }
        set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
    },
    deleteItem: async (id) => {
        try {
            await fetch(`/api/customers/${id}`, { method: "DELETE" });
        } catch (error) {
            console.error("Failed to delete customer:", error);
        }
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    },
    getById: (id) => get().items.find((item) => item.id === id),
}));

// Rentals Store
export const useRentalsStore = create<DataStore<Rental>>((set, get) => ({
    items: [],
    loading: false,
    error: null,
    fetchItems: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch("/api/rentals");
            if (!response.ok) throw new Error("Failed to fetch");
            const rentals = await response.json();
            set({ items: rentals, loading: false });
        } catch (error) {
            console.warn("API unavailable:", error);
            set({ items: [], loading: false, error: "Failed to fetch rentals" });
        }
    },
    addItem: async (item) => {
        try {
            const response = await fetch("/api/rentals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            if (response.ok) {
                const newRental = await response.json();
                set((state) => ({ items: [...state.items, newRental] }));
                return;
            }
        } catch (error) {
            console.error("Failed to add rental:", error);
        }
        set((state) => ({ items: [...state.items, item] }));
    },
    updateItem: async (id, updates) => {
        try {
            const response = await fetch(`/api/rentals/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (response.ok) {
                const updated = await response.json();
                set((state) => ({
                    items: state.items.map((i) => (i.id === id ? updated : i)),
                }));
                return;
            }
        } catch (error) {
            console.error("Failed to update rental:", error);
        }
        set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
    },
    deleteItem: async (id) => {
        try {
            await fetch(`/api/rentals/${id}`, { method: "DELETE" });
        } catch (error) {
            console.error("Failed to delete rental:", error);
        }
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    },
    getById: (id) => get().items.find((item) => item.id === id),
}));

// Receipts Store
export const useReceiptsStore = create<DataStore<Receipt>>((set, get) => ({
    items: mockReceipts,
    loading: false,
    error: null,
    fetchItems: async () => {
        set({ loading: true, error: null });
        await new Promise((r) => setTimeout(r, 500));
        set({ items: mockReceipts, loading: false });
    },
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    updateItem: (id, updates) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, ...updates } : item
            ),
        })),
    deleteItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
    getById: (id) => get().items.find((item) => item.id === id),
}));

// Contracts Store
export const useContractsStore = create<DataStore<Contract>>((set, get) => ({
    items: mockContracts,
    loading: false,
    error: null,
    fetchItems: async () => {
        set({ loading: true, error: null });
        await new Promise((r) => setTimeout(r, 500));
        set({ items: mockContracts, loading: false });
    },
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    updateItem: (id, updates) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, ...updates } : item
            ),
        })),
    deleteItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
    getById: (id) => get().items.find((item) => item.id === id),
}));

// Documents Store
export const useDocumentsStore = create<DataStore<Document>>((set, get) => ({
    items: mockDocuments,
    loading: false,
    error: null,
    fetchItems: async () => {
        set({ loading: true, error: null });
        await new Promise((r) => setTimeout(r, 500));
        set({ items: mockDocuments, loading: false });
    },
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    updateItem: (id, updates) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, ...updates } : item
            ),
        })),
    deleteItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
    getById: (id) => get().items.find((item) => item.id === id),
}));
