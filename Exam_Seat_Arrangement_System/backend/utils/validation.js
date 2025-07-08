export const validateCoursePayload = (name, duration, semesters) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return 'Course name is required and must be a non-empty string';
    }
  
    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      return 'Duration must be a valid positive number';
    }
  
    if (!Array.isArray(semesters) || semesters.length === 0) {
      return 'Semesters must be a non-empty array';
    }
  
    for (let i = 0; i < semesters.length; i++) {
      const sem = semesters[i];
  
      if (
        sem.semesterNum === undefined ||
        isNaN(Number(sem.semesterNum)) ||
        Number(sem.semesterNum) <= 0
      ) {
        return `Semester #${i + 1} must have a valid positive number as semesterNum`;
      }
  
      if (!Array.isArray(sem.subjects) || sem.subjects.length === 0) {
        return `Semester #${i + 1} must have at least one subject`;
      }
  
      for (let j = 0; j < sem.subjects.length; j++) {
        const subject = sem.subjects[j];
  
        if (
          !subject.subjectName ||
          typeof subject.subjectName !== 'string' ||
          subject.subjectName.trim() === ''
        ) {
          return `Subject #${j + 1} in Semester #${i + 1} must have a valid subjectName`;
        }
  
        if (
          !subject.code ||
          typeof subject.code !== 'string' ||
          subject.code.trim() === ''
        ) {
          return `Subject #${j + 1} in Semester #${i + 1} must have a valid code`;
        }
      }
    }
  
    return null; // No validation errors
  };
  