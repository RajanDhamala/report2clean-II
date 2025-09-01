"use client";

import { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader,
  DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose
} from "@/components/ui/drawer";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  BarChart3, Shield, Bell, FileText, Edit, Check, XCircle, Lock,
  Menu, TrendingUp, MapPin, Award,LogOut
} from "lucide-react";
import AuthenticateUser from "../Dashboard/AuthencateUser";
import NotificationSetting from "../Dashboard/NotificationSetting";
import MyReports from "../Dashboard/MyReports";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const queryClient = useQueryClient();
  const [contributionData,setContributionData]=useState(null)

  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
        withCredentials: true,
      });
      return res.data.data;
    },
  });

  const [usernameInput, setUsernameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/update-profile`, data, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries(["userProfile"]);
      setIsEditingProfile(false);
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const payload = {
      newname: usernameInput !== userProfile?.fullname ? usernameInput : "",
      newPhone: phoneInput !== userProfile?.phone_no ? phoneInput : "",
      newEmail: emailInput !== userProfile?.email ? emailInput : "",
    };
    if (!payload.newname && !payload.newPhone && !payload.newEmail) {
      toast("No changes to update");
      return;
    }
    updateProfileMutation.mutate(payload);
  };

  const passwordMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/change-pswd`, data, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password updated");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Password update failed"),
  });

    const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, {
        withCredentials: true,
      });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err.response?.data?.message || err.message);
    }
  };

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return toast.error("Fill all fields");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
    passwordMutation.mutate({ oldPasswd: oldPassword, newPasswd: newPassword });
  };

  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ["view-charts"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/report/view-charts`, {
        withCredentials: true,
      });

      setContributionData([
        { name: "Reports Submitted", value: res.data.data.lifetimeContributions.totalReports || 0, color: "#3b82f6" },
  { name: "Issues Resolved", value: res.data.data.lifetimeContributions.completedReports ||0, color: "#10b981" },
  { name: "Community Posts", value: 0, color: "#f59e0b" },
  { name: "Reviews Given", value: 0, color: "#ef4444" },
]);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const eventsInAreaData = chartData?.eventsInAreaData || [];
  const activityData = chartData?.weeklyActivityData || [];
  const trendData = chartData?.monthlyTrendData || [];

 
  if (isLoading) return <div className="p-8 text-gray-500">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load profile.</div>;

  const renderChartOrSkeleton = (data, chart) => {
    if (isChartLoading || !data?.length) {
      return <Skeleton className="w-full h-[250px] rounded-md" />;
    }
    return chart;
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "verification", label: "Account Verification", icon: Shield },
    { id: "notifications", label: "Notification Settings", icon: Bell },
    { id: "reports", label: "My Reports", icon: FileText },
  ];


  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome back, {userProfile.fullname || "User"}!</p>
              <div className=" w-full flex md:justify-end">
          <button onClick={handleLogout}
          className="mt-6 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold transition duration-200"
        >
          <LogOut /> Logout
        </button>
              </div>
            </div>

            <Card className="rounded-2xl shadow-md bg-white">
              <CardHeader className="p-6">
                <CardTitle className="text-xl font-semibold">Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={userProfile.avatar || "https://randomuser.me/api/portraits/lego/3.jpg"} />
                    <AvatarFallback>{userProfile.fullname?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-medium">{userProfile.fullname}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{userProfile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{userProfile.phone_no || "Not provided"}</p>
                      </div>
                     <div>
            <p className="text-sm text-gray-500">Account Status</p>
          {userProfile.isAuthencated ? (
        <Badge className="bg-green-100 text-green-800 border-green-200">
         <Check className="w-3 h-3 mr-1" /> Verified
        </Badge>
        ) : (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <XCircle className="w-3 h-3 mr-1" /> Not Verified
         </Badge>
       ) }
        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Dialog open={isEditingProfile} onOpenChange={(open) => {
                        setIsEditingProfile(open);
                        if (open) {
                          setUsernameInput(userProfile.fullname || "");
                          setPhoneInput(userProfile.phone_no || "");
                          setEmailInput(userProfile.email || "");
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Edit className="w-4 h-4 mr-2" /> Edit Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>Update your name, phone, or email.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                value={phoneInput}
                                onChange={(e) => setPhoneInput(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                              />
                            </div>
                            <DialogFooter className="mt-6">
                              <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button variant="outline">
                            <Lock className="w-4 h-4 mr-2" /> Change Password
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Change Password</DrawerTitle>
                            <DrawerDescription>Enter your current and new password.</DrawerDescription>
                          </DrawerHeader>
                          <div className="p-4 space-y-4">
                            <div>
                              <Label htmlFor="current-password">Current Password</Label>
                              <Input
                                id="current-password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-password">New Password</Label>
                              <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="confirm-password">Confirm Password</Label>
                              <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                            </div>
                          </div>
                          <DrawerFooter>
                            <Button onClick={handlePasswordChange}>Update Password</Button>
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Events in Area Chart */}
              <Card className="rounded-2xl shadow-md bg-white">
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Reports in Your Area
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={eventsInAreaData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="events" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Weekly Activity Chart */}
              <Card className="rounded-2xl shadow-md bg-white">
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Weekly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="activity" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trends Graph */}
              <Card className="rounded-2xl shadow-md bg-white">
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Reports & Resolution Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="reports" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="resolved" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Your Contributions */}
              
<Card className="rounded-2xl shadow-md bg-white">
  <CardHeader className="p-6">
    <CardTitle className="text-lg font-semibold flex items-center gap-2">
      <Award className="w-5 h-5 text-amber-600" />
      Your Contributions
    </CardTitle>
  </CardHeader>
  <CardContent className="p-6 pt-0">
    {contributionData && contributionData.length > 0 ? (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={contributionData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {contributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading chart...
      </div>
    )}
  </CardContent>
</Card>
            </div>

            {/* Stats Cards */}
         
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <Card className="rounded-xl shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-600 font-medium">Total Reports</p>
          <p className="text-2xl font-bold text-blue-900">
            {chartData?.localEvents2km?.totalReports ?? 0}
          </p>
        </div>
        <FileText className="w-8 h-8 text-blue-600" />
      </div>
    </CardContent>
  </Card>

  <Card className="rounded-xl shadow-sm bg-gradient-to-br from-green-50 to-green-100 border-green-200">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-600 font-medium">Resolved</p>
          <p className="text-2xl font-bold text-green-900">
            {chartData?.localEvents2km?.completedReports ?? 0}
          </p>
        </div>
        <Check className="w-8 h-8 text-green-600" />
      </div>
    </CardContent>
  </Card>

  <Card className="rounded-xl shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-purple-600 font-medium">This Month</p>
          <p className="text-2xl font-bold text-purple-900">
            {chartData?.localEvents2km?.thisMonthReports ?? 0}
          </p>
        </div>
        <TrendingUp className="w-8 h-8 text-purple-600" />
      </div>
    </CardContent>
  </Card>

  <Card className="rounded-xl shadow-sm bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-amber-600 font-medium">Community Score</p>
          <p className="text-2xl font-bold text-amber-900">
            {chartData?.communityScore ?? 0}
          </p>
        </div>
        <Award className="w-8 h-8 text-amber-600" />
      </div>
    </CardContent>
  </Card>
</div>
          </div>
        );
      case "verification":
        return <AuthenticateUser isVerified={userProfile.isAuthencated} setActiveTab={setActiveTab} />;
      case "notifications":
        return <NotificationSetting />;
      case "reports":
        return <MyReports />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col sm:flex-row">
      <div
        className={`fixed sm:static inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200 z-50
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-500">User Panel</p>
          </div>
          <Button variant="ghost" className="sm:hidden" onClick={() => setIsSidebarOpen(false)}>
            <XCircle className="w-6 h-6" />
          </Button>
        </div>
        <nav className="px-4 pb-4 ">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex-1 p-4 sm:p-8">
        <Button variant="outline" className="sm:hidden mb-4" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6 mr-2" />
          Menu
        </Button>
        {renderContent()}
      </div>
    </div>
  );
}
