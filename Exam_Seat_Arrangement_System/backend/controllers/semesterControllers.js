import prisma from "../utils/db.js";
import {
  validateSemester,
  validateSemesterWithSubjects
} from "../utils/validation.js";

// ✅ Add semester with subjects
export const addSemesterWithSubjects = async (req, res) => {
  const { courseId, semesterNum, subjects } = req.body;

  const error = validateSemesterWithSubjects(courseId, semesterNum, subjects);
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const semester = await prisma.semester.create({
      data: {
        semesterNum: Number(semesterNum),
        courseId: Number(courseId),
        subjects: {
          create: subjects.map((sub) => ({
            subjectName: sub.subjectName,
            code: sub.code,
          })),
        },
      },
      include: {
        subjects: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Semester with subjects added successfully",
      semester,
    });
  } catch (err) {
    console.error("Error creating semester with subjects:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add semester with subjects",
      error: err.message,
    });
  }
};

// ✅ Get all semesters
export const getSemesters = async (req, res) => {
  try {
    const semesters = await prisma.semester.findMany({
      include: {
        course: true,
        subjects: true,
      },
      orderBy: {
        semesterNum: "asc",
      },
    });

    res.json({
      success: true,
      message: "Semesters retrieved successfully",
      semesters,
    });
  } catch (err) {
    console.error("Failed to fetch semesters:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch semesters",
      error: err.message,
    });
  }
};

// ✅ Get semester by ID
export const getSemesterById = async (req, res) => {
  const { id } = req.params;

  try {
    const semester = await prisma.semester.findUnique({
      where: { id: Number(id) },
      include: {
        course: true,
        subjects: true,
      },
    });

    if (!semester) {
      return res.status(404).json({ success: false, message: "Semester not found" });
    }

    res.json({
      success: true,
      message: "Semester retrieved successfully",
      semester,
    });
  } catch (err) {
    console.error("Error fetching semester:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve semester",
      error: err.message,
    });
  }
};

// ✅ Update semester
export const updateSemester = async (req, res) => {
  const { id } = req.params;
  const { semesterNum, courseId } = req.body;

  const error = validateSemester(semesterNum, courseId);
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseId: Course not found.",
      });
    }

    const updatedSemester = await prisma.semester.update({
      where: { id: Number(id) },
      data: {
        semesterNum: Number(semesterNum),
        courseId: Number(courseId),
      },
    });

    res.json({
      success: true,
      message: "Semester updated successfully",
      semester: updatedSemester,
    });
  } catch (err) {
    console.error("Failed to update semester:", err);
    res.status(404).json({
      success: false,
      message: "Semester not found",
      error: err.message,
    });
  }
};

// ✅ Delete semester
export const deleteSemester = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.semester.delete({
      where: { id: Number(id) },
    });

    res.json({
      success: true,
      message: "Semester deleted successfully",
    });
  } catch (err) {
    console.error("Failed to delete semester:", err);
    res.status(404).json({
      success: false,
      message: "Semester not found",
      error: err.message,
    });
  }
};
