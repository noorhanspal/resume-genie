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
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest whitespace-nowrap">
        {title}
      </h2>
      <div className="flex-1 h-px bg-emerald-200" />
    </div>
  );
}

export default function ModernTemplate({ resumeData, enhancedData, isEditing, onUpdateResume, onUpdateEnhanced }: Props) {
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
      className={`${className || ""} ${isEditing ? "outline-none ring-1 ring-emerald-400 hover:bg-emerald-500/20 rounded-sm cursor-text min-w-[10px] inline-block px-0.5" : ""}`}
    >
      {value}
    </Tag>
  );

  return (
    <div style={{ fontFamily: "'Arial', sans-serif", minHeight: "297mm" }}>
      {/* Dark Header Band */}
      <div className="bg-gray-900 text-white px-8 py-6 -mx-10 -mt-10 mb-8">
        <EditableText Tag="h1" value={info.full_name} onSave={(v:string) => updateInfo("full_name",v)} className="text-3xl font-bold tracking-tight inline-block" />
        {resumeData.job_title && (
          <EditableText Tag="p" value={resumeData.job_title} onSave={(v:string) => onUpdateResume?.({...resumeData, job_title: v})} className="text-emerald-400 text-sm font-medium mt-1 uppercase tracking-widest block" />
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-300 text-xs mt-3">
          <EditableText value={info.email} onSave={(v:string) => updateInfo("email",v)} />
          <EditableText value={info.phone} onSave={(v:string) => updateInfo("phone",v)} />
          <EditableText value={info.location} onSave={(v:string) => updateInfo("location",v)} />
          {info.linkedin && <EditableText value={info.linkedin} onSave={(v:string) => updateInfo("linkedin",v)} className="text-emerald-400" />}
          {info.website && <EditableText value={info.website} onSave={(v:string) => updateInfo("website",v)} className="text-emerald-400" />}
        </div>
      </div>

      {/* Summary */}
      {enhancedData.professional_summary && (
        <section className="mb-6">
          <Section title="Professional Summary" />
          <EditableText Tag="p" value={enhancedData.professional_summary} onSave={(v: string) => onUpdateEnhanced?.({ ...enhancedData, professional_summary: v })} className="text-sm text-gray-700 leading-relaxed block" />
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
                  <EditableText Tag="h3" value={exp.role} onSave={(v: string) => updateExp(i, "role", v)} className="font-bold text-gray-900 text-sm block" />
                  <EditableText Tag="p" value={exp.company} onSave={(v: string) => updateExp(i, "company", v)} className="text-emerald-700 text-xs font-semibold block" />
                </div>
                <span className="text-xs text-white bg-gray-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                  <EditableText value={exp.start_date} onSave={(v: string) => updateExp(i, "start_date", v)} />
                  {" – "}
                  <EditableText value={exp.end_date} onSave={(v: string) => updateExp(i, "end_date", v)} />
                </span>
              </div>
              <ul className="mt-2 space-y-1">
                {exp.bullets.map((bullet, j) => (
                  <li key={j} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-emerald-500 font-bold mt-0.5">›</span>
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
        <section className="mb-6">
          <Section title="Education" />
          {resumeData.education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline mb-3">
              <div>
                <p className="font-bold text-sm text-gray-900 block">
                  <EditableText value={edu.degree} onSave={(v: string) => updateEdu(i, "degree", v)} />
                  {" in "}
                  <EditableText value={edu.field} onSave={(v: string) => updateEdu(i, "field", v)} />
                </p>
                <p className="text-xs text-gray-500 block">
                  <EditableText value={edu.institution} onSave={(v: string) => updateEdu(i, "institution", v)} />
                  {edu.gpa && <span>{` · GPA: `}<EditableText value={edu.gpa} onSave={(v: string) => updateEdu(i, "gpa", v)} /></span>}
                </p>
              </div>
              <span className="text-xs text-white bg-gray-700 px-2 py-0.5 rounded-full">
                <EditableText Tag="span" value={edu.graduation_year} onSave={(v: string) => updateEdu(i, "graduation_year", v)} />
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
            {resumeData.skills.map((skill, i) => (
              <span
                key={i}
                className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded flex"
              >
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
                <EditableText Tag="h3" value={proj.name} onSave={(v: string) => updateProj(i, "name", v)} className="font-bold text-sm text-gray-900 block" />
                <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  <EditableText value={proj.technologies} onSave={(v: string) => updateProj(i, "technologies", v)} />
                </span>
              </div>
              <EditableText Tag="p" value={proj.description} onSave={(v: string) => updateProj(i, "description", v)} className="text-sm text-gray-700 mt-1 block" />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
