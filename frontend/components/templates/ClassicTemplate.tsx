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
  isEditing?: boolean;
  onUpdateResume?: (data: ResumeData) => void;
  onUpdateEnhanced?: (data: EnhancedData) => void;
}

export default function ClassicTemplate({ resumeData, enhancedData, isEditing, onUpdateResume, onUpdateEnhanced }: Props) {
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
      className={`${className || ""} ${isEditing ? "outline-none ring-1 ring-blue-300 hover:bg-blue-50/50 rounded-sm cursor-text min-w-[10px] inline-block px-0.5" : ""}`}
    >
      {value}
    </Tag>
  );

  return (
    <div style={{ fontFamily: "Georgia, serif", minHeight: "297mm" }}>
      {/* Header */}
      <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
        <EditableText Tag="h1" value={info.full_name} onSave={(v: string) => updateInfo("full_name", v)} className="text-3xl font-bold text-gray-900" />
        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600 mt-2">
          <EditableText value={info.email} onSave={(v: string) => updateInfo("email", v)} />
          <span>·</span>
          <EditableText value={info.phone} onSave={(v: string) => updateInfo("phone", v)} />
          <span>·</span>
          <EditableText value={info.location} onSave={(v: string) => updateInfo("location", v)} />
          {info.linkedin && <><span>·</span><EditableText value={info.linkedin} onSave={(v: string) => updateInfo("linkedin", v)} className="text-blue-600" /></>}
          {info.website && <><span>·</span><EditableText value={info.website} onSave={(v: string) => updateInfo("website", v)} className="text-blue-600" /></>}
        </div>
      </div>

      {/* Summary */}
      {enhancedData.professional_summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">
            Professional Summary
          </h2>
          <EditableText Tag="p" value={enhancedData.professional_summary} onSave={(v: string) => onUpdateEnhanced?.({ ...enhancedData, professional_summary: v })} className="text-sm text-gray-700 leading-relaxed" />
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
                <EditableText Tag="h3" value={exp.role} onSave={(v: string) => updateExp(i, "role", v)} className="font-bold text-gray-900 text-sm" />
                <span className="text-xs text-gray-500">
                  <EditableText value={exp.start_date} onSave={(v: string) => updateExp(i, "start_date", v)} />
                  {" – "}
                  <EditableText value={exp.end_date} onSave={(v: string) => updateExp(i, "end_date", v)} />
                </span>
              </div>
              <EditableText Tag="p" value={exp.company} onSave={(v: string) => updateExp(i, "company", v)} className="text-sm text-gray-600 mb-2 italic block" />
              <ul className="space-y-1">
                {exp.bullets.map((bullet, j) => (
                  <li key={j} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
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
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">
            Education
          </h2>
          {resumeData.education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline mb-2">
              <div>
                <span className="font-bold text-sm text-gray-900">
                  <EditableText value={edu.degree} onSave={(v: string) => updateEdu(i, "degree", v)} />
                  {" in "}
                  <EditableText value={edu.field} onSave={(v: string) => updateEdu(i, "field", v)} />
                </span>
                <span className="text-gray-600 text-sm">
                  {" — "}
                  <EditableText value={edu.institution} onSave={(v: string) => updateEdu(i, "institution", v)} />
                </span>
                {edu.gpa && <span className="text-gray-500 text-xs ml-2">GPA: <EditableText value={edu.gpa} onSave={(v: string) => updateEdu(i, "gpa", v)} /></span>}
              </div>
              <EditableText Tag="span" value={edu.graduation_year} onSave={(v: string) => updateEdu(i, "graduation_year", v)} className="text-xs text-gray-500" />
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
            {resumeData.skills.map((skill, i) => (
              <Badge key={i} className="bg-blue-50 text-blue-800 border border-blue-200 text-xs">
                <EditableText 
                  value={skill} 
                  onSave={(v: string) => {
                    const newSkills = [...resumeData.skills];
                    newSkills[i] = v;
                    onUpdateResume?.({ ...resumeData, skills: newSkills });
                  }} 
                />
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
              <EditableText Tag="h3" value={proj.name} onSave={(v: string) => updateProj(i, "name", v)} className="font-bold text-sm text-gray-900 block" />
              <p className="text-xs text-gray-500 mb-1">Tech: <EditableText value={proj.technologies} onSave={(v: string) => updateProj(i, "technologies", v)} /></p>
              <EditableText Tag="p" value={proj.description} onSave={(v: string) => updateProj(i, "description", v)} className="text-sm text-gray-700 block" />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
