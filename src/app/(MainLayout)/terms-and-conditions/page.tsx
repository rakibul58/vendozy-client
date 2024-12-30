"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Shield, AlertCircle, HelpCircle, Scale, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type SectionId = "general" | "privacy" | "usage" | "rights";

interface Section {
  id: SectionId;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ContentItem {
  subtitle: string;
  text: string;
}

interface TermsSection {
  title: string;
  content: ContentItem[];
}

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("general");

  const sections: Section[] = [
    { id: "general", title: "General Terms", icon: FileText },
    { id: "privacy", title: "Privacy & Data", icon: Shield },
    { id: "usage", title: "Usage Rules", icon: AlertCircle },
    { id: "rights", title: "Your Rights", icon: Scale },
  ];

  const termsContent: { [key in SectionId]: TermsSection } = {
    general: {
      title: "General Terms of Service",
      content: [
        {
          subtitle: "Agreement to Terms",
          text: "By accessing our service, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.",
        },
        {
          subtitle: "License to Use",
          text: "We grant you a limited, non-exclusive, non-transferable license to use our service for personal or commercial purposes in accordance with these terms.",
        },
      ],
    },
    privacy: {
      title: "Privacy & Data Protection",
      content: [
        {
          subtitle: "Data Collection",
          text: "We collect and process your personal data in accordance with our Privacy Policy. This includes information you provide during registration and usage of our platform.",
        },
        {
          subtitle: "Data Security",
          text: "We implement various security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.",
        },
      ],
    },
    usage: {
      title: "Platform Usage Rules",
      content: [
        {
          subtitle: "Acceptable Use",
          text: "You agree not to use our platform for any unlawful purpose or in any way that could damage, disable, overburden, or impair our service.",
        },
        {
          subtitle: "Account Responsibilities",
          text: "You are responsible for maintaining the confidentiality of your account and password, including but not limited to restricting access to your computer and/or account.",
        },
      ],
    },
    rights: {
      title: "Your Rights & Obligations",
      content: [
        {
          subtitle: "User Rights",
          text: "You retain all rights to any content you submit, post or display on or through our service. By submitting content, you grant us a worldwide, non-exclusive license to use, reproduce, and distribute such content.",
        },
        {
          subtitle: "Dispute Resolution",
          text: "Any disputes arising from or relating to these terms will be resolved through arbitration in accordance with our Dispute Resolution Policy.",
        },
      ],
    },
  };

  const commonQuestions = [
    {
      question: "How do refunds work?",
      answer:
        "Refunds are processed within 7-14 business days of approval. Products must be returned in original condition.",
    },
    {
      question: "What data do you collect?",
      answer:
        "We collect basic user information, browsing behavior, and transaction details to improve our services.",
    },
    {
      question: "How can I close my account?",
      answer:
        "You can close your account through the settings page. All data will be handled as per our privacy policy.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-primary/5 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4 text-center"
        >
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to know about using Vendozy&apos;s services
          </motion.p>
        </motion.div>

        {/* Navigation Cards */}
        <div className="container mx-auto px-4 mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 ${
                    activeSection === section.id
                      ? "border-primary shadow-lg"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <CardContent className="p-6 flex items-center space-x-4">
                    <section.icon
                      className={`w-6 h-6 ${
                        activeSection === section.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="font-medium">{section.title}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Sidebar - Quick Links */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <motion.button
                      key={section.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                        activeSection === section.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <section.icon className="w-5 h-5" />
                      <span>{section.title}</span>
                    </motion.button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-8">
                    {termsContent[activeSection].title}
                  </h2>
                  <div className="space-y-8">
                    {termsContent[activeSection].content.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <h3 className="text-xl font-semibold mb-3">
                          {item.subtitle}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Common Questions */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-6">Common Questions</h3>
                <Accordion type="single" collapsible className="space-y-4">
                  {commonQuestions.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <HelpCircle className="w-5 h-5 text-primary" />
                          <span>{item.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pl-8">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
