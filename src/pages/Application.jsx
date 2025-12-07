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

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in required fields");
      return;
    }

    setSubmitting(true);
    try {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = () => {
    console.log("Login clicked");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-green-900/50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
          <p className="text-gray-400 mb-8">
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-lg z-50 border-b border-gray-800">
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
            className="text-gray-400 hover:text-white"
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
                  s <= step ? 'bg-white' : 'bg-gray-800'
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Join the Waitlist</h1>
            <p className="text-gray-400">Apply for early access to Stoneforge</p>
          </div>

          <Card className="bg-gray-950 border-gray-800">
            <CardContent className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Full Name *</Label>
                    <Input
                      placeholder="John Smith"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="bg-gray-900 border-gray-800 text-white h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Email Address *</Label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="bg-gray-900 border-gray-800 text-white h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Phone Number</Label>
                    <Input
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="bg-gray-900 border-gray-800 text-white h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Country</Label>
                    <Select value={formData.country} onValueChange={(v) => handleChange("country", v)}>
                      <SelectTrigger className="bg-gray-900 border-gray-800 text-white h-12">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800">
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
                    onClick={() => setStep(2)}
                    className="w-full bg-white hover:bg-gray-200 text-black h-12 rounded-full mt-4"
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
                    <Label className="text-gray-300">Investment Experience</Label>
                    <Select value={formData.investmentExperience} onValueChange={(v) => handleChange("investmentExperience", v)}>
                      <SelectTrigger className="bg-gray-900 border-gray-800 text-white h-12">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800">
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                        <SelectItem value="expert">Expert (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Expected Investment Amount</Label>
                    <Select value={formData.investmentAmount} onValueChange={(v) => handleChange("investmentAmount", v)}>
                      <SelectTrigger className="bg-gray-900 border-gray-800 text-white h-12">
                        <SelectValue placeholder="Select amount range" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800">
                        <SelectItem value="under10k">Under $10,000</SelectItem>
                        <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                        <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                        <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                        <SelectItem value="500k+">$500,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Trading Goals</Label>
                    <Textarea
                      placeholder="What are you hoping to achieve with Stoneforge?"
                      value={formData.tradingGoals}
                      onChange={(e) => handleChange("tradingGoals", e.target.value)}
                      className="bg-gray-900 border-gray-800 text-white min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 rounded-full border-gray-800 text-gray-300 hover:bg-gray-900"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={() => setStep(3)}
                      className="flex-1 bg-white hover:bg-gray-200 text-black h-12 rounded-full"
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
                    <Label className="text-gray-300">How did you hear about us?</Label>
                    <Select value={formData.hearAboutUs} onValueChange={(v) => handleChange("hearAboutUs", v)}>
                      <SelectTrigger className="bg-gray-900 border-gray-800 text-white h-12">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800">
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
                    <p className="text-sm text-gray-400">
                      By submitting this application, you agree to our Terms of Service and Privacy Policy. 
                      You understand that trading involves risk and past performance does not guarantee future results.
                    </p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 h-12 rounded-full border-gray-800 text-gray-300 hover:bg-gray-900"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 bg-white hover:bg-gray-200 text-black h-12 rounded-full"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
