import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const travlrLogo = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f9945aff077ee02e61835e/98433c0c0_35C7376B-41E8-4994-AE14-22D49B92A14A-1-384x384-0.png";

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4">
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to App
      </Link>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img
            src={travlrLogo}
            alt="TRAVLR Vacation Homes"
            className="mx-auto mb-5 h-28 w-28 object-contain sm:h-36 sm:w-36"
          />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}