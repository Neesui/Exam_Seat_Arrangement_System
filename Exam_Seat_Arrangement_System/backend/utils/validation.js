// Validate full course creation with semesters and subjects
export const validateCoursePayload = (name, duration, semesters) => {
    if (!name || !name.trim()) return "Course name is required.";
    if (!duration || isNaN(duration)) return "Valid duration is required.";
    if (!Array.isArray(semesters) || semesters.length === 0) {
      return "At least one semester is required.";
    }
  
    for (let i = 0; i < semesters.length; i++) {
      const sem = semesters[i];
      if (!sem.semesterNum || isNaN(sem.semesterNum)) {
        return `Semester number is invalid for semester index ${i + 1}.`;
      }
      if (!Array.isArray(sem.subjects) || sem.subjects.length === 0) {
        return `Subjects required for semester ${sem.semesterNum}.`;
      }
  
      for (let j = 0; j < sem.subjects.length; j++) {
        const sub = sem.subjects[j];
        if (!sub.subjectName || !sub.subjectName.trim()) {
          return `Subject name missing in semester ${sem.semesterNum}, subject ${j + 1}.`;
        }
        if (!sub.code || !sub.code.trim()) {
          return `Subject code missing in semester ${sem.semesterNum}, subject ${j + 1}.`;
        }
      }
    }
  
    return null;
  };
  
  // Validate adding a single semester only
  export const validateSemester = (semesterNum, courseId) => {
    if (!semesterNum || isNaN(semesterNum)) {
      return "Semester number must be a valid number.";
    }
    if (!courseId || isNaN(courseId)) {
      return "Valid courseId is required.";
    }
    return null;
  };
  
  // Validate semester with subjects
  export const validateSemesterWithSubjects = (courseId, semesterNum, subjects) => {
    if (!courseId || isNaN(courseId)) return "Valid courseId is required.";
    if (!semesterNum || isNaN(semesterNum)) return "Valid semesterNum is required.";
    if (!Array.isArray(subjects) || subjects.length === 0) return "At least one subject is required.";
  
    for (let i = 0; i < subjects.length; i++) {
      const sub = subjects[i];
      if (!sub.subjectName || !sub.subjectName.trim()) {
        return `Subject name missing in subject ${i + 1}.`;
      }
      if (!sub.code || !sub.code.trim()) {
        return `Subject code missing in subject ${i + 1}.`;
      }
    }
  
    return null;
  };
  
  // validation.js

export const validateBenchData = (data) => {
  const errors = [];

  if (data.roomId === undefined || isNaN(Number(data.roomId))) {
    errors.push("roomId is required and must be a number.");
  }
  if (data.benchNo === undefined || isNaN(Number(data.benchNo))) {
    errors.push("benchNo is required and must be a number.");
  }
  if (data.row === undefined || isNaN(Number(data.row))) {
    errors.push("row is required and must be a number.");
  }
  if (data.column === undefined || isNaN(Number(data.column))) {
    errors.push("column is required and must be a number.");
  }
  if (data.capacity === undefined || isNaN(Number(data.capacity))) {
    errors.push("capacity is required and must be a number.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
