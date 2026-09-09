import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Phone,
  Mail,
  Search,
  MessageSquare,
  Trash2,
  FileText,
  Briefcase,
  Star,
  StickyNote,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CAREERS } from "@/data/careersData";

const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "reviewed", label: "Reviewed", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "interview", label: "Interview", color: "bg-violet-100 text-violet-700 border-violet-200" },
  { value: "hired", label: "Hired", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "rejected", label: "Rejected", color: "bg-gray-100 text-gray-500 border-gray-200" },
];
const STATUS_ORDER = { new: 0, reviewed: 1, interview: 2, hired: 3, rejected: 4 };

const StatusBadge = ({ status }) => {
  const opt = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-sm border text-xs font-medium tracking-wide ${opt.color}`}>
      {opt.label}
    </span>
  );
};

export default function AdminApplications() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [starredOnly, setStarredOnly] = useState(false);
  const [notesApp, setNotesApp] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => base44.entities.JobApplication.list("-created_date", 500),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await base44.entities.JobApplication.update(id, { status });
      if (status === 'interview' || status === 'hired') {
        try {
          await base44.functions.invoke('notifyApplicantStatus', { application_id: id, status });
        } catch (e) {
          /* status update succeeded; email notification is best-effort */
        }
      }
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries(["admin-applications"]);
      const previous = queryClient.getQueryData(["admin-applications"]);
      queryClient.setQueryData(["admin-applications"], (old) =>
        (old || []).map((a) => (a.id === id ? { ...a, status } : a))
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["admin-applications"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries(["admin-applications"]),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => base44.entities.JobApplication.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries(["admin-applications"]);
      const previous = queryClient.getQueryData(["admin-applications"]);
      queryClient.setQueryData(["admin-applications"], (old) => (old || []).filter((a) => a.id !== id));
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["admin-applications"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries(["admin-applications"]),
  });

  const starMutation = useMutation({
    mutationFn: async ({ id, starred }) => base44.entities.JobApplication.update(id, { starred }),
    onMutate: async ({ id, starred }) => {
      await queryClient.cancelQueries(["admin-applications"]);
      const previous = queryClient.getQueryData(["admin-applications"]);
      queryClient.setQueryData(["admin-applications"], (old) =>
        (old || []).map((a) => (a.id === id ? { ...a, starred } : a))
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["admin-applications"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries(["admin-applications"]),
  });

  const notesMutation = useMutation({
    mutationFn: async ({ id, private_notes }) =>
      base44.entities.JobApplication.update(id, { private_notes }),
    onMutate: async ({ id, private_notes }) => {
      await queryClient.cancelQueries(["admin-applications"]);
      const previous = queryClient.getQueryData(["admin-applications"]);
      queryClient.setQueryData(["admin-applications"], (old) =>
        (old || []).map((a) => (a.id === id ? { ...a, private_notes } : a))
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["admin-applications"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries(["admin-applications"]),
  });

  const openNotes = (a) => {
    setNotesApp(a);
    setNotesDraft(a.private_notes || "");
  };
  const saveNotes = () => {
    if (!notesApp) return;
    notesMutation.mutate({ id: notesApp.id, private_notes: notesDraft });
    setNotesApp(null);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps
      .filter((a) => {
        if (q) {
          const matches = [a.applicant_name, a.email, a.phone, a.role_title]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(q));
          if (!matches) return false;
        }
        if (roleFilter !== "all" && a.role_title !== roleFilter) return false;
        if (statusFilter !== "all" && (a.status || "new") !== statusFilter) return false;
        if (starredOnly && !a.starred) return false;
        return true;
      })
      .sort((a, b) => {
        const sa = a.starred ? 1 : 0;
        const sb = b.starred ? 1 : 0;
        if (sa !== sb) return sb - sa;
        const oa = STATUS_ORDER[a.status || "new"] ?? 0;
        const ob = STATUS_ORDER[b.status || "new"] ?? 0;
        if (oa !== ob) return oa - ob;
        return new Date(b.created_date) - new Date(a.created_date);
      });
  }, [apps, query, roleFilter, statusFilter, starredOnly]);

  const hasFilters = roleFilter !== "all" || statusFilter !== "all" || starredOnly || query.trim();
  const resetFilters = () => {
    setQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
    setStarredOnly(false);
  };

  const handleDelete = (a) => {
    if (window.confirm(`Delete ${a.applicant_name}'s application for ${a.role_title}?`)) {
      deleteMutation.mutate(a.id);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link
            to={createPageUrl("Home")}
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#b89968] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/leads"
              className="text-sm tracking-[0.15em] uppercase text-gray-400 hover:text-[#b89968] transition-colors"
            >
              Leads
            </Link>
            <h1 className="text-sm tracking-[0.2em] uppercase text-gray-500 font-medium">
              TRAVLR Admin
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-light tracking-wider text-gray-800 mb-1">
              Job Applications
            </h2>
            <p className="text-sm text-gray-500 tracking-wide">
              {filtered.length} application{filtered.length === 1 ? "" : "s"} • submitted through the
              careers section
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, role..."
              className="pl-9 w-full md:w-72"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 p-4 bg-[#f8f6f3] rounded-sm border border-gray-200">
          <span className="text-xs tracking-[0.15em] uppercase font-medium text-gray-500">Filter</span>
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-72 bg-white">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {CAREERS.map((r) => (
                  <SelectItem key={r.slug} value={r.title}>
                    {r.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant={starredOnly ? "default" : "outline"}
            onClick={() => setStarredOnly((v) => !v)}
            className={`h-9 px-3 text-xs tracking-wide ${
              starredOnly
                ? "bg-[#b89968] hover:bg-[#a68858] text-white border-[#b89968]"
                : "text-gray-600 hover:text-[#b89968] border-gray-200 bg-white"
            }`}
          >
            <Star className={`w-4 h-4 mr-1 ${starredOnly ? "fill-white" : ""}`} />
            Starred
          </Button>
          {hasFilters && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-gray-500 hover:text-gray-800 text-sm"
            >
              Clear filters
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No applications found.</p>
            <p className="text-sm text-gray-400">
              {hasFilters
                ? "Try adjusting your filters."
                : "Applications submitted via the careers pages will appear here."}
            </p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f6f3] text-gray-600">
                <tr className="text-left">
                  <th className="px-2 py-3 font-medium tracking-wide text-center">Top</th>
                  <th className="px-4 py-3 font-medium tracking-wide">Submitted</th>
                  <th className="px-4 py-3 font-medium tracking-wide">Applicant</th>
                  <th className="px-4 py-3 font-medium tracking-wide">Role</th>
                  <th className="px-4 py-3 font-medium tracking-wide">Note</th>
                  <th className="px-4 py-3 font-medium tracking-wide">Resume</th>
                  <th className="px-4 py-3 font-medium tracking-wide">Status</th>
                  <th className="px-4 py-3 font-medium tracking-wide text-right">Contact</th>
                  <th className="px-4 py-3 font-medium tracking-wide text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-[#f8f6f3]/50 transition-colors align-top">
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => starMutation.mutate({ id: a.id, starred: !a.starred })}
                        aria-label={a.starred ? "Unstar applicant" : "Star applicant"}
                        title={a.starred ? "Starred candidate" : "Star this candidate"}
                        className="p-1 rounded-sm transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            a.starred
                              ? "fill-[#b89968] text-[#b89968]"
                              : "text-gray-300 hover:text-[#b89968]"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {fmtDate(a.created_date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{a.applicant_name}</div>
                      <div className="text-xs text-gray-500">{a.email}</div>
                      {a.phone && <div className="text-xs text-gray-400">{a.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-[220px]">
                      <div className="truncate" title={a.role_title}>
                        {a.role_title}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <div className="line-clamp-3" title={a.note}>
                        {a.note}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {a.resume_url ? (
                        <Button
                          asChild
                          size="sm"
                          className="bg-[#b89968] hover:bg-[#a68858] text-white text-xs tracking-wide h-8"
                        >
                          <a href={a.resume_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4 mr-1" /> View Resume
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={a.status || "new"}
                        onValueChange={(value) =>
                          statusMutation.mutate({ id: a.id, status: value })
                        }
                      >
                        <SelectTrigger className="h-8 w-36 text-xs border-gray-200 bg-white">
                          <SelectValue>
                            <StatusBadge status={a.status || "new"} />
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {a.phone && (
                          <a
                            href={`sms:${a.phone}`}
                            aria-label={`Text ${a.applicant_name}`}
                            className="p-2 rounded-sm border border-gray-200 text-gray-600 hover:bg-[#b89968] hover:text-white hover:border-[#b89968] transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        )}
                        {a.phone && (
                          <a
                            href={`tel:${a.phone}`}
                            aria-label={`Call ${a.applicant_name}`}
                            className="p-2 rounded-sm border border-gray-200 text-gray-600 hover:bg-[#b89968] hover:text-white hover:border-[#b89968] transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        <a
                          href={`mailto:${a.email}`}
                          aria-label={`Email ${a.applicant_name}`}
                          className="p-2 rounded-sm border border-gray-200 text-gray-600 hover:bg-[#b89968] hover:text-white hover:border-[#b89968] transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openNotes(a)}
                          aria-label="Private notes"
                          title="Private notes"
                          className={`p-2 rounded-sm border transition-colors ${
                            a.private_notes
                              ? "border-[#b89968] text-[#b89968] hover:bg-[#b89968] hover:text-white"
                              : "border-gray-200 text-gray-500 hover:bg-[#b89968] hover:text-white hover:border-[#b89968]"
                          }`}
                        >
                          <StickyNote className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(a)}
                          aria-label="Delete application"
                          className="p-2 rounded-sm border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!notesApp} onOpenChange={(open) => !open && setNotesApp(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Private notes — {notesApp?.applicant_name}
              <span className="block text-xs font-normal text-gray-400 tracking-wide mt-1">
                {notesApp?.role_title}
              </span>
            </DialogTitle>
          </DialogHeader>
          <Textarea
            rows={8}
            placeholder="Jot down your thoughts, feedback, and interview impressions..."
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesApp(null)}>
              Cancel
            </Button>
            <Button
              onClick={saveNotes}
              className="bg-[#b89968] hover:bg-[#a68858] text-white"
            >
              Save notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}