export interface Submission {
  id: string;
  baseModel: string;
  solutionName: string;
  versionTag: string;
  source: string;
  registryUrl: string;
  isPublic: boolean;
  telemetry: boolean;
  status: "QUEUED" | "RUNNING" | "PASSED" | "FAILED";
  submittedAt: string;
  completedAt?: string;
}

const STORAGE_KEY = "npuhub_submissions";

export function getSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addSubmission(s: Submission): void {
  const list = getSubmissions();
  list.unshift(s);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getSubmissionById(id: string): Submission | undefined {
  return getSubmissions().find((s) => s.id === id);
}
