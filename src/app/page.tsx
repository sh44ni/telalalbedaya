"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout";
import { Button, Card, CardContent, Select, useToast, Modal } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Home,
  Building2,
  FileText,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Eye,
  Bed,
  Bath,
  Maximize2
} from "lucide-react";
import type { Property } from "@/types";

// Property type icons mapping
const propertyTypeIcons: Record<string, string> = {
  apartment: "🏢",
  villa: "🏠",
  shop: "🏪",
  office: "🏛️",
  land: "🌍",
  warehouse: "🏭",
};

interface ChartDataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

interface DashboardData {
  financial: {
    revenue: number;
    expenses: number;
    netIncome: number;
    revenueChange: number;
    expenseChange: number;
  };
  chartData: ChartDataPoint[];
  properties: {
    total: number;
    available: number;
    rented: number;
    sold: number;
  };
  rentals: {
    total: number;
    paid: number;
    overdue: number;
    unpaid: number;
  };
  period: string;
}

const periodOptions = [
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "this_year", label: "This Year" },
  { value: "all", label: "All Time" },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const [period, setPeriod] = useState("this_month");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Available properties state
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/dashboard?period=${period}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  const fetchAvailableProperties = useCallback(async () => {
    try {
      const response = await fetch("/api/properties?status=available");
      if (response.ok) {
        const result = await response.json();
        setAvailableProperties(result);
      }
    } catch (error) {
      console.error("Error fetching available properties:", error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchAvailableProperties();
  }, [fetchDashboardData, fetchAvailableProperties]);



  const handleGenerateStatement = () => {
    toast.info("Generating statement...");
    // TODO: Implement statement generation
    setTimeout(() => {
      toast.success("Statement feature coming soon!");
    }, 1000);
  };

  return (
    <PageContainer
      title={t("nav.dashboard")}
      actions={
        <div className="flex items-center gap-3">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={periodOptions}
            className="min-w-[150px]"
          />
          <Button variant="outline" onClick={handleGenerateStatement}>
            <FileText size={16} />
            Statement
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Financial Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Revenue Card */}
          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-success mt-1">
                    {loading ? "..." : formatCurrency(data?.financial.revenue || 0)}
                  </p>
                  {data && data.financial.revenueChange !== 0 && !loading && (
                    <div className={`flex items-center gap-1 mt-2 text-sm ${data.financial.revenueChange > 0 ? "text-success" : "text-destructive"}`}>
                      {data.financial.revenueChange > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      <span>{Math.abs(data.financial.revenueChange)}% vs last period</span>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-success/10 text-success">
                  <TrendingUp size={28} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Card */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Expenses</p>
                  <p className="text-3xl font-bold text-destructive mt-1">
                    {loading ? "..." : formatCurrency(data?.financial.expenses || 0)}
                  </p>
                  {data && data.financial.expenseChange !== 0 && !loading && (
                    <div className={`flex items-center gap-1 mt-2 text-sm ${data.financial.expenseChange < 0 ? "text-success" : "text-destructive"}`}>
                      {data.financial.expenseChange > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      <span>{Math.abs(data.financial.expenseChange)}% vs last period</span>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-destructive/10 text-destructive">
                  <TrendingDown size={28} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Net Income Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Net Income</p>
                  <p className={`text-3xl font-bold mt-1 ${(data?.financial.netIncome || 0) >= 0 ? "text-primary" : "text-destructive"}`}>
                    {loading ? "..." : formatCurrency(data?.financial.netIncome || 0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Revenue - Expenses
                  </p>
                </div>
                <div className="p-3 bg-primary/10 text-primary">
                  <DollarSign size={28} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Chart Section */}
        {data?.chartData && data.chartData.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={data.chartData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Properties Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 size={20} />
              Properties
            </h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/properties")}>
              View All <ArrowRight size={14} />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Properties */}
            <Card
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => router.push("/properties")}
            >
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-muted inline-block mb-2">
                  <Building2 size={20} className="text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{loading ? "-" : data?.properties.total || 0}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </CardContent>
            </Card>

            {/* Available */}
            <Card
              className="cursor-pointer hover:border-success/50 transition-colors"
              onClick={() => router.push("/properties?status=available")}
            >
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-success/10 inline-block mb-2">
                  <CheckCircle size={20} className="text-success" />
                </div>
                <p className="text-2xl font-bold text-success">{loading ? "-" : data?.properties.available || 0}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </CardContent>
            </Card>

            {/* Rented */}
            <Card
              className="cursor-pointer hover:border-blue-500/50 transition-colors"
              onClick={() => router.push("/properties?status=rented")}
            >
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-blue-500/10 inline-block mb-2">
                  <Home size={20} className="text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-blue-500">{loading ? "-" : data?.properties.rented || 0}</p>
                <p className="text-sm text-muted-foreground">Rented</p>
              </CardContent>
            </Card>

            {/* Sold */}
            <Card
              className="cursor-pointer hover:border-orange-500/50 transition-colors"
              onClick={() => router.push("/properties?status=sold")}
            >
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-orange-500/10 inline-block mb-2">
                  <DollarSign size={20} className="text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-orange-500">{loading ? "-" : data?.properties.sold || 0}</p>
                <p className="text-sm text-muted-foreground">Sold</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rentals Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Home size={20} />
              Rentals
            </h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/rentals")}>
              View All <ArrowRight size={14} />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Rentals */}
            <Card
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => router.push("/rentals")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Rentals</p>
                    <p className="text-2xl font-bold mt-1">{loading ? "-" : data?.rentals.total || 0}</p>
                  </div>
                  <div className="p-2 bg-muted">
                    <Home size={20} className="text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Paid */}
            <Card
              className="cursor-pointer hover:border-success/50 transition-colors"
              onClick={() => router.push("/rentals?status=paid")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Paid</p>
                    <p className="text-2xl font-bold text-success mt-1">{loading ? "-" : data?.rentals.paid || 0}</p>
                  </div>
                  <div className="p-2 bg-success/10">
                    <CheckCircle size={20} className="text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overdue */}
            <Card
              className="cursor-pointer hover:border-destructive/50 transition-colors"
              onClick={() => router.push("/rentals?status=overdue")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                    <p className="text-2xl font-bold text-destructive mt-1">{loading ? "-" : data?.rentals.overdue || 0}</p>
                  </div>
                  <div className="p-2 bg-destructive/10">
                    <AlertTriangle size={20} className="text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Available Properties Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle size={20} className="text-success" />
              Available Properties ({availableProperties.length})
            </h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/properties?status=available")}>
              View All <ArrowRight size={14} />
            </Button>
          </div>

          {availableProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableProperties.slice(0, 6).map((property) => (
                <Card
                  key={property.id}
                  className="hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{propertyTypeIcons[property.type] || "🏠"}</span>
                          <span className="font-semibold truncate">{property.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <MapPin size={12} />
                          <span className="truncate">{property.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground capitalize">{property.type}</span>
                          {property.rentalPrice && (
                            <span className="text-sm font-medium text-success">
                              {formatCurrency(property.rentalPrice)}/mo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingProperty(property)}
                      >
                        <Eye size={14} />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Building2 size={40} className="mx-auto mb-4 opacity-50" />
                <p>No available properties</p>
                <p className="text-sm">All properties are currently rented or sold</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Property Details Modal */}
      <Modal
        isOpen={!!viewingProperty}
        onClose={() => setViewingProperty(null)}
        title={viewingProperty?.name || "Property Details"}
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setViewingProperty(null)}>
              Close
            </Button>
            <Button onClick={() => router.push("/properties")}>
              View All Properties
            </Button>
          </div>
        }
      >
        {viewingProperty && (
          <div className="space-y-4">
            {/* Property ID and Type */}
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-2xl">{propertyTypeIcons[viewingProperty.type] || "🏠"}</span>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">ID: </span>
                <span className="font-mono text-sm">{viewingProperty.propertyId || "-"}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{viewingProperty.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Area</p>
                  <p className="font-medium">{viewingProperty.area} sqm</p>
                </div>
              </div>
              {viewingProperty.bedrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <Bed size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                    <p className="font-medium">{viewingProperty.bedrooms}</p>
                  </div>
                </div>
              )}
              {viewingProperty.bathrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <Bath size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Bathrooms</p>
                    <p className="font-medium">{viewingProperty.bathrooms}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
              <div className="bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Sale Price</p>
                <p className="text-lg font-bold">{formatCurrency(viewingProperty.price)}</p>
              </div>
              {viewingProperty.rentalPrice && (
                <div className="bg-success/10 p-3">
                  <p className="text-xs text-muted-foreground">Rental Price</p>
                  <p className="text-lg font-bold text-success">{formatCurrency(viewingProperty.rentalPrice)}/mo</p>
                </div>
              )}
            </div>

            {/* Description */}
            {viewingProperty.description && (
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{viewingProperty.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
