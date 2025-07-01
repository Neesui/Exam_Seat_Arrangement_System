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