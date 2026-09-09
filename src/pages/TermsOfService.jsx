import React from "react";
import LegalLayout from "@/components/LegalLayout";
import { TermsContent } from "@/components/legal/LegalContent";

export default function TermsOfService() {
  return (
    <LegalLayout
      title="TERMS OF SERVICE"
      heroImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80"
      lastUpdated="Last updated: August 25, 2026"
    >
      <TermsContent />
    </LegalLayout>
  );
}