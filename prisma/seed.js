const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;

  const users = [
    {
      email: "patient@hospital.com",
      password: "patient123",
      name: "John Patient",
      role: "PATIENT",
      specialty: null,
    },
    {
      email: "doctor@hospital.com",
      password: "doctor123",
      name: "Dr. Sarah Smith",
      role: "DOCTOR",
      specialty: "Internal Medicine",
    },
    {
      email: "nurse@hospital.com",
      password: "nurse123",
      name: "Nurse Emily Johnson",
      role: "NURSE",
      specialty: null,
    },
    {
      email: "reception@hospital.com",
      password: "reception123",
      name: "Receptionist Mike Brown",
      role: "RECEPTION",
      specialty: null,
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        role: user.role,
        specialty: user.specialty,
      },
    });

    console.log(`Seeded user: ${user.email} (${user.role})`);
  }

  console.log("\nSeed complete. Test credentials:");
  console.log("  Patient:    patient@hospital.com / patient123");
  console.log("  Doctor:     doctor@hospital.com / doctor123");
  console.log("  Nurse:      nurse@hospital.com / nurse123");
  console.log("  Reception:  reception@hospital.com / reception123");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
