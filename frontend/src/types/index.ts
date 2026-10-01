export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'instructor' | 'admin' | 'organization_admin';
  licenseType?: 'RN' | 'LPN' | 'None';
  licenseNumber?: string;
  organizationId?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  moduleOrder: number;
  estimatedDurationMinutes: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  isRequired: boolean;
  isPublished: boolean;
  learningObjectives: string[];
  createdAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progressPercentage: number;
  timeSpentMinutes: number;
  startedAt?: string;
  completedAt?: string;
  lastAccessedAt: string;
}

export interface Assessment {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  assessmentType: 'quiz' | 'exam' | 'practical' | 'scenario';
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes?: number;
  isRequired: boolean;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  attemptNumber: number;
  score: number;
  passed: boolean;
  timeSpentMinutes: number;
  startedAt: string;
  submittedAt: string;
  answers: Record<string, any>;
}

export interface Certification {
  id: string;
  userId: string;
  certificationType: string;
  issueDate: string;
  expirationDate: string;
  certificateNumber: string;
  status: 'active' | 'expired' | 'revoked' | 'suspended';
  verificationCode: string;
}

export interface DashboardStats {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  totalAssessments: number;
  passedAssessments: number;
  certifications: number;
  averageScore: number;
  totalTimeSpent: number;
}
