import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Phone, Mail, Check } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = useMutation({
    mutationFn: async (data) => {
      // Deliver only to the fixed internal TRAVLR inbox. Never send to a
      // client-supplied address from the client — that would be an open mail
      // relay allowing arbitrary recipients via the app's email service.
      await base44.integrations.Core.SendEmail({
        to: "info@staytrvlr.com",
        subject: `Contact Form: ${data.subject}`,
        body: `
          New contact form submission:

          Name: ${data.name}
          Email: ${data.email}
          Phone: ${data.phone}
          Subject: ${data.subject}

          Message:
          ${data.message}
        `
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="max-w-[1400px] mx-auto px-6">
          <Link to={createPageUrl("Home")} className="inline-flex items-center text-sm text-gray-600 hover:text-[#b89968] transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-[40px] font-light tracking-[0.15em] md:tracking-[0.2em] text-gray-700">
            CONTACT US
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-light tracking-wider text-gray-800 mb-8">
              Get in Touch
            </h2>
            <p className="text-gray-600 leading-relaxed tracking-wide mb-8">
              We're here to help make your vacation dreams a reality. Reach out to us with any
              questions about our properties or services.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#b89968]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#b89968]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Phone</h3>
                  <a href="tel:+19495398862" className="text-gray-600 hover:text-[#b89968] transition-colors">(949) 539-8862</a>
                  <p className="text-sm text-gray-500">Available 24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#b89968]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#b89968]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Email</h3>
                  <a href="mailto:info@staytrvlr.com" className="text-gray-600 hover:text-[#b89968] transition-colors">info@staytrvlr.com</a>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardContent className="pt-6">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="border-[#b89968] text-[#b89968] hover:bg-[#b89968]/10"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                        Your Name *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                        Subject *
                      </label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="What can we help you with?"
                      />
                    </div>

                    <div>
                      <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                        Message *
                      </label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full bg-[#b89968] hover:bg-[#a68858] text-white py-6 text-sm tracking-wider font-medium"
                    >
                      {contactMutation.isPending ? "Sending..." : "SEND MESSAGE"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}