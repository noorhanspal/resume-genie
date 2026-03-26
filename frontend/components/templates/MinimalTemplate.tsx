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
    <div className="mt-5 mb-3">
      <h2 className="text-xs font-bold text-black uppercase tracking-[0.2em] border-b border-black pb-1">
        {title}
      </h2>
    </div>
  );
}

export default function MinimalTemplate({ resumeData, enhancedData }: Props) {
  const info = resumeData.personal_info;

  return (
    <div style={{ fontFamily: "'Times New Roman', serif", minHeight: "297mm" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-normal text-black tracking-tight">{info.full_name}</h1>
        {resumeData.job_title && (
          <p className="text-sm text-gray-500 mt-1">{resumeData.job_title}</p>
        )}
        <div className="flex flex-wrap gap-x-3 text-xs text-gray-600 mt-2 border-t border-gray-300 pt-2">
          <span>{info.email}</span>
          <span>|</span>
          <span>{info.phone}</span>
          <span>|</span>
          <span>{info.location}</span>
          {info.linkedin && <><span>|</span><span>{info.linkedin}</span></>}
          {info.website && <><span>|</span><span>{info.website}</span></>}
        </div>
      </div>

      {/* Summary */}
      {enhancedData.professional_summary && (
        <section>
          <Section title="Summary" />
          <p className="text-sm text-gray-800 leading-relaxed">{enhancedData.professional_summary}</p>
        </section>
      )}

      {/* Experience */}
      {enhancedData.enhanced_experience.length > 0 && (
        <section>
          <Section title="Experience" />
          {enhancedData.enhanced_experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-black">{exp.role}</span>
                <span className="text-xs text-gray-500">{exp.start_date} – {exp.end_date}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{exp.company}</p>
              <ul className="space-y-0.5">
                {exp.bullets.map((bullet, j) => (
                  <li key={j} className="text-sm text-gray-800 flex gap-2">
                    <span className="mt-0.5">—</span>
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
        <section>
          <Section title="Education" />
          {resumeData.education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline mb-2">
              <div>
                <span className="text-sm font-bold text-black">{edu.degree} in {edu.field}</span>
                <span className="text-sm text-gray-600">, {edu.institution}</span>
                {edu.gpa && <span className="text-xs text-gray-500"> · {edu.gpa}</span>}
              </div>
              <span className="text-xs text-gray-500">{edu.graduation_year}</span>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section>
          <Section title="Skills" />
          <p className="text-sm text-gray-800">{resumeData.skills.join("  ·  ")}</p>
        </section>
      )}

      {/* Projects */}
      {enhancedData.enhanced_projects.length > 0 && (
        <section>
          <Section title="Projects" />
          {enhancedData.enhanced_projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <span className="text-sm font-bold text-black">{proj.name}</span>
              <span className="text-xs text-gray-500 ml-2">({proj.technologies})</span>
              <p className="text-sm text-gray-800 mt-0.5">{proj.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
