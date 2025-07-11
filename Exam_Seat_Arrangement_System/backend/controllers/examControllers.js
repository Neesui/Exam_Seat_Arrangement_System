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
        startTime: startTime || null,
        endTime: endTime || null,
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
          roomAssignments: true,
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
  