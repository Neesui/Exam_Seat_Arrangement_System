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