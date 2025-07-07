import prisma from "../utils/db.js";

// Create Course
export const addCourse = async (req, res) => {
  const { name, duration } = req.body;

  try {
    const course = await prisma.course.create({
      data: {
        name,
        duration,
      },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: err.message,
    });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json({
      success: true,
      message: "Courses retrieved successfully",
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


// Get Course By ID
export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
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


// update courses
export const updateCourse = async (req, res) => {
  const { name, duration } = req.body;
  const courseId = req.params.id;

  try {
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...(name && { name }),
        ...(duration !== undefined && { duration }),
      },
    });

    res.json({
      success: true,
      message: "Course updated successfully",
      updatedCourse,    
    });
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: err.message,
    });
  }
}

// delete course
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
    res.status(404).json({
      success: false,
      message: "Course not found",
      error: err.message,
    });
  }
};