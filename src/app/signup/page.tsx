"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Activity, Loader2, UserPlus } from "lucide-react";

import { registerAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(registerAction, undefined);
  const [role, setRole] = useState<string>("PATIENT");

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-blue-100/80 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
            <Activity className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription>
            Join Hospital 2050 to access your customized AI Copilot portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {state.error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="border-blue-100 focus-visible:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@hospital.com"
                required
                className="border-blue-100 focus-visible:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="border-blue-100 focus-visible:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-select">Select Your Role</Label>
              <input type="hidden" name="role" value={role} />
              <Select value={role} onValueChange={(val) => setRole(val ?? "PATIENT")}>
                <SelectTrigger id="role-select" className="w-full border-blue-100 focus-visible:ring-primary/30 justify-between">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white border border-blue-100 shadow-md rounded-lg p-1">
                  <SelectItem value="PATIENT" className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-blue-50 focus:bg-blue-50 outline-none">
                    Patient
                  </SelectItem>
                  <SelectItem value="DOCTOR" className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-blue-50 focus:bg-blue-50 outline-none">
                    Doctor
                  </SelectItem>
                  <SelectItem value="NURSE" className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-blue-50 focus:bg-blue-50 outline-none">
                    Nurse
                  </SelectItem>
                  <SelectItem value="RECEPTION" className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-blue-50 focus:bg-blue-50 outline-none">
                    Receptionist
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "DOCTOR" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  type="text"
                  placeholder="e.g. Cardiology, Internal Medicine"
                  required
                  className="border-blue-100 focus-visible:ring-primary/30"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="size-4" />
                  Sign Up
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link href="/#access-portal" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
