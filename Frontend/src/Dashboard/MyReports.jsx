"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // or use `next/router` if using Next.js

const fetchReports = async () => {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/urs-reports`, {
    withCredentials: true,
  });
  return res.data.data;
};

const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Pending
        </Badge>
      );
    case "resolved":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Resolved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          Unknown
        </Badge>
      );
  }
};

export default function MyReports() {
  const navigate = useNavigate(); // for routing to report submission
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-reports"],
    queryFn: fetchReports,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-red-600">
        Failed to load reports. Please try again later.
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">No reports yet</h2>
        <p className="text-gray-500">You haven’t submitted any reports.</p>
        <Button onClick={() => navigate("/submit-report")}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Submit New Report
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
        <p className="text-gray-600">View and manage your submitted reports.</p>
      </div>

      <div className="grid gap-4">
        {data.map((report) => (
          <Card key={report._id} className="rounded-2xl shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {report.description.length > 40
                      ? report.description.slice(0, 40) + "..."
                      : report.description}
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDistanceToNow(new Date(report.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {report.address}
                    </div>
                  </div>
                </div>
                <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 flex flex-col gap-2 items-start sm:items-end">
                  {getStatusBadge(report.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/view-report/${report._id}`) // Navigate to report details
                    }
                  >
                    See Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
