"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ClipboardList,
  Loader2,
  Sparkles,
  User,
  UserCheck,
  UserPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Patient {
  id: string;
  userId: string;
  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;
  insuranceProvider: string | null;
  policyNumber: string | null;
  emergencyContact: string | null;
  registeredAt: string;
  user: {
    name: string;
    email: string;
  };
  registeredByUser?: {
    name: string;
  } | null;
}

const SAMPLE_NOTE =
  "We need to check in Mark Stevenson, born on 1988-11-24. His email address is mark.s@outlook.com, and phone is 415-555-9876. He lives at 452 Pine St, San Francisco, CA. He's covered by Blue Cross under policy BCX992384. Emergency contact is his wife, Jane Stevenson at 415-555-1122.";

export default function ReceptionPage() {
  // Extraction states
  const [rawNotes, setRawNotes] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractorModel, setExtractorModel] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Save states
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Patients list state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isListLoading, setIsListLoading] = useState(true);

  // Fetch patients list
  async function fetchPatients() {
    try {
      const res = await fetch("/api/reception/register");
      if (res.ok) {
        const data = await res.json();
        setPatients(data.patients || []);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setIsListLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleExtract = async () => {
    if (!rawNotes.trim()) return;
    setIsExtracting(true);
    setExtractorModel(null);

    try {
      const res = await fetch("/api/reception/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: rawNotes }),
      });

      const data = await res.json();
      if (res.ok && data.output) {
        const out = data.output;
        setName(out.name || "");
        setEmail(out.email || "");
        
        // Handle Date conversion to YYYY-MM-DD for input[type=date]
        if (out.dob) {
          try {
            const d = new Date(out.dob);
            if (!isNaN(d.getTime())) {
              setDob(d.toISOString().split("T")[0]);
            } else {
              setDob(out.dob);
            }
          } catch {
            setDob(out.dob);
          }
        } else {
          setDob("");
        }

        setPhone(out.phone || "");
        setAddress(out.address || "");
        setInsuranceProvider(out.insuranceProvider || "");
        setPolicyNumber(out.policyNumber || "");
        setEmergencyContact(out.emergencyContact || "");
        setExtractorModel(data.model || "AI Model");
      } else {
        throw new Error(data.error || "Failed to extract details");
      }
    } catch (err) {
      console.error("Extraction error:", err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleLoadSample = () => {
    setRawNotes(SAMPLE_NOTE);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setSaveError("Name and Email are required fields.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await fetch("/api/reception/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          dob: dob || null,
          phone: phone || null,
          address: address || null,
          insuranceProvider: insuranceProvider || null,
          policyNumber: policyNumber || null,
          emergencyContact: emergencyContact || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      setSaveSuccess("Patient successfully registered!");
      // Reset form
      setName("");
      setEmail("");
      setDob("");
      setPhone("");
      setAddress("");
      setInsuranceProvider("");
      setPolicyNumber("");
      setEmergencyContact("");
      setRawNotes("");
      setExtractorModel(null);

      // Refresh list
      fetchPatients();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-white p-6 sm:p-8">
        <Badge variant="secondary" className="mb-3 border border-blue-100 bg-white text-primary">
          <ClipboardList className="size-3" />
          Receptionist Module
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Patient Intake & Registration
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Register new patients, view intake sheets, and use AI to extract
          structured data from unstructured notes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: AI Intake assistant and registration form */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Intake Assistant */}
          <Card className="border-blue-100/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                AI Intake Assistant
              </CardTitle>
              <CardDescription>
                Paste unstructured check-in notes, transcripts, or email text to auto-fill the patient registration form.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rawNotes">Raw intake notes</Label>
                <Textarea
                  id="rawNotes"
                  placeholder="e.g. New patient James, email james@gmail.com, phone 415-555-0192, born April 12 1992..."
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  rows={4}
                  className="resize-none border-blue-100 bg-white focus-visible:ring-primary/30"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleExtract} disabled={!rawNotes.trim() || isExtracting}>
                  {isExtracting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Extract Details
                    </>
                  )}
                </Button>
                <Button variant="outline" className="border-blue-200" onClick={handleLoadSample}>
                  Load sample notes
                </Button>
              </div>
              {extractorModel && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Extracted using: <span className="font-semibold text-primary">{extractorModel}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card className="border-blue-100/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="size-5 text-primary" />
                Patient Registration Form
              </CardTitle>
              <CardDescription>
                Review and finalize the patient details below. Fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                {saveError && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {saveError}
                  </div>
                )}
                {saveSuccess && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    {saveSuccess}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="border-blue-100 focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-blue-100 focus-visible:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="border-blue-100 focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="555-123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-blue-100 focus-visible:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Residential Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, Apt 4B, New York, NY 10001"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border-blue-100 focus-visible:ring-primary/30"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="insurance">Insurance Provider</Label>
                    <Input
                      id="insurance"
                      placeholder="e.g. Aetna, Cigna"
                      value={insuranceProvider}
                      onChange={(e) => setInsuranceProvider(e.target.value)}
                      className="border-blue-100 focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policy">Policy / Member ID</Label>
                    <Input
                      id="policy"
                      placeholder="e.g. POL123456789"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      className="border-blue-100 focus-visible:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    placeholder="e.g. Sarah Doe (Spouse) - 555-987-6543"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="border-blue-100 focus-visible:ring-primary/30"
                  />
                </div>

                <Button type="submit" className="w-full mt-2" size="lg" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Registering Patient...
                    </>
                  ) : (
                    <>
                      <UserCheck className="size-4" />
                      Register Patient Profile
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Recently registered patients list */}
        <div className="lg:col-span-1">
          <Card className="border-blue-100/80 shadow-sm h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5 text-primary" />
                Intake Roster
              </CardTitle>
              <CardDescription>
                Recently registered patient accounts and profiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[600px] space-y-4">
              {isListLoading ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <p className="text-sm">Loading patients list...</p>
                </div>
              ) : patients.length > 0 ? (
                <div className="space-y-3">
                  {patients.map((pat) => (
                    <div
                      key={pat.id}
                      className="rounded-xl border border-blue-100 bg-blue-50/10 p-3 text-sm transition-all hover:bg-blue-50/30"
                    >
                      <div className="font-semibold text-foreground">
                        {pat.user?.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {pat.user?.email}
                      </div>
                      {pat.phone && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Phone: <span className="text-foreground">{pat.phone}</span>
                        </div>
                      )}
                      {pat.insuranceProvider && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Ins: <span className="text-foreground">{pat.insuranceProvider}</span>
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t border-blue-50 text-[10px] text-muted-foreground flex justify-between">
                        <span>
                          By: {pat.registeredByUser?.name || "System"}
                        </span>
                        <span>
                          {new Date(pat.registeredAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                  <ClipboardList className="size-8 opacity-40" />
                  <p className="text-sm">No patients registered yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
