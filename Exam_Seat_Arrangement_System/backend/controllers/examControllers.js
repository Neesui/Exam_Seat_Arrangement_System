import prisma from "../utils/db.js";

// Create Exam
export const createExam = async (req, res) => {
  try {
    const { subjectId, date, startTime, endTime } = req.body;

    if (!subjectId || !date) {
      return res.status(400).json({
        success: false,
        message: "'subjectId' and 'date' are required.",
      });
    }

    const subjectIdNum = Number(subjectId);
    if (isNaN(subjectIdNum)) {
      return res.status(400).json({
        success: false,
        message: "'subjectId' must be a valid number.",
      });
    }

    const exam = await prisma.exam.create({
      data: {
        subjectId: subjectIdNum,
        date: new Date(date),
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    console.error("Create Exam Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create exam",
      error: error.message,
    });
  }
};

// Get All Exams
export const getExams = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        subject: {
          include: {
            semester: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    res.json({
      success: true,
      message: "Exams retrieved successfully",
      exams,
    });
  } catch (error) {
    console.error("Get Exams Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exams",
      error: error.message,
    });
  }
};

// Get Exam by ID
export const getExamById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid exam ID" });
    }

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        subject: {
          include: {
            semester: {
              include: {
                course: true,
              },
            },
          },
        },
        roomAssignments: {
          include: {
            room: true,
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
        seatingPlans: {
          include: {
            seats: {
              include: {
                student: true,
                bench: true,
              },
            },
          },
        },
      },
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.json({
      success: true,
      message: "Exam retrieved successfully",
      exam,
    });
  } catch (error) {
    console.error("Get Exam By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exam",
      error: error.message,
    });
  }
};

// Update Exam
export const updateExam = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid exam ID" });
    }

    const { subjectId, date, startTime, endTime } = req.body;
    if (!subjectId || !date) {
      return res.status(400).json({
        success: false,
        message: "'subjectId' and 'date' are required.",
      });
    }

    const subjectIdNum = Number(subjectId);
    if (isNaN(subjectIdNum)) {
      return res.status(400).json({
        success: false,
        message: "'subjectId' must be a valid number.",
      });
    }

    const exam = await prisma.exam.update({
      where: { id },
      data: {
        subjectId: subjectIdNum,
        date: new Date(date),
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
      },
    });

    res.json({
      success: true,
      message: "Exam updated successfully",
      exam,
    });
  } catch (error) {
    console.error("Update Exam Error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update exam",
      error: error.message,
    });
  }
};

// Delete Exam
export const deleteExam = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid exam ID" });
    }

    await prisma.exam.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error("Delete Exam Error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete exam",
      error: error.message,
    });
  }
};
