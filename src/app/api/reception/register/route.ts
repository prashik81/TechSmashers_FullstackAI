import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: list recently registered patients
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "RECEPTION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patients = await prisma.patientProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        registeredByUser: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        registeredAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json({ patients });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch registered patients.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: register a new patient
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "RECEPTION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      email,
      dob,
      phone,
      address,
      insuranceProvider,
      policyNumber,
      emergencyContact,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Patient name and email are required." },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && user.role !== "PATIENT") {
      return NextResponse.json(
        { error: "This email belongs to a staff member (Doctor/Nurse/Receptionist)." },
        { status: 400 }
      );
    }

    if (!user) {
      // Create user with default hashed password 'patient123'
      const hashedPassword = await bcrypt.hash("patient123", 10);
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "PATIENT",
        },
      });
    }

    // Check if patient profile already exists for this user
    let profile = await prisma.patientProfile.findUnique({
      where: { userId: user.id },
    });

    const parsedDob = dob ? new Date(dob) : null;

    if (profile) {
      // Update existing profile
      profile = await prisma.patientProfile.update({
        where: { userId: user.id },
        data: {
          dateOfBirth: parsedDob,
          phone: phone || null,
          address: address || null,
          emergencyContact: emergencyContact || null,
          insuranceProvider: insuranceProvider || null,
          policyNumber: policyNumber || null,
          registeredBy: session.user?.id || null,
        },
      });
    } else {
      // Create new profile
      profile = await prisma.patientProfile.create({
        data: {
          userId: user.id,
          dateOfBirth: parsedDob,
          phone: phone || null,
          address: address || null,
          emergencyContact: emergencyContact || null,
          insuranceProvider: insuranceProvider || null,
          policyNumber: policyNumber || null,
          registeredBy: session.user?.id || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Patient registered successfully.",
      patient: {
        id: profile.id,
        userId: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to register patient.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
