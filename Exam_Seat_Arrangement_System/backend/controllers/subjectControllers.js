import prisma from "@/lib/prisma";

// Create subject
export const addSubject = async (req, res) => {
  const { subjectName, code, semesterId } = req.body;

  try {
    const subject = await prisma.subject.create({
      data: {
        subjectName,
        code,
        semesterId: Number(semesterId),
      },
    });

    return res.status(201).json({ success: true, message: "Subject created successfully", data: subject });
  } catch (err) {
    console.error("[addSubject] Error:", err);
    return res.status(500).json({ success: false, message: "Failed to create subject", error: err.message });
  }
};

// Get all subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: { semester: true },
      orderBy: { id: "asc" },
    });

    return res.status(200).json({ success: true, message: "Subjects fetched successfully", data: subjects });
  } catch (err) {
    console.error("[getSubjects] Error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch subjects", error: err.message });
  }
};

// Get subject by id
export const getSubjectById = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: { semester: true },
    });

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    return res.status(200).json({ success: true, message: "Subject fetched successfully", data: subject });
  } catch (err) {
    console.error("[getSubjectById] Error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch subject", error: err.message });
  }
};

// Update subject
export const updateSubject = async (req, res) => {
  const id = Number(req.params.id);
  const { subjectName, code, semesterId } = req.body;

  try {
    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: {
        subjectName,
        code,
        semesterId: Number(semesterId),
      },
    });

    return res.status(200).json({ success: true, message: "Subject updated successfully", subject: updatedSubject });
  } catch (err) {
    console.error("[updateSubject] Error:", err);
    return res.status(500).json({ success: false, message: "Failed to update subject", error: err.message });
  }
};

// Delete subject
export const deleteSubject = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.subject.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Subject deleted successfully" });
  } catch (err) {
    console.error("[deleteSubject] Error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete subject", error: err.message });
  }
};
