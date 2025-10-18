import prisma from "../utils/db.js";
import XLSX from "xlsx";

// Create Student
export const createStudent = async (req, res) => {
  try {
    const {
      studentName,
      symbolNumber,
      email,
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
        email,
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "Student already exists with the same symbol number and college.",
      });
    }

    console.error("Create Student Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create student",
      error: error.message,
    });
  }
};


// Get All Students
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

// Get students by college name
export const getStudentsByCollege = async (req, res) => {
  try {
    const { collegeName } = req.params;

    const students = await prisma.student.findMany({
      where: {
        college: collegeName,
      },
      include: {
        course: true,
        semester: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: `Students from ${collegeName} fetched successfully`,
      students,
    });
  } catch (error) {
    console.error("Error fetching students by college:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students by college",
      error: error.message,
    });
  }
};


// Get Single Student by ID
export const getStudentById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        course: true,
        semester: true,
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

// Update Student
export const updateStudent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    const existingStudent = await prisma.student.findUnique({ where: { id } });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

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

// Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

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

// Bulk Import Students (array of student objects)

export const importStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    // Read Excel
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Excel file is empty.",
      });
    }

    const studentData = [];

    for (const s of jsonData) {
      // Find courseId using course name and batchYear
      const course = await prisma.course.findFirst({
        where: {
          name: s.courseName, 
          batchYear: Number(s.batchYear),
        },
        select: { id: true },
      });

      if (!course) {
        return res.status(400).json({
          success: false,
          message: `Course '${s.courseName}' (${s.batchYear}) not found in database.`,
        });
      }

      // Find semesterId using semesterNum and courseId
      const semester = await prisma.semester.findFirst({
        where: {
          semesterNum: Number(s.semesterNum),
          courseId: course.id,
        },
        select: { id: true },
      });

      if (!semester) {
        return res.status(400).json({
          success: false,
          message: `Semester ${s.semesterNum} for course '${s.courseName}' not found.`,
        });
      }

      studentData.push({
        studentName: s.studentName,
        symbolNumber: String(s.symbolNumber),
        regNumber: String(s.regNumber),
        college: s.college,
        courseId: course.id,     
        semesterId: semester.id, 
        email: s.email || `${s.symbolNumber}@collegea.com`,
        imageUrl: s.imageUrl || null,
      });
    }

    await prisma.student.createMany({
      data: studentData,
      skipDuplicates: true,
    });

    res.status(200).json({
      success: true,
      message: "Students imported successfully!",
      count: studentData.length,
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




