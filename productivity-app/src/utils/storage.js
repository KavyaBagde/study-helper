const STORAGE_KEY = "productivity_subjects";

export function loadSubjects() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveSubjects(subjects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}
