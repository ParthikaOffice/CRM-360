"use client";

import { useCRM } from "@/context/CRMContext";
import EmailsView from "@/components/crm/EmailsView";

export default function EmailsPage() {
  const crm = useCRM();
  return (
    <EmailsView
      emails={crm.emails}
      user={crm.user}
      searchQuery={crm.searchQuery}
      onSendReply={crm.handleSendEmail}
      applyFilters={crm.applyFilters}
    />
  );
}
