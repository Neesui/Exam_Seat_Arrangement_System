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

//Get all courses
export const getCourses = async(req, res) =>{
    try {
        const courses = await prisma.course.findMany();
        res.json({
            success: true,
            message: "Courses retrived Successfully",
            courses,
        });
    } catch (err) {
        console.error("Error retrieving courses:" , err);
        res.status(500).json({
            success: false,
            message : " Failed to retrieved courses",
            error: err.message,
        });
    }
};