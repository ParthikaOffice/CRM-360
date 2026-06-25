"use client";

import { useCRM } from "@/context/CRMContext";
import DashboardView from "@/components/crm/DashboardView";

export default function DashboardPage() {
  const { leads, opportunities, pipelines, activities, toggleActivityDone, addToast } = useCRM();
  return (
    <DashboardView
      leads={leads}
      opportunities={opportunities}
      pipelines={pipelines}
      activities={activities}
      onToggleActivityDone={toggleActivityDone}
      addToast={addToast}
    />
  );
}
