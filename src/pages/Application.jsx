import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Application() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    investmentExperience: "",
    tradingGoals: "",
    investmentAmount: "",
    hearAboutUs: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const ENDPOINT = "https://script.google.com/macros/s/AKfycbz0aBlEVAB0w2gzS4vMZG7BS2c0OKB6cpAQiVFXPKQ2H9tKJpUaFj60U4eCYfcbjYSx/exec";

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in required fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        experience: formData.investmentExperience,
        amount: formData.investmentAmount,
        goals: formData.tradingGoals,
        referral: formData.hearAboutUs,
      };

      let ok = false;
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(payload),
        });
        ok = res.ok;
      } catch {
        ok = false;
      }

      if (!ok) {
        try {
          await fetch(ENDPOINT, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(payload),
            keepalive: true,
          });
          ok = true;
        } catch {
          ok = false;
        }
      }

      if (ok) {
        setSubmitted(true);
        toast.success("Thanks for joining the waitlist!");
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = () => {
    console.log("Login clicked");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-green-900/50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you for applying to Stoneforge. We'll review your application and get back to you within 24-48 hours.
          </p>
          <Link to={createPageUrl("Landing")}>
            <Button variant="outline" className="w-full h-12 rounded-full border-gray-800 text-gray-300 hover:bg-gray-900">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={createPageUrl("Landing")}>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ce5d09cbce0fa35e3dca6/1f3c43b3b_image.png" 
              alt="Stoneforge" 
              className="h-8"
            />
          </Link>
          <Button 
            variant="ghost" 
            onClick={handleLogin}
            className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            Already have access? Sign In
          </Button>
        </div>
      </div>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-colors ${
                  s <= step ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-gray-800'
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Join the Waitlist</h1>
            <p className="text-gray-600 dark:text-gray-400">Apply for early access to Stoneforge</p>
          </div>

          <Card className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} noValidate>
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Smith"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Country</Label>
                    <Select value={formData.country} onValueChange={(v) => handleChange("country", v)}>
                      <SelectTrigger className="h-12 bg-white border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full h-12 rounded-full mt-4 bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    disabled={!formData.fullName || !formData.email}
                  >
                    Continue
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-6">Trading Experience</h2>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Investment Experience</Label>
                    <Select value={formData.investmentExperience} onValueChange={(v) => handleChange("investmentExperience", v)}>
                      <SelectTrigger className="h-12 bg-white border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                        <SelectItem value="expert">Expert (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Expected Investment Amount</Label>
                    <Select value={formData.investmentAmount} onValueChange={(v) => handleChange("investmentAmount", v)}>
                      <SelectTrigger className="h-12 bg-white border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
                        <SelectValue placeholder="Select amount range" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
                        <SelectItem value="under10k">Under $10,000</SelectItem>
                        <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                        <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                        <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                        <SelectItem value="500k+">$500,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Trading Goals</Label>
                    <Textarea
                      id="goals"
                      placeholder="What are you hoping to achieve with Stoneforge?"
                      value={formData.tradingGoals}
                      onChange={(e) => handleChange("tradingGoals", e.target.value)}
                      className="min-h-[100px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 dark:bg-gray-900 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 h-12 rounded-full bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-6">Final Details</h2>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">How did you hear about us?</Label>
                    <Select value={formData.hearAboutUs} onValueChange={(v) => handleChange("hearAboutUs", v)}>
                      <SelectTrigger className="h-12 bg-white border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="friend">Friend/Referral</SelectItem>
                        <SelectItem value="search">Google Search</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="podcast">Podcast</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      By submitting this application, you agree to our Terms of Service and Privacy Policy. 
                      You understand that trading involves risk and past performance does not guarantee future results.
                    </p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 h-12 rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      disabled={submitting}
                      className="flex-1 h-12 rounded-full bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </div>
              )}
              {/* Hidden inputs to expose required IDs */}
              <input type="hidden" id="country" value={formData.country} readOnly />
              <input type="hidden" id="experience" value={formData.investmentExperience} readOnly />
              <input type="hidden" id="amount" value={formData.investmentAmount} readOnly />
              <input type="hidden" id="referral" value={formData.hearAboutUs} readOnly />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
