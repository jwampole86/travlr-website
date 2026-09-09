import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Trash2,
  LogOut,
  ShieldAlert,
  User as UserIcon,
  ChevronLeft,
} from "lucide-react";

export default function Settings() {
  const { user, isAuthenticated, isLoadingAuth, logout, navigateToLogin } = useAuth();
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requested, setRequested] = useState(false);

  const deleteAccount = async () => {
    setSubmitting(true);
    try {
      await base44.entities.User.delete(user.id);
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
      setConfirming(false);
      setRequested(true);
      // Erase local authentication profile state, then return home.
      logout(false);
      setTimeout(() => {
        window.location.href = "/";
      }, 600);
    } catch (e) {
      toast({
        title: "Could not delete account",
        description: e?.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="px-4 pt-6 sa-top">
          <Link
            to="/"
            className="inline-flex items-center text-xs tracking-wider text-gray-600 hover:text-[#b89968]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> BACK
          </Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <UserIcon className="w-12 h-12 text-gray-300 mb-4" />
          <h1 className="text-xl tracking-[0.15em] font-light text-gray-700 mb-2">
            SIGN IN REQUIRED
          </h1>
          <p className="text-sm text-gray-500 mb-8 max-w-sm">
            Account settings and the account deletion option are available after you sign in.
          </p>
          <Button
            onClick={() => navigateToLogin()}
            className="bg-[#c4a574] hover:bg-[#b89968] text-white px-8 tracking-[0.15em] text-xs rounded-sm"
          >
            SIGN IN
          </Button>
          <Link
            to="/"
            className="mt-6 text-xs tracking-wider text-gray-400 hover:text-[#b89968]"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 pt-6 sa-top">
        <Link
          to="/"
          className="inline-flex items-center text-xs tracking-wider text-gray-600 hover:text-[#b89968]"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> BACK
        </Link>
      </div>

      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl tracking-[0.2em] font-light text-gray-700 mb-2">ACCOUNT</h1>
        <p className="text-sm text-gray-500 tracking-wide mb-10">Manage your TRAVLR account.</p>

        <div className="border border-gray-200 rounded-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-1">
            <UserIcon className="w-5 h-5 text-[#b89968]" />
            <span className="text-sm font-medium text-gray-800">
              {user?.full_name || user?.email}
            </span>
          </div>
          <p className="text-xs text-gray-500 tracking-wide pl-8">{user?.email}</p>
          {user?.role && (
            <p className="text-xs text-gray-400 tracking-wide pl-8 mt-1 uppercase">
              Role: {user.role}
            </p>
          )}
        </div>

        <div className="border border-gray-200 rounded-sm p-6 mb-6">
          <Button
            onClick={() => logout()}
            variant="outline"
            className="w-full tracking-[0.15em] text-xs rounded-sm"
          >
            <LogOut className="w-4 h-4 mr-2" /> LOG OUT
          </Button>
        </div>

        {/* iOS-compliant account deletion path */}
        <div className="border border-red-200 rounded-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h2 className="text-sm tracking-[0.15em] font-medium text-red-700">
              DELETE ACCOUNT
            </h2>
          </div>
          {requested ? (
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="mb-2">
                Your account and associated profile data have been permanently deleted.
              </p>
              <p>
                If you did not intend this, contact us at{" "}
                <a className="text-[#b89968]" href="tel:+19495398862">
                  (949) 539-8862
                </a>
                .
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Permanently delete your TRAVLR account and all associated personal data (profile,
                inquiries, and saved information). This action cannot be undone.
              </p>
              <Button
                onClick={() => setConfirming(true)}
                variant="outline"
                className="w-full text-red-700 border-red-300 hover:bg-red-50 tracking-[0.15em] text-xs rounded-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" /> DELETE ACCOUNT
              </Button>
            </>
          )}
        </div>
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => !submitting && setConfirming(false)}
        >
          <div
            className="bg-white rounded-sm max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-medium text-gray-800 mb-3">Delete your account?</h3>
            <p className="text-sm text-gray-600 mb-6">
              This will submit a request to permanently delete your account and data. This cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setConfirming(false)}
                variant="outline"
                className="flex-1 tracking-[0.15em] text-xs rounded-sm"
                disabled={submitting}
              >
                CANCEL
              </Button>
              <Button
                onClick={deleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white tracking-[0.15em] text-xs rounded-sm"
                disabled={submitting}
              >
                {submitting ? "SUBMITTING..." : "DELETE"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}