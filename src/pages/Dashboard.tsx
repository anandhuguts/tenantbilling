import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reportsAPI, activityAPI, paymentsAPI } from "@/services/api";
import {
  Building2,
  Users,
  DollarSign,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    activeUsers: 0,
    totalRevenue: 0,
    expiringPlans: 0,
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [tenantGrowth, setTenantGrowth] = useState<any[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([]);
  const [planDistribution, setPlanDistribution] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // ONE API CALL instead of 5+
      const dashboardData = await reportsAPI.getDashboardStats();

      console.log("Dashboard data:", dashboardData);

      // Set all state from single response
      setStats(dashboardData.stats);
      setRevenueData(dashboardData.revenueData || []);
      setTenantGrowth(dashboardData.tenantGrowth || []);
      setCategoryDistribution(dashboardData.categoryDistribution || []);
      setPlanDistribution(dashboardData.planDistribution || []);

      // Fetch all payments and calculate total revenue
      try {
        const paymentsResponse = await paymentsAPI.getAllPayments();
        const payments = paymentsResponse?.payments || [];

        // Calculate total revenue from all payments
        const total = payments.reduce((sum: number, payment: any) => {
          return sum + (Number(payment.amount) || 0);
        }, 0);

        setTotalRevenue(total);
        console.log("Total revenue from payments:", total);

        // Calculate monthly revenue trend from payments
        const monthlyRevenue: Record<string, number> = {};

        payments.forEach((payment: any) => {
          if (payment.payment_date) {
            const date = new Date(payment.payment_date);
            const monthYear = date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });

            monthlyRevenue[monthYear] =
              (monthlyRevenue[monthYear] || 0) + (Number(payment.amount) || 0);
          }
        });

        // Convert to array and sort by date
        const revenueArray = Object.entries(monthlyRevenue)
          .map(([month, revenue]) => ({ month, revenue }))
          .sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA.getTime() - dateB.getTime();
          })
          .slice(-6); // Get last 6 months

        setRevenueData(
          revenueArray.length > 0
            ? revenueArray
            : dashboardData.revenueData || []
        );
        console.log("Monthly revenue trend:", revenueArray);
      } catch (paymentsError) {
        console.error("Failed to fetch payments:", paymentsError);
        setTotalRevenue(0);
        setRevenueData(dashboardData.revenueData || []);
      }

      // Activity is separate (optional)
      try {
        const activity = await activityAPI.getRecentActivity(8);
        setRecentActivity(activity);
      } catch (error) {
        console.log("Activity data not available");
        setRecentActivity([]);
      }
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  // For tenant table, we'll show growth data instead of full tenant list
  // Or you can add a separate /tenants endpoint call if needed
  const displayTenants = tenantGrowth.slice(-itemsPerPage);

  // derive trial plan value from planDistribution if present
  const trialPlan = planDistribution.find((p: any) => {
    const name = (p?.name || "").toString().toLowerCase();
    return (
      name.includes("trial") ||
      name.includes("trial tenants") ||
      name === "trial"
    );
  });
  const trialValue = trialPlan
    ? Number(trialPlan.value || 0)
    : stats.expiringPlans;

  // --- Compute total revenue in AED from planDistribution entries like 'basic-1000AED'
  const parsePlanPrice = (name: string) => {
    if (!name) return { price: 0, currency: undefined };
    const m = name.match(/-(\d[\d,\.]*)\s*([A-Za-z]{2,4})?$/i);
    if (m) {
      const raw = m[1].replace(/,/g, "");
      const price = Number(raw) || 0;
      const currency = m[2] ? m[2].toUpperCase() : undefined;
      return { price, currency };
    }
    return { price: 0, currency: undefined };
  };

  let totalRevenueAED = 0;
  if (Array.isArray(planDistribution) && planDistribution.length > 0) {
    // fallback price map when plan names don't include prices
    const priceMap: Record<string, number> = {
      trial: 0,
      "trial-0aed": 0,
      basic: 1000,
      "basic-1000aed": 1000,
      professional: 2500,
      proffection: 2500,
      "professional-2500aed": 2500,
      enterprise: 3500,
      enterprice: 3500,
      "enterprise-3500aed": 3500,
    };

    for (const p of planDistribution) {
      const count = Number(p?.value || 0);
      const rawName = (p?.name || "").toString().trim();
      // prefer explicit price field on the plan object
      let price = p && p.price !== undefined ? Number(p.price) || 0 : undefined;

      if (!price) {
        // try parsing price embedded in the name (e.g., basic-1000AED)
        const parsed = parsePlanPrice(rawName);
        price = parsed.price || 0;
      }

      if (!price) {
        // fallback: map known plan keys to prices (handle variations/typos)
        const key = rawName.toLowerCase().split(/[-\s_]/)[0];
        price = priceMap[key] ?? 0;
      }

      totalRevenueAED += count * (price || 0);
    }
  }

  const statCards = [
    {
      title: "Total Tenants",
      value: stats.totalTenants,
      icon: Building2,
      trend: "+12%",
      trendUp: true,
      color: "text-primary",
    },
    {
      title: "Active Tenants",
      value: stats.activeTenants,
      icon: Building2,
      trend: "+8%",
      trendUp: true,
      color: "text-success",
    },
    {
      title: "Total Revenue",
      value: totalRevenue, // Using actual revenue from payments table
      icon: DollarSign,
      trend: "+0%",
      trendUp: true,
      isCurrency: true,
      currency: "AED", // Display in AED
      color: "text-secondary",
    },
    {
      title: "Trial tenants",
      value: trialValue,
      icon: AlertCircle,
      trend: "-3%",
      trendUp: false,
      color: "text-warning",
    },
  ];

  const getActivityIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "upgrade":
        return <TrendingUp className={iconClass} />;
      case "create":
        return <Building2 className={iconClass} />;
      case "payment":
        return <DollarSign className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your tenants.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.isCurrency
                  ? new Intl.NumberFormat("en-AE", {
                      style: "currency",
                      currency: stat.currency || "AED",
                      maximumFractionDigits: 0,
                    }).format(Number(stat.value) || 0)
                  : stat.value}
              </div>
              <div className="flex items-center gap-1 text-xs mt-1">
                {stat.trendUp ? (
                  <ArrowUpRight className="h-3 w-3 text-success" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={stat.trendUp ? "text-success" : "text-destructive"}
                >
                  {stat.trend}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly revenue over the last 6 months
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" reversed />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tenant Growth */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tenant Growth</CardTitle>
            <p className="text-sm text-muted-foreground">
              New tenants per month
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tenantGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tenants"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="New Tenants"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Distribution Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest tenant actions
            </p>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="mt-1 p-2 rounded-lg bg-muted">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.user}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action}{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tenant distribution by type
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryDistribution.map((cat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground">{cat.value}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${(
                          (cat.value / stats.totalTenants) *
                          100
                        ).toFixed(0)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {categoryDistribution.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No categories yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Plans</CardTitle>
            <p className="text-sm text-muted-foreground">
              Subscription breakdown
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {planDistribution.map((plan, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{plan.name}</span>
                    <span className="text-muted-foreground">{plan.value}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full transition-all"
                      style={{
                        width: `${(
                          (plan.value / stats.totalTenants) *
                          100
                        ).toFixed(0)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {planDistribution.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No plans yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quick Actions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your platform
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/tenants")}>
              <Building2 className="mr-2 h-4 w-4" />
              View All Tenants
            </Button>
            <Button variant="outline" onClick={() => navigate("/reports")}>
              View Reports
            </Button>
            <Button variant="outline" onClick={() => navigate("/settings")}>
              Platform Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
