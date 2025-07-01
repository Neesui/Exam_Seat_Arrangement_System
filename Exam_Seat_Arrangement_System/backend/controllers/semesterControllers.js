import { Prisma } from "@prisma/client";

// Create Semester
export const addSemester = async (req, res) => {
  const { semesterNum, courseId } = req.body;

  if(semesterNum === undefined || courseId === undefined){
    return res.status(400).json({
      success: false,
      message: "semesterNum and courseId are required",
    });
  }

  try{
    //check if courses exist
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });

    if(!course){
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const semester = await prisma.semester.create({
      data: {
        semesterNum: Number(semesterNum),
        courseId: Number(courseId),
      },
    });

    res.status(201).json({
      success: true,
      message: "Semester created successfully",
      semester,
    })
  } catch(err){
    res.status(500).json({
      success: false,
      message: "Failed to create semester",
      error: err.message,
    });
  }
}

// Get All Semesters
export const getSemesters = async (req, res) => {
  try {
    const semesters = await prisma.semester.findMany({
      include: { course: true },
      orderBy: { id: "asc" },
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

// Update Semester
export const updateSemester = async (req, res) => {
    const { id } = req.params;
    const { number, courseId } = req.body;
  
    if (number === undefined || courseId === undefined) {
      return res.status(400).json({
        success: false,
        message: "'number' and 'courseId' are required.",
      });
    }
  
    try {
      // Check course exists
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
          number: Number(number),
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