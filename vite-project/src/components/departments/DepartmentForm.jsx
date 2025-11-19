/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast,  } from "react-hot-toast";
import { Base_Url } from "@/config";

export default function DepartmentForm({ employee, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: employee?.full_name || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${Base_Url}api/v1/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.full_name,
        }),
      });

      const result = await res.json();

      if (result.success === true) {
       alert("Department Added Successfully!");
      } else {
       alert(result.error.explanation);
      }
    } catch (error) {
      toast.error("Server Error!");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

        <div className="space-y-4">
          <Label>Full Name *</Label>
          <Input
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>

        <Button
          type="submit"
          className="bg-[#007BFF] hover:bg-[#0056b3]"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Add Departments
        </Button>
      </div>
    </form>
  );
}
