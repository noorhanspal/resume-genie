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

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 leading-tight">
        {title}
      </h2>
      <hr className="border-t-[1.5px] border-black mt-0.5" />
    </div>
  );
}

export default function ProfessionalTemplate({ resumeData, enhancedData, isEditing, onUpdateResume, onUpdateEnhanced }: Props) {
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
      className={`${className || ""} ${isEditing ? "outline-none ring-1 ring-gray-300 hover:bg-gray-100 rounded-sm cursor-text inline-block min-w-[10px] px-0.5" : ""}`}
    >
      {value}
    </Tag>
  );

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", maxWidth: "210mm", margin: "0 auto", padding: "10mm" }} className="text-gray-900 bg-white">
      {/* Header */}
      <div className="text-center mb-4">
        <EditableText 
          Tag="h1" 
          value={info.full_name} 
          onSave={(v:string) => updateInfo("full_name",v)} 
          className="text-[26px] font-bold uppercase tracking-wider block leading-tight text-black" 
        />
        <div className="flex flex-wrap justify-center items-center gap-x-2 text-[13px] mt-1 text-gray-800">
          <EditableText value={info.location} onSave={(v:string) => updateInfo("location",v)} />
          <span className="text-gray-400 font-bold">|</span>
          <EditableText value={info.phone} onSave={(v:string) => updateInfo("phone",v)} />
          <span className="text-gray-400 font-bold">|</span>
          <EditableText value={info.email} onSave={(v:string) => updateInfo("email",v)} />
          {info.linkedin && (
            <>
              <span className="text-gray-400 font-bold">|</span>
              <a href={info.linkedin} className="text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">
                <EditableText value="LinkedIn" onSave={(v:string) => updateInfo("linkedin",v)} className="text-black inline" />
              </a>
            </>
          )}
          {info.website && (
            <>
              <span className="text-gray-400 font-bold">|</span>
              <a href={info.website} className="text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">
                <EditableText value="Portfolio" onSave={(v:string) => updateInfo("website",v)} className="text-black inline" />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <section className="mb-4">
          <SectionHeading title="Education" />
          {resumeData.education.map((edu, i) => (
            <div key={i} className="mb-1 text-[13px]">
              <div className="flex justify-between items-baseline">
                <EditableText Tag="div" value={edu.institution} onSave={(v: string) => updateEdu(i, "institution", v)} className="font-bold block" />
                <EditableText Tag="div" value={edu.graduation_year} onSave={(v: string) => updateEdu(i, "graduation_year", v)} className="text-right" />
              </div>
              <div className="flex justify-between items-baseline">
                <div>
                  <EditableText value={edu.degree} onSave={(v: string) => updateEdu(i, "degree", v)} className="italic" />
                  {" in "}
                  <EditableText value={edu.field} onSave={(v: string) => updateEdu(i, "field", v)} className="italic" />
                </div>
                {edu.gpa && <span><EditableText value={edu.gpa} onSave={(v: string) => updateEdu(i, "gpa", v)} /> SGPA</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {enhancedData.enhanced_experience && enhancedData.enhanced_experience.length > 0 && (
        <section className="mb-4">
          <SectionHeading title="Experience" />
          {enhancedData.enhanced_experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline text-[13px]">
                <EditableText Tag="div" value={exp.company} onSave={(v: string) => updateExp(i, "company", v)} className="font-bold block text-[14px]" />
              </div>
              <div className="flex justify-between items-baseline text-[13px] mb-1">
                <EditableText Tag="div" value={exp.role} onSave={(v: string) => updateExp(i, "role", v)} className="italic text-gray-800 block" />
                <div className="italic text-right text-gray-800">
                  <EditableText value={exp.start_date} onSave={(v: string) => updateExp(i, "start_date", v)} />
                  {" – "}
                  <EditableText value={exp.end_date} onSave={(v: string) => updateExp(i, "end_date", v)} />
                </div>
              </div>
              <ul className="list-none space-y-1 mt-1 ml-4 text-[13px] text-gray-800">
                {exp.bullets.map((bullet, j) => (
                  <li key={j} className="relative pl-3">
                    <span className="absolute left-[-12px] top-[4px] w-1 h-1 rounded-full bg-black"></span>
                    <EditableText Tag="span" value={bullet} onSave={(v: string) => updateExpBullet(i, j, v)} className="block w-full text-justify leading-tight" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {enhancedData.enhanced_projects && enhancedData.enhanced_projects.length > 0 && (
        <section className="mb-4">
          <SectionHeading title="Projects" />
          {enhancedData.enhanced_projects.map((proj, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-baseline gap-2 mb-1 text-[13px]">
                <EditableText Tag="span" value={proj.name} onSave={(v: string) => updateProj(i, "name", v)} className="font-bold uppercase inline" />
                <span className="text-blue-800 text-[12px] underline">
                   GitHub
                </span>
              </div>
              <ul className="list-none ml-4 text-[13px] text-gray-800">
                <li className="relative pl-3">
                  <span className="absolute left-[-12px] top-[4px] w-1 h-1 rounded-full bg-black"></span>
                  <EditableText Tag="span" value={proj.description} onSave={(v: string) => updateProj(i, "description", v)} className="flex-1 text-justify leading-tight" />
                </li>
              </ul>
              {proj.technologies && (
                <div className="ml-7 mt-1 text-[12px] text-gray-700 font-semibold">
                  <EditableText value={`Technologies: ${proj.technologies}`} onSave={(v: string) => updateProj(i, "technologies", v.replace("Technologies: ", ""))} />
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Technical Skills and Interests */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <section className="mb-4">
          <SectionHeading title="Technical Skills and Interests" />
          <div className="text-[13px] leading-relaxed">
            <span className="font-bold">Skills: </span>
            <EditableText 
              value={resumeData.skills.join(", ")} 
              onSave={(v: string) => {
                onUpdateResume?.({ ...resumeData, skills: v.split(",").map(s => s.trim()) });
              }} 
            />
          </div>
        </section>
      )}

    </div>
  );
}
