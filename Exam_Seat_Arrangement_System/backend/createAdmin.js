import bcrypt from "bcrypt";
import prisma from "./utils/db.js"; 

async function createAdmin() {
  const plainPassword = "admin@123"; 
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "ADMIN", 
      },
    });

    console.log("Admin created:", admin);
  } catch (error) {
    console.error("Failed to create admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
