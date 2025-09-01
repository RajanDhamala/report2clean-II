"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Bell, MapPin, AlertTriangle, Mail, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const fetchNotificationConfig = async () => {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/noti-config`,{withCredentials: true});
  return res.data.data;
};

const updateNotificationConfig = async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/edit-config`, data,{withCredentials: true});
  return res.data.data;
};

export default function NotificationSetting() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notification-config"],
    queryFn: fetchNotificationConfig,
  });

  const [localState, setLocalState] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (data) {
      setLocalState(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateNotificationConfig,
    onSuccess: () => {
      toast.success("Notification preferences saved");
      queryClient.invalidateQueries(["notification-config"]);
      setDirty(false);
    },
    onError: () => {
      toast.error("Failed to save preferences");
    },
  });

  const handleToggle = (key) => {
    const updated = { ...localState, [key]: !localState[key] };
    setLocalState(updated);
    setDirty(true);
  };

  const handleSave = () => {
    if (localState) {
      mutation.mutate(localState);
    }
  };

  const settings = [
    {
      key: "nearbyAlerts",
      label: "Nearby Alerts",
      description: "Notify me when reports are posted nearby",
      icon: <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />,
    },
    {
      key: "emergencyNoti",
      label: "Emergency Notifications",
      description: "Get alerts for emergency updates in your area",
      icon: <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />,
    },
    {
      key: "emailNotification",
      label: "Email Notifications",
      description: "Receive updates via email",
      icon: <Mail className="w-5 h-5 text-green-500 mt-0.5" />,
    },
    {
      key: "pushNotifications",
      label: "Push Notifications",
      description: "Receive instant push alerts",
      icon: <Bell className="w-5 h-5 text-purple-500 mt-0.5" />,
    },
  ];

  if (isLoading || !localState) return <p className="p-6">Loading...</p>;

  return (
    <div className="space-y-6 w-full p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
        <p className="text-gray-600">Configure how you receive notifications and alerts.</p>
      </div>

      <Card className="rounded-2xl shadow-md bg-white w-full">
        <CardHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            {dirty && (
              <Button onClick={handleSave} disabled={mutation.isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          {settings.map(({ key, label, description, icon }) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 border rounded-lg transition-all hover:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                {icon}
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </div>
              <Switch
                checked={localState[key]}
                onCheckedChange={() => handleToggle(key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
