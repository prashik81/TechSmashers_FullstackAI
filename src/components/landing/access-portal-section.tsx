import Link from "next/link";
import {
  ClipboardList,
  Heart,
  Stethoscope,
  User,
  UserPlus,
} from "lucide-react";

import { LoginDialog } from "@/components/auth/login-dialog";

const roles = [
  {
    id: "PATIENT" as const,
    title: "Patient",
    icon: User,
    description: "Book appointments and chat with our AI assistant.",
  },
  {
    id: "DOCTOR" as const,
    title: "Doctor",
    icon: Stethoscope,
    description: "View your schedule and manage prescriptions.",
  },
  {
    id: "NURSE" as const,
    title: "Nurse",
    icon: Heart,
    description: "Review patient records and update vital signs.",
  },
  {
    id: "RECEPTION" as const,
    title: "Receptionist",
    icon: ClipboardList,
    description: "Register patients and manage intake forms.",
  },
];

export function AccessPortalSection() {
  return (
    <section id="access-portal" className="border-t border-blue-100/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Access Your Portal
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
            Select your role to sign in. Each portal is tailored to your
            workflow.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <LoginDialog key={role.id} role={role.id}>
              <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <role.icon className="size-6" />
              </span>
              <span className="text-base font-semibold">{role.title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {role.description}
              </span>
            </LoginDialog>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            First time here?{" "}
            <Link
              href="/signup"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <UserPlus className="size-3.5" />
              Create an account
            </Link>
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-lg border border-blue-100 bg-blue-50/40 px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Test credentials:</span>{" "}
            patient@hospital.com / patient123 · doctor@hospital.com / doctor123
            · nurse@hospital.com / nurse123 · reception@hospital.com /
            reception123
          </p>
        </div>
      </div>
    </section>
  );
}
