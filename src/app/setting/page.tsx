"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PageContainer from "@/app/components/container/PageContainer";
// components
import YearlyBreakup from "@/app/components/dashboards/modern/YearlyBreakup";
import MonthlyEarnings from "@/app/components/dashboards/modern/MonthlyEarnings";
import TopCards from "@/app/components/dashboards/modern/TopCards";
import RevenueUpdates from "@/app/components/dashboards/modern/RevenueUpdates";
import EmployeeSalary from "@/app/components/dashboards/modern/EmployeeSalary";
import Customers from "@/app/components/dashboards/modern/Customers";
import Projects from "@/app/components/dashboards/modern/Projects";
import Social from "@/app/components/dashboards/modern/Social";
import SellingProducts from "@/app/components/dashboards/modern/SellingProducts";
import WeeklyStats from "@/app/components/dashboards/modern/WeeklyStats";
import TopPerformers from "@/app/components/dashboards/modern/TopPerformers";
import Welcome from "@/app/dashboard/(Layout)/layout/shared/welcome/Welcome";
import { CustomizerContext } from "@/app/context/setting/customizerContext";

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const { loading } = useContext(CustomizerContext);
  const router = useRouter();

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useEffect(() => {
    router.replace("/setting/account/profile");
  }, []);

  return null
}
