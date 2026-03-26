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

function Section({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest whitespace-nowrap">
        {title}
      </h2>
      <div className="flex-1 h-px bg-emerald-200" />
    </div>
  );
}

export default function ModernTemplate({ resumeData, enhancedData }: Props) {
  const info = resumeData.personal_info;

  return (
    <div style={{ fontFamily: "'Arial', sans-serif", minHeight: "297mm" }}>
      {/* Dark Header Band */}
      <div className="bg-gray-900 text-white px-8 py-6 -mx-10 -mt-10 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{info.full_name}</h1>
        {resumeData.job_title && (
          <p className="text-emerald-400 text-sm font-medium mt-1 uppercase tracking-widest">
            {resumeData.job_title}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-300 text-xs mt-3">
          <span>{info.email}</span>
          <span>{info.phone}</span>
          <span>{info.location}</span>
          {info.linkedin && <span className="text-emerald-400">{info.linkedin}</span>}
          {info.website && <span className="text-emerald-400">{info.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {enhancedData.professional_summary && (
        <section className="mb-6">
          <Section title="Professional Summary" />
          <p className="text-sm text-gray-700 leading-relaxed">{enhancedData.professional_summary}</p>
        </section>
      )}

      {/* Experience */}
      {enhancedData.enhanced_experience.length > 0 && (
        <section className="mb-6">
          <Section title="Work Experience" />
          {enhancedData.enhanced_experience.map((exp, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{exp.role}</h3>
                  <p className="text-emerald-700 text-xs font-semibold">{exp.company}</p>
                </div>
                <span className="text-xs text-white bg-gray-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {exp.start_date} – {exp.end_date}
                </span>
              </div>
              <ul className="mt-2 space-y-1">
                {exp.bullets.map((bullet, j) => (
                  <li key={j} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-emerald-500 font-bold mt-0.5">›</span>
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
          <Section title="Education" />
          {resumeData.education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline mb-3">
              <div>
                <p className="font-bold text-sm text-gray-900">{edu.degree} in {edu.field}</p>
                <p className="text-xs text-gray-500">{edu.institution}{edu.gpa && ` · GPA: ${edu.gpa}`}</p>
              </div>
              <span className="text-xs text-white bg-gray-700 px-2 py-0.5 rounded-full">
                {edu.graduation_year}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section className="mb-6">
          <Section title="Skills" />
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {enhancedData.enhanced_projects.length > 0 && (
        <section className="mb-6">
          <Section title="Projects" />
          {enhancedData.enhanced_projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-gray-900">{proj.name}</h3>
                <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {proj.technologies}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{proj.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
