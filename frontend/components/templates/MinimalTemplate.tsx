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
  isEditing?: boolean;
  onUpdateResume?: (data: ResumeData) => void;
  onUpdateEnhanced?: (data: EnhancedData) => void;
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

export default function MinimalTemplate({ resumeData, enhancedData, isEditing, onUpdateResume, onUpdateEnhanced }: Props) {
  const info = resumeData.personal_info;

  const updateInfo = (field: string, value: string) => {
    onUpdateResume?.({ ...resumeData, personal_info: { ...resumeData.personal_info, [field]: value } });
  };
  const updateEdu = (index: number, field: string, value: string) => {
    const newEdu = [...resumeData.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onUpdateResume?.({ ...resumeData, education: newEdu });
  };
  const updateExp = (index: number, field: string, value: string) => {
    const newExp = [...enhancedData.enhanced_experience];
    newExp[index] = { ...newExp[index], [field]: value };
    onUpdateEnhanced?.({ ...enhancedData, enhanced_experience: newExp });
  };
  const updateExpBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const newExp = [...enhancedData.enhanced_experience];
    const newBullets = [...newExp[expIndex].bullets];
    newBullets[bulletIndex] = value;
    newExp[expIndex] = { ...newExp[expIndex], bullets: newBullets };
    onUpdateEnhanced?.({ ...enhancedData, enhanced_experience: newExp });
  };
  const updateProj = (index: number, field: string, value: string) => {
    const newProj = [...enhancedData.enhanced_projects];
    newProj[index] = { ...newProj[index], [field]: value };
    onUpdateEnhanced?.({ ...enhancedData, enhanced_projects: newProj });
  };

  const EditableText = ({ value, onSave, className, Tag = "span" }: any) => (
    <Tag
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={(e: any) => onSave(e.currentTarget.textContent || "")}
      className={`${className || ""} ${isEditing ? "outline-none ring-1 ring-gray-400 hover:bg-gray-100 rounded-sm cursor-text min-w-[10px] inline-block px-0.5" : ""}`}
    >
      {value}
    </Tag>
  );

  return (
    <div style={{ fontFamily: "'Times New Roman', serif", minHeight: "297mm" }}>
      {/* Header */}
      <div className="mb-6">
        <EditableText Tag="h1" value={info.full_name} onSave={(v:string) => updateInfo("full_name",v)} className="text-4xl font-normal text-black tracking-tight inline-block" />
        {resumeData.job_title && (
          <EditableText Tag="p" value={resumeData.job_title} onSave={(v:string) => onUpdateResume?.({...resumeData, job_title: v})} className="text-sm text-gray-500 mt-1 block" />
        )}
        <div className="flex flex-wrap gap-x-3 text-xs text-gray-600 mt-2 border-t border-gray-300 pt-2">
          <EditableText value={info.email} onSave={(v:string) => updateInfo("email",v)} />
          <span>|</span>
          <EditableText value={info.phone} onSave={(v:string) => updateInfo("phone",v)} />
          <span>|</span>
          <EditableText value={info.location} onSave={(v:string) => updateInfo("location",v)} />
          {info.linkedin && <><span>|</span><EditableText value={info.linkedin} onSave={(v:string) => updateInfo("linkedin",v)} /></>}
          {info.website && <><span>|</span><EditableText value={info.website} onSave={(v:string) => updateInfo("website",v)} /></>}
        </div>
      </div>

      {/* Summary */}
      {enhancedData.professional_summary && (
        <section>
          <Section title="Summary" />
           <EditableText Tag="p" value={enhancedData.professional_summary} onSave={(v: string) => onUpdateEnhanced?.({ ...enhancedData, professional_summary: v })} className="text-sm text-gray-800 leading-relaxed block" />
        </section>
      )}

      {/* Experience */}
      {enhancedData.enhanced_experience.length > 0 && (
        <section>
          <Section title="Experience" />
          {enhancedData.enhanced_experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <EditableText Tag="span" value={exp.role} onSave={(v: string) => updateExp(i, "role", v)} className="text-sm font-bold text-black" />
                <span className="text-xs text-gray-500">
                  <EditableText value={exp.start_date} onSave={(v: string) => updateExp(i, "start_date", v)} />
                  {" – "}
                  <EditableText value={exp.end_date} onSave={(v: string) => updateExp(i, "end_date", v)} />
                </span>
              </div>
              <EditableText Tag="p" value={exp.company} onSave={(v: string) => updateExp(i, "company", v)} className="text-xs text-gray-500 mb-1 block" />
              <ul className="space-y-0.5">
                {exp.bullets.map((bullet, j) => (
                  <li key={j} className="text-sm text-gray-800 flex gap-2">
                    <span className="mt-0.5">—</span>
                    <EditableText Tag="span" value={bullet} onSave={(v: string) => updateExpBullet(i, j, v)} className="flex-1" />
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
                <span className="text-sm font-bold text-black">
                  <EditableText value={edu.degree} onSave={(v: string) => updateEdu(i, "degree", v)} />
                  {" in "}
                  <EditableText value={edu.field} onSave={(v: string) => updateEdu(i, "field", v)} />
                </span>
                <span className="text-sm text-gray-600">
                  {", "}
                  <EditableText value={edu.institution} onSave={(v: string) => updateEdu(i, "institution", v)} />
                </span>
                {edu.gpa && <span className="text-xs text-gray-500"> · <EditableText value={edu.gpa} onSave={(v: string) => updateEdu(i, "gpa", v)} /></span>}
              </div>
              <span className="text-xs text-gray-500">
                <EditableText Tag="span" value={edu.graduation_year} onSave={(v: string) => updateEdu(i, "graduation_year", v)} />
              </span>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section>
          <Section title="Skills" />
          <p className="text-sm text-gray-800">
            {resumeData.skills.map((skill, i) => (
              <span key={i}>
                {i > 0 && "  ·  "}
                <EditableText 
                  value={skill} 
                  onSave={(v: string) => {
                    const newSkills = [...resumeData.skills];
                    newSkills[i] = v;
                    onUpdateResume?.({ ...resumeData, skills: newSkills });
                  }} 
                />
              </span>
            ))}
          </p>
        </section>
      )}

      {/* Projects */}
      {enhancedData.enhanced_projects.length > 0 && (
        <section>
          <Section title="Projects" />
          {enhancedData.enhanced_projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <EditableText Tag="span" value={proj.name} onSave={(v: string) => updateProj(i, "name", v)} className="text-sm font-bold text-black" />
              <span className="text-xs text-gray-500 ml-2">(<EditableText value={proj.technologies} onSave={(v: string) => updateProj(i, "technologies", v)} />)</span>
              <EditableText Tag="p" value={proj.description} onSave={(v: string) => updateProj(i, "description", v)} className="text-sm text-gray-800 mt-0.5 block" />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
