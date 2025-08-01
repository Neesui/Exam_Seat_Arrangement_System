import prisma from "../utils/db.js";
import { validateCoursePayload } from '../utils/validation.js';

// Create Course with Semesters and Subjects
export const createCourseFull = async (req, res) => {
  const { name, duration, batchYear, semesters } = req.body;

  const error = validateCoursePayload(name, duration, semesters, batchYear);
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  try {
    const course = await prisma.course.create({
      data: {
        name,
        duration: Number(duration),
        batchYear: Number(batchYear),
        semesters: {
          create: semesters.map((sem) => ({
            semesterNum: Number(sem.semesterNum),
            subjects: {
              create: sem.subjects.map((sub) => ({
                subjectName: sub.subjectName,
                code: sub.code,
              })),
            },
          })),
        },
      },
      include: {
        semesters: {
          include: {
            subjects: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Course with semesters and subjects created successfully',
      course,
    });
  } catch (err) {
    console.error(err);

    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Course with the same name and batch year already exists.',
      });
    }

    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all courses with semesters and subjects
export const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        semesters: {
          orderBy: { semesterNum: 'asc' },
          include: {
            subjects: {
              orderBy: { subjectName: 'asc' },
            },
          },
        },
        students: true,
      },
    });

    res.json({
      success: true,
      message: "Courses with semesters and subjects retrieved successfully",
      courses,
    });
  } catch (err) {
    console.error("Error retrieving courses:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
      error: err.message,
    });
  }
};

// Get a specific course by ID
export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        semesters: {
          orderBy: { semesterNum: 'asc' },
          include: { subjects: true },
        },
        students: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course retrieved successfully",
      course,
    });
  } catch (err) {
    console.error("Error retrieving course:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve course",
      error: err.message,
    });
  }
};

// Update course name, duration, or batchYear
export const updateCourse = async (req, res) => {
  const { name, duration, batchYear } = req.body;
  const courseId = req.params.id;

  try {
    const updatedCourse = await prisma.course.update({
      where: { id: Number(courseId) },
      data: {
        ...(name && { name }),
        ...(duration !== undefined && { duration: Number(duration) }),
        ...(batchYear !== undefined && { batchYear: Number(batchYear) }),
      },
    });

    res.json({
      success: true,
      message: "Course updated successfully",
      updatedCourse,
    });
  } catch (err) {
    console.error("Error updating course:", err);

    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: "Course with this name and batchYear already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: err.message,
    });
  }
};

// Delete a course by ID
export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.course.delete({
      where: { id: Number(id) },
    });

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting course:", err);

    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: err.message,
    });
  }
};
