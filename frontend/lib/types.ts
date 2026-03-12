export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  responsibilities: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduation_year: string;
  gpa: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface ResumeData {
  personal_info: PersonalInfo;
  work_experience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  job_title: string;
}
