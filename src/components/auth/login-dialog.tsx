"use client";

import { useState, useTransition } from "react";
import { Loader2, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/actions";

const dialogConfig: Record<
  string,
  { title: string; description: string; label: string }
> = {
  PATIENT: {
    title: "Patient Portal",
    description: "Access your appointments and chat with our AI assistant.",
    label: "patient",
  },
  DOCTOR: {
    title: "Doctor Portal",
    description: "View your schedule and manage prescriptions.",
    label: "doctor",
  },
  NURSE: {
    title: "Nurse Portal",
    description: "Review patient records and update vital signs.",
    label: "nurse",
  },
  RECEPTION: {
    title: "Receptionist Portal",
    description: "Register patients and manage intake forms.",
    label: "receptionist",
  },
};

interface LoginDialogProps {
  role: "PATIENT" | "DOCTOR" | "NURSE" | "RECEPTION";
  children: React.ReactNode;
}

export function LoginDialog({ role, children }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const config = dialogConfig[role];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await loginAction(email, password, role);
      if (result?.error) {
        setError(result.error);
      }
      // On success, signIn redirects — the page navigates automatically
    });
  }

  return (
    <Dialog>
      <DialogTrigger className="flex w-full flex-col items-center rounded-xl border border-blue-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor={`${role}-email`}>Email</Label>
            <Input
              id={`${role}-email`}
              type="email"
              placeholder="you@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${role}-password`}>Password</Label>
            <Input
              id={`${role}-password`}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="size-4" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
