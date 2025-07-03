import prisma from "@/lib/prisma";

// create subject
export const addSubject = async (req, res) => {
  const { subjectsubjectName, code, semesterId } = req.body;

  if(!subjectsubjectName || !code || !semesterId){
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
        subjectsubjectName,
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

// get all subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        semester: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    return res.status(200).json({
      success: true,
      message: "Subjects fetched successfully",
      data: subjects,
    });

  } catch (err) {
    console.error("Error fetching subjects: ", err);
    return res.status(500).json({
      success: false,
      message: "failed to fetch subjects",
      error: err.message,
    });
  }
}

// get subject by id
export const getSubjectById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const subject = await prisma.subject.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          semester: true,
        },
      });
  
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found",   
        })
      }
  
      return res.status(200).json({
        success: true,
        message: "Subject fetched successfully",
        data: subject,
      });
    } catch (err) {
      console.error("Error fetching subject: ", err);
      return res.status(500).json({
        success: false,
        message: "failed to fetch subject",
        error: err.message,
      });
    }
  }

  // Update Subject
export const updateSubject = async (req, res) => {
    const { id } = req.params;
    const { subjectName, code, semesterId } = req.body;
  
    if (!subjectName || !code || !semesterId) {
      return res.status(400).json({
        success: false,
        message: "'subjectName', 'code', and 'semesterId' are required.",
      });
    }
  
    try {
      const semester = await prisma.semester.findUnique({
        where: { id: Number(semesterId) },
      });
  
      if (!semester) {
        return res.status(400).json({
          success: false,
          message: "Invalid semesterId: Semester not found.",
        });
      }
  
      const updatedSubject = await prisma.subject.update({
        where: { id: Number(id) },
        data: {
          subjectName,
          code,
          semesterId: Number(semesterId),
        },
      });
  
      res.json({
        success: true,
        message: "Subject updated successfully",
        subject: updatedSubject,
      });
    } catch (err) {
      console.error("Failed to update subject:", err);
      res.status(404).json({
        success: false,
        message: "Subject not found",
        error: err.message,
      });
    }
  };

  // Delete Subject
export const deleteSubject = async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.subject.delete({
        where: { id: Number(id) },
      });
  
      res.json({
        success: true,
        message: "Subject deleted successfully",
      });
    } catch (err) {
      console.error("Failed to delete subject:", err);
      res.status(404).json({
        success: false,
        message: "Subject not found",
        error: err.message,
      });
    }
  };
  