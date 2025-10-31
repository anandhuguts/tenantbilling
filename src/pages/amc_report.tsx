import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import tenantsData from "@/data/tenants.json";
import { paymentsAPI, tenantAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Calendar, Users } from "lucide-react";

const priceMap: Record<string, number> = {
  trial: 0,
  basic: 1000,
  professional: 2500,
  proffection: 2500,
  enterprise: 3500,
  enterprice: 3500,
};

const parsePlanPrice = (name: string) => {
  if (!name) return { price: 0, currency: "AED" };
  const m = name.match(/-(\d[\d,\.]*)\s*([A-Za-z]{2,4})?$/i);
  if (m) {
    const raw = m[1].replace(/,/g, "");
    const price = Number(raw) || 0;
    return { price, currency: (m[2] || "AED").toUpperCase() };
  }
  const key = name.toLowerCase().split(/[-_\s]/)[0];
  return { price: priceMap[key] ?? 0, currency: "AED" };
};

const AMC_report: React.FC = () => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const [payments, setPayments] = useState<any[] | null>(null);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const { toast } = useToast();
  const [creatingPlan, setCreatingPlan] = useState<string | null>(null);

  // Load tenants from backend on mount
  useEffect(() => {
    const loadTenants = async () => {
      console.log("Loading tenants...");
      setLoading(true);
      try {
        const data = await tenantAPI.getTenants();
        console.log("Tenants loaded from API:", data);

        // Handle different response formats
        const tenantsList = Array.isArray(data) ? data : data?.tenants || [];
        setTenants(tenantsList);

        if (tenantsList.length > 0) {
          setSelected(tenantsList[0]);
          console.log("Selected first tenant:", tenantsList[0]);
        }
      } catch (error) {
        console.error(
          "Failed to load tenants from API, using fallback:",
          error
        );
        // Fallback to local data on error
        setTenants(tenantsData);
        if (tenantsData.length > 0) {
          setSelected(tenantsData[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    loadTenants();
  }, []);

  // Load payments when selected tenant changes
  useEffect(() => {
    const loadPayments = async () => {
      if (!selected?.id) {
        setPayments(null);
        return;
      }
      setPaymentsLoading(true);
      setPaymentsError(null);
      try {
        const res = await paymentsAPI.getPaymentsByTenant(String(selected.id));
        const list = res?.payments ?? res ?? [];
        setPayments(Array.isArray(list) ? list : []);
      } catch (err: any) {
        // Don't log error if it's just that the endpoint doesn't exist yet
        const errorMsg = err?.message || String(err);
        console.warn(
          "Payments not loaded (endpoint may not be available):",
          errorMsg
        );
        setPaymentsError(errorMsg);
        setPayments([]);
      } finally {
        setPaymentsLoading(false);
      }
    };

    loadPayments();
  }, [selected]);

  const totalByPlan = tenants.reduce((acc: Record<string, number>, t: any) => {
    const key = (t.plan || "unknown").toString();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AMC Report</h1>
        <p className="text-muted-foreground mt-1">
          View tenant plans and details
        </p>
      </div>

      {/* Debug info - remove after fixing */}
      {loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          Loading tenants from backend...
        </div>
      )}

      {!loading && tenants.length === 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          No tenants found. Check console for errors.
        </div>
      )}

      {!loading && tenants.length > 0 && (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Select Tenant</CardTitle>
                <CardDescription>
                  Choose a tenant to view subscription details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select
                      value={selected?.id?.toString() || ""}
                      onValueChange={(value) => {
                        const tenant = tenants.find(
                          (t: any) => t.id.toString() === value
                        );
                        if (tenant) setSelected(tenant);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tenants.map((tenant: any) => (
                          <SelectItem
                            key={tenant.id}
                            value={tenant.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{tenant.name}</span>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-sm text-muted-foreground">
                                {tenant.category}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <Badge variant="outline" className="mt-1">
                        {selected?.category}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Plan</p>
                      <Badge variant="outline" className="mt-1">
                        {selected?.plan}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.keys(totalByPlan).map((plan) => (
                    <div
                      key={plan}
                      className="flex items-center justify-between"
                    >
                      <div className="font-medium capitalize">{plan}</div>
                      <div className="text-muted-foreground">
                        {totalByPlan[plan]}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Tenant Information */}
          {selected && (
            <Card>
              <CardHeader>
                <CardTitle>Tenant Details</CardTitle>
                <CardDescription>
                  Complete information for {selected.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Tenant ID
                      </p>
                      <p className="text-base font-semibold">{selected.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Tenant Name
                      </p>
                      <p className="text-base font-semibold">{selected.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Category
                      </p>
                      <Badge variant="secondary" className="text-sm">
                        {selected.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Subscription Information */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Current Plan
                      </p>
                      <Badge className="text-sm">{selected.plan}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Status
                      </p>
                      <Badge
                        variant={
                          selected.status === "active" ? "default" : "secondary"
                        }
                        className="text-sm"
                      >
                        {selected.status || "Active"}
                      </Badge>
                    </div>
                    {selected.created_at && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Created Date
                        </p>
                        <p className="text-base">
                          {new Date(selected.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Modules Information */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Active Modules
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selected.modules ? (
                          Array.isArray(selected.modules) ? (
                            selected.modules.length > 0 ? (
                              selected.modules.map((mod: string) => (
                                <Badge
                                  key={mod}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {mod}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No modules
                              </p>
                            )
                          ) : typeof selected.modules === "object" ? (
                            Object.keys(selected.modules)
                              .filter((key) => selected.modules[key] === true)
                              .map((mod) => (
                                <Badge
                                  key={mod}
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {mod}
                                </Badge>
                              ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No modules
                            </p>
                          )
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No modules
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-6 pt-6 border-t">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {selected.contact && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Contact
                        </p>
                        <p className="text-sm">{selected.contact}</p>
                      </div>
                    )}
                    {selected.email && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Email
                        </p>
                        <p className="text-sm">{selected.email}</p>
                      </div>
                    )}
                    {selected.phone && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Phone
                        </p>
                        <p className="text-sm">{selected.phone}</p>
                      </div>
                    )}
                    {selected.address && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Address
                        </p>
                        <p className="text-sm">{selected.address}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment History */}
                {payments && payments.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <h4 className="text-sm font-semibold">Recent Payments</h4>
                    </div>
                    <div className="space-y-2">
                      {payments.slice(0, 5).map((payment: any) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium capitalize">
                              {payment.plan} Plan
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                payment.payment_date
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {new Intl.NumberFormat("en-AE", {
                                style: "currency",
                                currency: "AED",
                                maximumFractionDigits: 0,
                              }).format(Number(payment.amount))}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {paymentsLoading && (
                  <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
                    Loading payment history...
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Active and Expired Subscriptions */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Active Subscriptions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-600 dark:text-green-400">
                      Active 
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Currently active tenant
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-600">
                    {
                      tenants.filter((t: any) => {
                        const status = t.status?.toLowerCase();
                        return status === "active" || !status;
                      }).length
                    }
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {tenants
                    .filter((t: any) => {
                      const status = t.status?.toLowerCase();
                      return status === "active" || !status;
                    })
                    .map((tenant: any) => (
                      <div
                        key={tenant.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{tenant.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {tenant.category}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Plan:{" "}
                                <span className="font-medium text-foreground capitalize">
                                  {tenant.plan}
                                </span>
                              </p>
                              {tenant.created_at && (
                                <p className="text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  Started:{" "}
                                  {new Date(
                                    tenant.created_at
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              )}
                              {tenant.email && (
                                <p className="text-xs text-muted-foreground">
                                  Email: {tenant.email}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge className="bg-green-600">Active</Badge>
                        </div>
                      </div>
                    ))}
                  {tenants.filter((t: any) => {
                    const status = t.status?.toLowerCase();
                    return status === "active" || !status;
                  }).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No active subscriptions found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Expired Subscriptions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-red-600 dark:text-red-400">
                      Expired Subscriptions
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Inactive or expired tenant subscriptions
                    </CardDescription>
                  </div>
                  <Badge variant="destructive">
                    {
                      tenants.filter((t: any) => {
                        const status = t.status?.toLowerCase();
                        return (
                          status === "inactive" ||
                          status === "expired" ||
                          status === "suspended"
                        );
                      }).length
                    }
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {tenants
                    .filter((t: any) => {
                      const status = t.status?.toLowerCase();
                      return (
                        status === "inactive" ||
                        status === "expired" ||
                        status === "suspended"
                      );
                    })
                    .map((tenant: any) => (
                      <div
                        key={tenant.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors opacity-75"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{tenant.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {tenant.category}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Plan:{" "}
                                <span className="font-medium text-foreground capitalize">
                                  {tenant.plan}
                                </span>
                              </p>
                              {tenant.created_at && (
                                <p className="text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  Started:{" "}
                                  {new Date(
                                    tenant.created_at
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              )}
                              {tenant.expired_at && (
                                <p className="text-xs text-red-600">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  Expired:{" "}
                                  {new Date(
                                    tenant.expired_at
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              )}
                              {tenant.email && (
                                <p className="text-xs text-muted-foreground">
                                  Email: {tenant.email}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant="destructive" className="capitalize">
                            {tenant.status || "Expired"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  {tenants.filter((t: any) => {
                    const status = t.status?.toLowerCase();
                    return (
                      status === "inactive" ||
                      status === "expired" ||
                      status === "suspended"
                    );
                  }).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No expired subscriptions found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AMC_report;
