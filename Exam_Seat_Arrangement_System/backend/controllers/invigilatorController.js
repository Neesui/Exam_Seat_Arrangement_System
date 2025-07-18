import bcrypt from "bcrypt";
import prisma from "../utils/db.js";

export const addInvigilatorController = async (req, res) => {
  console.log("📥 Incoming request body:", req.body);

  try {
    const { name, email, password, course, phone, address, gender } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "INVIGILATOR",
        invigilator: {
          create: {
            course,
            phone,
            address,
            gender,
          },
        },
      },
      include: {
        invigilator: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Invigilator added successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        invigilator: newUser.invigilator,
      },
    });

  } catch (error) {
    console.error("Error adding invigilator:", error);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};


export const getAllInvigilator = async (req, res) => {
  try {
    const invigilators = await prisma.user.findMany({
      where: {
        role: 'INVIGILATOR',
      },
      include: {
        invigilator: true,
      },
    });

    const formattedInvigilators = invigilators.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.invigilator?.course || '',
      phone: user.invigilator?.phone || '',
      address: user.invigilator?.address || '',
      gender: user.invigilator?.gender || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    // Send response
    res.json({
      success: true,
      message: 'All invigilators fetched successfully',
      invigilators: formattedInvigilators,
    });

  } catch (error) {
    console.error('Error fetching all invigilators:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};


export const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { invigilator: true },
    });

    res.json({
      success: true,
      message: "Invigilator profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};


export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, password, course, phone, address, gender } = req.body;

  try {
    const userData = {};
    if (name) userData.name = name;
    if (email) userData.email = email;
    if (password) {
      userData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(userData).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: userData,
      });
    }

    const invigData = { course, phone, address, gender };
    Object.keys(invigData).forEach((key) => invigData[key] === undefined && delete invigData[key]);

    if (Object.keys(invigData).length > 0) {
      await prisma.invigilator.update({
        where: { userId },
        data: invigData,
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};


export const getInvigilatorExamMetaSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const invigilator = await prisma.invigilator.findUnique({
      where: { userId },
    });

    const assignments = await prisma.invigilatorAssignment.findMany({
      where: { invigilatorId: invigilator.id },
      include: {
        roomAssignment: {
          include: {
            room: true,
            exam: {
              include: {
                subject: true,
                course: true,
                semester: true,
              },
            },
            invigilatorAssignments: {
              include: {
                invigilator: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const result = [];

    for (const a of assignments) {
      const { room, exam, invigilatorAssignments } = a.roomAssignment;

      const benches = await prisma.bench.findMany({
        where: { roomId: room.id },
        include: {
          seats: {
            include: {
              student: true,
            },
          },
        },
      });

      const allStudents = benches.flatMap((b) => b.seats.map((s) => s.student));

      const colleges = {};
      for (const student of allStudents) {
        if (!colleges[student.college]) colleges[student.college] = [];
        colleges[student.college].push(student.symbolNumber);
      }

      const collegeSummary = Object.entries(colleges).map(([college, symbolNumbers]) => {
        symbolNumbers.sort();
        return {
          college,
          startSymbolNumber: symbolNumbers[0],
          endSymbolNumber: symbolNumbers[symbolNumbers.length - 1],
          studentCount: symbolNumbers.length,
        };
      });

      const invigilators = invigilatorAssignments.map((ia) => ({
        name: ia.invigilator.user.name,
        email: ia.invigilator.user.email,
      }));

      result.push({
        exam: {
          subject: exam.subject,
          examDate: exam.date.toISOString().split("T")[0],
          startTime: exam.startTime,
          endTime: exam.endTime,
          course: exam.course,
          semester: exam.semester,
        },
        room: {
          roomNumber: room.roomNumber,
          invigilators,
        },
        collegeSummary,
      });
    }

    res.json({ success: true, message: "Exam meta summary fetched successfully", data: result });
  } catch (error) {
    console.error("Get Invigilator Exam Meta Summary error:", error);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};
