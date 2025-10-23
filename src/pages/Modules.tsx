import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { tenantAPI, moduleAPI } from '@/services/api';
import { 
  Building2, 
  Save,
  CheckCircle2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Modules = () => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [availableModules, setAvailableModules] = useState<string[]>([]);
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTenants();
  }, []);

  useEffect(() => {
    if (selectedTenant) {
      loadModules();
    }
  }, [selectedTenant]);

  const loadTenants = async () => {
    // TODO: Replace with actual API call
    const data = await tenantAPI.getTenants();
    setTenants(data);
    if (data.length > 0) {
      setSelectedTenant(data[0]);
    }
  };

  const loadModules = async () => {
    if (!selectedTenant) return;
    
    try {
      // TODO: Replace with actual API calls
      const available = await moduleAPI.getModulesByCategory(selectedTenant.category);
      const enabled = await moduleAPI.getTenantModules(selectedTenant.id);
      
      setAvailableModules(available);
      setEnabledModules(enabled);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const handleModuleToggle = (module: string, checked: boolean) => {
    if (checked) {
      setEnabledModules([...enabledModules, module]);
    } else {
      setEnabledModules(enabledModules.filter(m => m !== module));
    }
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      // TODO: Replace with actual PUT /tenants/:id/modules API call
      await moduleAPI.updateTenantModules(selectedTenant.id, enabledModules);
      
      toast({
        title: 'Modules updated',
        description: 'Module configuration has been saved successfully.',
      });
      
      setHasChanges(false);
      
      // Update tenant in list
      const updatedTenants = tenants.map(t => 
        t.id === selectedTenant.id ? { ...t, modules: enabledModules } : t
      );
      setTenants(updatedTenants);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save module configuration. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getModuleDescription = (module: string) => {
    const descriptions: Record<string, string> = {
      'POS': 'Point of Sale system for billing and transactions',
      'Table Management': 'Manage tables, reservations, and seating',
      'KOT': 'Kitchen Order Ticket system for order management',
      'Kitchen Display': 'Real-time kitchen display system',
      'Reservations': 'Table reservation and booking management',
      'Inventory': 'Track stock levels and inventory',
      'Reports': 'Analytics and reporting dashboard',
      'Multi-branch': 'Support for multiple location management',
      'Barcode Scanning': 'Scan products using barcode reader',
      'Batch Tracking': 'Track product batches and expiry dates',
      'Supplier Management': 'Manage suppliers and purchase orders',
      'Purchase Orders': 'Create and track purchase orders',
      'Appointments': 'Schedule and manage appointments',
      'Staff Management': 'Manage staff schedules and permissions',
      'Service Packages': 'Create service bundles and packages',
      'Warranty Tracking': 'Track product warranties and claims'
    };
    return descriptions[module] || 'Module for enhanced functionality';
  };

  if (!selectedTenant) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tenants available</h3>
          <p className="text-muted-foreground">Add tenants first to configure modules</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Module Configuration</h1>
          <p className="text-muted-foreground mt-1">Enable or disable modules for each tenant</p>
        </div>
        
        {hasChanges && (
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>

      {/* Tenant Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Tenant</CardTitle>
          <CardDescription>Choose a tenant to configure their modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select
                value={selectedTenant?.id.toString()}
                onValueChange={(value) => {
                  const tenant = tenants.find(t => t.id === parseInt(value));
                  setSelectedTenant(tenant);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tenant.name}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-sm text-muted-foreground">{tenant.category}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge variant="outline" className="mt-1">{selectedTenant?.category}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <Badge variant="outline" className="mt-1">{selectedTenant?.plan}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableModules.map((module) => {
          const isEnabled = enabledModules.includes(module);
          
          return (
            <Card key={module} className={isEnabled ? 'border-primary' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{module}</CardTitle>
                      {isEnabled && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <CardDescription className="text-xs mt-1">
                      {getModuleDescription(module)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor={`module-${module}`} className="text-sm cursor-pointer">
                    {isEnabled ? 'Enabled' : 'Disabled'}
                  </Label>
                  <Switch
                    id={`module-${module}`}
                    checked={isEnabled}
                    onCheckedChange={(checked) => handleModuleToggle(module, checked)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Module Summary</CardTitle>
          <CardDescription>Current module configuration for {selectedTenant?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Total Available Modules</span>
              <Badge variant="outline">{availableModules.length}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <span className="text-sm font-medium">Enabled Modules</span>
              <Badge className="bg-primary text-primary-foreground">{enabledModules.length}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Disabled Modules</span>
              <Badge variant="outline">{availableModules.length - enabledModules.length}</Badge>
            </div>
          </div>

          {hasChanges && (
            <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning font-medium">You have unsaved changes</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Save Changes" to apply the new module configuration
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Modules;
