"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout";
import { Button, Card, CardContent, Select, useToast, Modal, Input } from "@/components/ui";
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
  Clock,
  HardDrive,
  Trash2
} from "lucide-react";

interface StorageData {
  total: number;
  system: number;
  data: number;
  available: number;
  formatted: {
    total: string;
    system: string;
    data: string;
    available: string;
  };
}

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

  // Storage management state
  const [storageData, setStorageData] = useState<StorageData | null>(null);
  const [showCleanModal, setShowCleanModal] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [cleaning, setCleaning] = useState(false);

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

  const fetchStorageData = useCallback(async () => {
    try {
      const response = await fetch("/api/storage");
      if (response.ok) {
        const result = await response.json();
        setStorageData(result);
      }
    } catch (error) {
      console.error("Error fetching storage data:", error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchStorageData();
  }, [fetchDashboardData, fetchStorageData]);

  const handleCleanData = async () => {
    if (confirmPhrase !== "DELETE ALL DATA") return;

    setCleaning(true);
    try {
      const response = await fetch("/api/storage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmPhrase }),
      });

      if (response.ok) {
        toast.success("All user data has been deleted successfully.");
        setShowCleanModal(false);
        setConfirmPhrase("");
        fetchDashboardData();
        fetchStorageData();
      } else {
        const result = await response.json();
        toast.error(result.error || "Failed to clean data");
      }
    } catch (error) {
      toast.error("Failed to clean data");
    } finally {
      setCleaning(false);
    }
  };

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

        {/* Storage Management Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <HardDrive size={20} />
              Storage Management
            </h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Storage Bar */}
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Storage Used</span>
                    <span>{storageData?.formatted.total || "50 GB"} Total</span>
                  </div>
                  <div className="h-6 bg-muted overflow-hidden flex">
                    {/* System portion (12GB) */}
                    <div
                      className="h-full bg-gray-400 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${((storageData?.system || 12 * 1024 * 1024 * 1024) / (storageData?.total || 50 * 1024 * 1024 * 1024)) * 100}%` }}
                    >
                      System
                    </div>
                    {/* Data portion */}
                    <div
                      className="h-full bg-primary flex items-center justify-center text-xs text-white font-medium"
                      style={{
                        width: `${((storageData?.data || 0) / (storageData?.total || 50 * 1024 * 1024 * 1024)) * 100}%`,
                        minWidth: storageData?.data ? "40px" : "0"
                      }}
                    >
                      {storageData?.data ? "Data" : ""}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex gap-6 mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-400"></div>
                      <span>System: {storageData?.formatted.system || "12 GB"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary"></div>
                      <span>Data: {storageData?.formatted.data || "0 B"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-muted border border-border"></div>
                      <span>Available: {storageData?.formatted.available || "38 GB"}</span>
                    </div>
                  </div>
                </div>

                {/* Clean Button */}
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={() => setShowCleanModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Clean All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Clean Confirmation Modal */}
      <Modal
        isOpen={showCleanModal}
        onClose={() => {
          setShowCleanModal(false);
          setConfirmPhrase("");
        }}
        title="⚠️ Delete All User Data"
      >
        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive">
            <p className="font-semibold">Warning: This action is irreversible!</p>
            <p className="text-sm mt-2">
              This will permanently delete all user data including:
            </p>
            <ul className="text-sm mt-2 ml-4 list-disc">
              <li>All projects, properties, and customers</li>
              <li>All rentals, receipts, and contracts</li>
              <li>All documents and uploaded files</li>
              <li>All transactions</li>
            </ul>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              To confirm, type <strong>DELETE ALL DATA</strong> below:
            </p>
            <Input
              value={confirmPhrase}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              placeholder="Type DELETE ALL DATA to confirm"
              className="font-mono"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowCleanModal(false);
                setConfirmPhrase("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCleanData}
              disabled={confirmPhrase !== "DELETE ALL DATA" || cleaning}
            >
              {cleaning ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
