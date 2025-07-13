import prisma from "../utils/db.js";

// ✅ Create Single Student
export const createStudent = async (req, res) => {
  try {
    const {
      studentName,
      symbolNumber,
      regNumber,
      college,
      courseId,
      semesterId,
      imageUrl,
    } = req.body;

    const student = await prisma.student.create({
      data: {
        studentName,
        symbolNumber,
        regNumber,
        college,
        courseId: Number(courseId),
        semesterId: Number(semesterId),
        imageUrl: imageUrl || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    console.error("Create Student Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create student",
      error: error.message,
    });
  }
};

// ✅ Get All Students
export const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        course: true,
        semester: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      message: "Students retrieved successfully",
      students,
    });
  } catch (error) {
    console.error("Get Students Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// ✅ Get Single Student
export const getStudentById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        course: true,
        semester: true,
        seat: true,
      },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({
      success: true,
      message: "Student retrieved successfully",
      student,
    });
  } catch (error) {
    console.error("Get Student By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

// ✅ Update Student
export const updateStudent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      studentName,
      symbolNumber,
      regNumber,
      college,
      courseId,
      semesterId,
      imageUrl,
    } = req.body;

    const student = await prisma.student.update({
      where: { id },
      data: {
        studentName,
        symbolNumber,
        regNumber,
        college,
        courseId: Number(courseId),
        semesterId: Number(semesterId),
        imageUrl: imageUrl || null,
      },
    });

    res.json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    console.error("Update Student Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
};

// ✅ Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    await prisma.student.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};

// ✅ Bulk Import Students - Fixed to accept array directly in req.body
export const importStudents = async (req, res) => {
    try {
      const students = req.body;  // <-- read req.body as array directly
  
      if (!Array.isArray(students) || students.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No student data provided.",
        });
      }
  
      const createdStudents = await prisma.student.createMany({
        data: students.map((student) => ({
          studentName: student.studentName,
          symbolNumber: student.symbolNumber,
          regNumber: student.regNumber,
          college: student.college,
          courseId: Number(student.courseId),
          semesterId: Number(student.semesterId),
          imageUrl: student.imageUrl || null,
        })),
        skipDuplicates: true,
      });
  
      res.status(201).json({
        success: true,
        message: `${createdStudents.count} students imported successfully.`,
      });
    } catch (error) {
      console.error("Import Students Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to import students.",
        error: error.message,
      });
    }
  };
  
