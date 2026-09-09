import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, MapPin, Briefcase, Phone, Mail, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getCareer, DEFAULT_ABOUT, SHARED_BENEFITS } from "@/data/careersData";

function List({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-gray-600 dark:text-slate-300 leading-relaxed">
          <span className="text-[#b89968] flex-shrink-0 mt-1">•</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xs tracking-[0.2em] uppercase text-[#b89968] font-medium mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function CareerDetail() {
  const { slug } = useParams();
  const role = getCareer(slug);

  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!role) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 dark:text-slate-100 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl tracking-[0.15em] text-gray-700 mb-4">ROLE NOT FOUND</h1>
        <p className="text-gray-500 mb-6">The role you're looking for is no longer available.</p>
        <Link to="/careers">
          <Button className="bg-[#b89968] hover:bg-[#a68858] text-white px-6 py-3 text-[11px] tracking-[0.15em] rounded-sm">
            BACK TO ALL ROLES
          </Button>
        </Link>
      </div>
    );
  }

  const paragraphs = (role.aboutRole || "").split("\n\n").filter(Boolean);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.note.trim()) {
      setError("Please provide your name, email, and a short note.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      let resumeUrl = "";
      if (resume) {
        const up = await base44.integrations.Core.UploadFile({ file: resume });
        resumeUrl = up.file_url;
      }

      // Persist the application so it appears in the admin dashboard.
      await base44.entities.JobApplication.create({
        applicant_name: form.name,
        email: form.email,
        phone: form.phone,
        role_title: role.title,
        role_slug: role.slug,
        note: form.note,
        resume_url: resumeUrl,
      });

      // Automatic alert to the team via a backend function.
      try {
        await base44.functions.invoke("notifyNewApplication", {
          applicant_name: form.name,
          email: form.email,
          phone: form.phone,
          role_title: role.title,
          note: form.note,
          resume_url: resumeUrl,
        });
      } catch {
        /* alert email is best-effort; the application is already saved */
      }
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong sending your application. Please try again or email info@staytrvlr.com.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] dark:bg-slate-950 dark:border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link
            to="/careers"
            className="inline-flex items-center text-[11px] tracking-[0.15em] text-gray-600 hover:text-[#c4a574] transition-colors dark:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ALL ROLES
          </Link>
          <h1 className="text-[11px] tracking-[0.3em] text-gray-700 dark:text-slate-200">CAREERS</h1>
          <span className="w-12" />
        </div>
      </div>

      {/* Title block */}
      <div className="bg-[#f8f6f3] dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-[900px] mx-auto px-6 py-10 md:py-14">
          {role.priority && (
            <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-[#b89968] font-medium mb-3">
              {role.priority}
            </span>
          )}
          <h2 className="text-2xl md:text-[32px] tracking-[0.1em] font-light text-gray-800 dark:text-slate-100 mb-4">
            {role.title}
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-slate-300">
            {role.location && (
              <span className="inline-flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 text-[#b89968]" /> {role.location}
              </span>
            )}
            {role.type && (
              <span className="inline-flex items-center">
                <Briefcase className="w-4 h-4 mr-1.5 text-[#b89968]" /> {role.type}
              </span>
            )}
            {role.reportsTo && (
              <span className="inline-flex items-center">
                Reports to: {role.reportsTo}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-3 tracking-wide">{role.shortComp}</p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[900px] mx-auto px-6 py-12 md:py-16">
        {role.fullDetail ? (
          <>
            <Section title="About TRAVLR">
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                {role.aboutCompany || DEFAULT_ABOUT}
              </p>
            </Section>

            <Section title="About the Role">
              <div className="space-y-4">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-gray-600 dark:text-slate-300 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </Section>

            <Section title="What You'll Do">
              {role.responsibilityGroups ? (
                <div className="space-y-6">
                  {role.responsibilityGroups.map((g, i) => (
                    <div key={i}>
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">{g.title}</p>
                      <List items={g.items} />
                    </div>
                  ))}
                </div>
              ) : (
                <List items={role.responsibilities} />
              )}
            </Section>

            <Section title="What We're Looking For">
              <List items={role.requirements} />
            </Section>

            <Section title="Compensation">
              <List items={role.compensation} />
            </Section>

            {role.benefits && role.benefits.length > 0 && (
              <Section title="What TRAVLR Offers">
                <List items={role.benefits} />
              </Section>
            )}
          </>
        ) : (
          <Section title="About the Role">
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed">{role.aboutRole}</p>
          </Section>
        )}

        {/* TRAVLR Benefits (all roles) */}
        <Section title="Benefits">
          <List items={SHARED_BENEFITS} />
        </Section>

        {/* How to Apply */}
        <section className="mt-12 bg-[#f8f6f3] dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-sm p-6 md:p-8">
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#b89968] font-medium mb-3">How to Apply</h2>
          <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-6">{role.applyNote}</p>

          {submitted ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#b89968]/10 mb-4">
                <Check className="w-6 h-6 text-[#b89968]" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-slate-100 mb-2">Application sent</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Thank you for your interest in joining TRAVLR. Our team will review your application and reach out if there's a fit.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(optional)"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="resume">Resume (PDF / DOC)</Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="note">Short note *</Label>
                <Textarea
                  id="note"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Tell us briefly about your background and why you're a fit for this role."
                  rows={5}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#b89968] hover:bg-[#a68858] text-white px-8 py-3 text-[11px] tracking-[0.15em] font-medium rounded-sm"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "SENDING…" : "SUBMIT APPLICATION"}
              </Button>
            </form>
          )}
        </section>

        {/* Contact footer */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-slate-800 text-center">
          <p className="text-sm text-gray-600 dark:text-slate-300 mb-3">Prefer to reach us directly?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-700 dark:text-slate-200">
            <a href="tel:+19495398862" className="inline-flex items-center hover:text-[#b89968] transition-colors">
              <Phone className="w-4 h-4 mr-2 text-[#b89968]" /> (949) 539-8862
            </a>
            <a href="mailto:info@staytrvlr.com" className="inline-flex items-center hover:text-[#b89968] transition-colors">
              <Mail className="w-4 h-4 mr-2 text-[#b89968]" /> info@staytrvlr.com
            </a>
            <Link to={createPageUrl("Home")} className="inline-flex items-center hover:text-[#b89968] transition-colors">
              staytrvlr.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}