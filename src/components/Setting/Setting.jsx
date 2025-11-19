/* eslint-disable no-unused-vars */
import React, { useState } from "react";
 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, DollarSign, Clock, Building2 } from "lucide-react";
 
export default function SettingsPage() {
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ['settings'],
   });

  const createMutation = useMutation({
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const updateMutation = useMutation({
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const getSetting = (key, defaultValue = '') => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || defaultValue;
  };

  const getSettingId = (key) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.id;
  };

  const [formData, setFormData] = useState({
    ta_per_km: '',
    office_hours: '',
    tax_rate: '',
    company_name: '',
  });

  React.useEffect(() => {
    if (settings.length > 0) {
      setFormData({
        ta_per_km: getSetting('ta_per_km', '8'),
        office_hours: getSetting('office_hours', '9'),
        tax_rate: getSetting('tax_rate', '0'),
        company_name: getSetting('company_name', 'Malhotra IT Innovations'),
      });
    }
  }, [settings]);

  const handleSave = async () => {
    const settingsToUpdate = [
      { key: 'ta_per_km', value: formData.ta_per_km, description: 'Travel Allowance per kilometer' },
      { key: 'office_hours', value: formData.office_hours, description: 'Standard office working hours' },
      { key: 'tax_rate', value: formData.tax_rate, description: 'Tax rate percentage' },
      { key: 'company_name', value: formData.company_name, description: 'Company name' },
    ];

    for (const setting of settingsToUpdate) {
      const existingId = getSettingId(setting.key);
      if (existingId) {
        await updateMutation.mutateAsync({
          id: existingId,
          data: {
            setting_key: setting.key,
            setting_value: setting.value,
            description: setting.description,
          }
        });
      } else {
        await createMutation.mutateAsync({
          setting_key: setting.key,
          setting_value: setting.value,
          description: setting.description,
        });
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-500 mt-1">Configure HRMS system parameters</p>
        </div>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Settings */}
        <Card className="shadow-lg border-none">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#007BFF]" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="Malhotra IT Innovations"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="office_hours">Standard Office Hours</Label>
              <Input
                id="office_hours"
                type="number"
                value={formData.office_hours}
                onChange={(e) => setFormData({ ...formData, office_hours: e.target.value })}
                placeholder="9"
              />
              <p className="text-xs text-gray-500">Hours per day</p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card className="shadow-lg border-none">
          <CardHeader className="border-b bg-gradient-to-r from-green-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#00C896]" />
              Financial Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ta_per_km">Travel Allowance Rate (₹/km)</Label>
              <Input
                id="ta_per_km"
                type="number"
                step="0.1"
                value={formData.ta_per_km}
                onChange={(e) => setFormData({ ...formData, ta_per_km: e.target.value })}
                placeholder="8"
              />
              <p className="text-xs text-gray-500">Amount paid per kilometer traveled</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                step="0.1"
                value={formData.tax_rate}
                onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                placeholder="0"
              />
              <p className="text-xs text-gray-500">Default tax deduction percentage</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Configuration */}
      <Card className="shadow-lg border-none">
        <CardHeader className="border-b">
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Company</p>
              <p className="font-bold text-lg text-[#007BFF] mt-1">{formData.company_name}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">TA Rate</p>
              <p className="font-bold text-lg text-[#00C896] mt-1">₹{formData.ta_per_km}/km</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Office Hours</p>
              <p className="font-bold text-lg text-purple-600 mt-1">{formData.office_hours} hrs/day</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Tax Rate</p>
              <p className="font-bold text-lg text-orange-600 mt-1">{formData.tax_rate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-[#007BFF] hover:bg-[#0056b3] shadow-lg px-8"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Info Box */}
      <Card className="shadow-lg border-none bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Settings className="w-8 h-8 text-[#007BFF] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About System Settings</h3>
              <p className="text-sm text-gray-600">
                These settings control the core parameters of the HRMS system. Changes here will affect
                payroll calculations, attendance tracking, and travel allowance computations. Please ensure
                all values are accurate before saving.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}