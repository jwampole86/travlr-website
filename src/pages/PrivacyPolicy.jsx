import React from "react";
import LegalLayout from "@/components/LegalLayout";
import { PrivacyContent } from "@/components/legal/LegalContent";

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="PRIVACY POLICY"
      heroImage="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80"
      lastUpdated="Last updated: August 25, 2026"
    >
      <PrivacyContent />
    </LegalLayout>
  );
}