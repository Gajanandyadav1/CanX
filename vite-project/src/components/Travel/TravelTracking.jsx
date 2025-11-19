import React, { useState } from "react"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Navigation, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TravelForm from "./TravelForm";
 
export default function TravelTracking() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: travelLogs = [] } = useQuery({
    queryKey: ['travelLogs'], 
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'], 
  });

  const { data: settings = [] } = useQuery({
    queryKey: ['settings'], 
  });

  const createMutation = useMutation({ 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelLogs'] });
      setShowAddDialog(false);
    },
  });

  const taPerKm = parseFloat(settings.find(s => s.setting_key === 'ta_per_km')?.setting_value || '8');
  
  const totalKM = travelLogs.reduce((sum, log) => sum + (log.total_km || 0), 0);
  const totalTA = travelLogs.reduce((sum, log) => sum + (log.ta_amount || 0), 0);
  const avgKmPerDay = travelLogs.length > 0 ? totalKM / travelLogs.length : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Travel Tracking</h2>
          <p className="text-gray-500 mt-1">Monitor employee travel and allowances</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-[#007BFF] hover:bg-[#0056b3] shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Travel Log
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Distance</p>
                <p className="text-3xl font-bold text-gray-900">{totalKM.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">kilometers</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Navigation className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total TA Earned</p>
                <p className="text-3xl font-bold text-[#00C896]">₹{totalTA.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">travel allowance</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-[#00C896]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg KM/Day</p>
                <p className="text-3xl font-bold text-[#007BFF]">{avgKmPerDay.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">average distance</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-[#007BFF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">TA Rate</p>
                <p className="text-3xl font-bold text-orange-600">₹{taPerKm}</p>
                <p className="text-xs text-gray-500 mt-1">per kilometer</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Travel Logs */}
      <Card className="shadow-lg border-none">
        <CardHeader className="border-b">
          <CardTitle>Travel Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {travelLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-blue-50 transition-colors duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{log.employee_name}</p>
                      <p className="text-sm text-gray-500">{format(new Date(log.date), 'dd MMM yyyy')}</p>
                      {log.purpose && (
                        <p className="text-xs text-gray-400 mt-1">{log.purpose}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:max-w-lg">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-600">Distance</p>
                      <p className="text-lg font-bold text-purple-600">{log.total_km} km</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-600">TA Earned</p>
                      <p className="text-lg font-bold text-[#00C896]">₹{log.ta_amount?.toFixed(2)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg col-span-2 md:col-span-1">
                      <p className="text-xs text-gray-600">Route</p>
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {log.start_location || 'Start'} → {log.end_location || 'End'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {travelLogs.length === 0 && (
              <div className="p-12 text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">No travel logs yet</p>
                <p className="text-gray-400 text-sm mt-2">Click "Add Travel Log" to start tracking</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#007BFF]">
              Add Travel Log
            </DialogTitle>
          </DialogHeader>
          <TravelForm
            employees={employees}
            taPerKm={taPerKm}
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setShowAddDialog(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}