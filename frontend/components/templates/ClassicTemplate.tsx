import { Badge } from "@/components/ui/badge";
import { ResumeData } from "@/lib/types";

interface EnhancedExperience {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  bullets: string[];
}

interface EnhancedProject {
  name: string;
  description: string;
  technologies: string;
}

interface EnhancedData {
  professional_summary: string;
  enhanced_experience: EnhancedExperience[];
  enhanced_projects: EnhancedProject[];
}

interface Props {
  resumeData: ResumeData;
  enhancedData: EnhancedData;
}

export default function ClassicTemplate({ resumeData, enhancedData }: Props) {
  const info = resumeData.personal_info;

  return (
    <div style={{ fontFamily: "Georgia, serif", minHeight: "297mm" }}>
      {/* Header */}
      <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{info.full_name}</h1>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600 mt-2">
          <span>{info.email}</span>
          <span>·</span>
          <span>{info.phone}</span>
          <span>·</span>
          <span>{info.location}</span>
          {info.linkedin && <><span>·</span><span className="text-blue-600">{info.linkedin}</span></>}
          {info.website && <><span>·</span><span className="text-blue-600">{info.website}</span></>}
        </div>
      </div>

      {/* Summary */}
      {enhancedData.professional_summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{enhancedData.professional_summary}</p>
        </section>
      )}

      {/* Experience */}
      {enhancedData.enhanced_experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">
            Work Experience
          </h2>
          {enhancedData.enhanced_experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900 text-sm">{exp.role}</h3>
                <span className="text-xs text-gray-500">{exp.start_date} – {exp.end_date}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2 italic">{exp.company}</p>
              <ul className="space-y-1">
                {exp.bullets.map((bullet, j) => (
                  <li key={j} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">
            Education
          </h2>
          {resumeData.education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline mb-2">
              <div>
                <span className="font-bold text-sm text-gray-900">{edu.degree} in {edu.field}</span>
                <span className="text-gray-600 text-sm"> — {edu.institution}</span>
                {edu.gpa && <span className="text-gray-500 text-xs ml-2">GPA: {edu.gpa}</span>}
              </div>
              <span className="text-xs text-gray-500">{edu.graduation_year}</span>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
              <Badge key={skill} className="bg-blue-50 text-blue-800 border border-blue-200 text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {enhancedData.enhanced_projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">
            Projects
          </h2>
          {enhancedData.enhanced_projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-bold text-sm text-gray-900">{proj.name}</h3>
              <p className="text-xs text-gray-500 mb-1">Tech: {proj.technologies}</p>
              <p className="text-sm text-gray-700">{proj.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
