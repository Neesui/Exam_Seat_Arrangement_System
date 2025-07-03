import prisma from "@/lib/prisma";

// create subject
export const addSubject = async (req, res) => {
  const { subjectName, code, semesterId } = req.body;

  if(!subjectName || !code || !semesterId){
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  try {
    // check if subject already exists
    const semester = await prisma.subject.findUnique({
      where: {
        id: Number(semesterId)
      },
    });

    if (!semester) {
      return res.status(400).json({
        success: false,
        message: "Semester not found",
      });
    }

    // create subject
    const subject = await prisma.subject.create({
      data: {
        subjectName,
        code,
        semesterId: Number(semesterId),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
    })
  } catch (err) {
    console.error("Error creating subject: ", err);
    return res.status(500).json({
      success: false,
      message: "failed to create subject",
      error: err.message,
    });
  }
}