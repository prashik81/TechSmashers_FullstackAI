"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const roleRoutes: Record<string, string> = {
  PATIENT: "/patient",
  DOCTOR: "/doctor",
  NURSE: "/nurse",
  RECEPTION: "/reception",
};

const roleLabels: Record<string, string> = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  NURSE: "nurse",
  RECEPTION: "receptionist",
};

export async function loginAction(
  email: string,
  password: string,
  expectedRole: string
): Promise<{ error?: string } | void> {
  try {
    await signIn("credentials", {
      email,
      password,
      expectedRole,
      redirectTo: roleRoutes[expectedRole] || "/",
    });
  } catch (error) {
    // Role mismatch — thrown by our authorize function
    if (
      error instanceof Error &&
      (error.message === "ROLE_MISMATCH" ||
        (error as { cause?: { message?: string } }).cause?.message ===
          "ROLE_MISMATCH")
    ) {
      const label = roleLabels[expectedRole] || expectedRole.toLowerCase();
      return {
        error: `This account isn't registered as a ${label}. Try a different portal.`,
      };
    }

    // Auth errors (wrong credentials, etc.)
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }

    // Re-throw redirect errors and unknown errors
    throw error;
  }
}

export async function registerAction(
  prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string } | undefined> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const specialty = formData.get("specialty") as string | null;

  // Validate required fields
  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (!role || !roleRoutes[role]) {
    return { error: "Please select a valid role." };
  }

  if (role === "DOCTOR" && !specialty) {
    return { error: "Specialty is required for doctors." };
  }

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role as "PATIENT" | "DOCTOR" | "NURSE" | "RECEPTION",
      specialty: role === "DOCTOR" ? specialty : null,
    },
  });

  // Auto-login and redirect
  try {
    await signIn("credentials", {
      email,
      password,
      expectedRole: role,
      redirectTo: roleRoutes[role],
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Account created but login failed. Please try logging in.",
      };
    }
    throw error;
  }
}
