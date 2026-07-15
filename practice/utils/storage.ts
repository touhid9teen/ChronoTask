import type { PracticeData } from "../types";

const STORAGE_KEY = "practiceExamData";

export function loadPracticeData(): PracticeData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: PracticeData = JSON.parse(stored);
      return {
        exams: data.exams || [],
        sessions: data.sessions || [],
        results: data.results || [],
      };
    }
  } catch (err) {
    console.error("Failed to parse practice exam data from localStorage", err);
  }
  return { exams: [], sessions: [], results: [] };
}

export function savePracticeData(data: PracticeData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save practice exam data to localStorage", err);
  }
}

export function clearPracticeData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
