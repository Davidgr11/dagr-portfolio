'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploader } from '@/components/admin/FileUploader';

interface Education {
  id?: string;
  order: number;
  level_en: string;
  level_es: string | null;
  status: 'studying' | 'graduated' | 'incomplete' | 'in-progress';
  degree_en: string;
  degree_es: string | null;
  institution_en: string;
  institution_es: string | null;
  start_date: string;
  end_date: string | null;
  gpa: string | null;
  show_gpa: boolean;
  subjects_en: string[] | null;
  subjects_es: string[] | null;
  logo_url: string | null;
  is_visible: boolean;
}

interface EducationItemProps {
  edu: Education;
  index: number;
  onUpdate: (index: number, field: keyof Education, value: Education[keyof Education]) => void;
  onSave: (edu: Education) => Promise<boolean>;
  onDelete: (id: string) => void;
  newSubjectEn: string;
  newSubjectEs: string;
  onNewSubjectEnChange: (value: string) => void;
  onNewSubjectEsChange: (value: string) => void;
  onAddSubjectEn: () => void;
  onAddSubjectEs: () => void;
  onRemoveSubjectEn: (subIndex: number) => void;
  onRemoveSubjectEs: (subIndex: number) => void;
}

function EducationItem({
  edu,
  index,
  onUpdate,
  onSave,
  onDelete,
  newSubjectEn,
  newSubjectEs,
  onNewSubjectEnChange,
  onNewSubjectEsChange,
  onAddSubjectEn,
  onAddSubjectEs,
  onRemoveSubjectEn,
  onRemoveSubjectEs,
}: EducationItemProps) {
  const [isExpanded, setIsExpanded] = useState(!edu.id); // Expand if new
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave(edu);
    setSaving(false);
  }

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Title and Status */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <CardTitle className="text-base md:text-lg truncate">
              {edu.degree_en || 'New Education Entry'}
            </CardTitle>
            {!edu.is_visible && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded flex-shrink-0">
                Hidden
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdate(index, 'is_visible', !edu.is_visible)}
              title={edu.is_visible ? 'Hide' : 'Show'}
              className="h-8 w-8 p-0"
            >
              {edu.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            {edu.id && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(edu.id!)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Status *</Label>
              <select
                value={edu.status}
                onChange={(e) => onUpdate(index, 'status', e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="graduated">Graduated</option>
                <option value="studying">Studying</option>
                <option value="in-progress">In Progress</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Level (English) *</Label>
              <select
                value={edu.level_en}
                onChange={(e) => onUpdate(index, 'level_en', e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="High School">High School</option>
                <option value="Technical Degree">Technical Degree</option>
                <option value="Associate's Degree">Associate's Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctorate (PhD)">Doctorate (PhD)</option>
                <option value="Professional Degree">Professional Degree</option>
                <option value="Specialization">Specialization</option>
                <option value="Certificate">Certificate</option>
                <option value="Diploma">Diploma</option>
                <option value="Bootcamp">Bootcamp</option>
              </select>
            </div>
            <div>
              <Label>Nivel (Español)</Label>
              <select
                value={edu.level_es || ''}
                onChange={(e) => onUpdate(index, 'level_es', e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="Preparatoria">Preparatoria</option>
                <option value="Carrera Técnica">Carrera Técnica</option>
                <option value="Técnico Superior">Técnico Superior</option>
                <option value="Licenciatura">Licenciatura</option>
                <option value="Maestría">Maestría</option>
                <option value="Doctorado">Doctorado</option>
                <option value="Título Profesional">Título Profesional</option>
                <option value="Especialización">Especialización</option>
                <option value="Certificado">Certificado</option>
                <option value="Diplomado">Diplomado</option>
                <option value="Bootcamp">Bootcamp</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Degree (English) *</Label>
              <Input
                value={edu.degree_en}
                onChange={(e) => onUpdate(index, 'degree_en', e.target.value)}
                placeholder="Computer Science"
                required
              />
            </div>
            <div>
              <Label>Degree (Spanish)</Label>
              <Input
                value={edu.degree_es || ''}
                onChange={(e) => onUpdate(index, 'degree_es', e.target.value)}
                placeholder="Ciencias de la Computación"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Institution (English) *</Label>
              <Input
                value={edu.institution_en}
                onChange={(e) => onUpdate(index, 'institution_en', e.target.value)}
                placeholder="University Name"
                required
              />
            </div>
            <div>
              <Label>Institution (Spanish)</Label>
              <Input
                value={edu.institution_es || ''}
                onChange={(e) => onUpdate(index, 'institution_es', e.target.value)}
                placeholder="Nombre de la Universidad"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Date *</Label>
              <Input
                type="date"
                value={edu.start_date}
                onChange={(e) => onUpdate(index, 'start_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={edu.end_date || ''}
                onChange={(e) => onUpdate(index, 'end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>GPA</Label>
              <Input
                value={edu.gpa || ''}
                onChange={(e) => onUpdate(index, 'gpa', e.target.value)}
                placeholder="3.8"
              />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id={`show-gpa-${index}`}
                checked={edu.show_gpa}
                onChange={(e) => onUpdate(index, 'show_gpa', e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor={`show-gpa-${index}`}>Show GPA</Label>
            </div>
          </div>

          {/* Subjects - English */}
          <div>
            <Label>Key Subjects (English)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {edu.subjects_en?.map((subject, subIndex) => (
                <span
                  key={subIndex}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => onRemoveSubjectEn(subIndex)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSubjectEn}
                onChange={(e) => onNewSubjectEnChange(e.target.value)}
                placeholder="Add subject..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddSubjectEn())}
              />
              <Button type="button" onClick={onAddSubjectEn}>
                Add
              </Button>
            </div>
          </div>

          {/* Subjects - Spanish */}
          <div>
            <Label>Key Subjects (Spanish)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {edu.subjects_es?.map((subject, subIndex) => (
                <span
                  key={subIndex}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => onRemoveSubjectEs(subIndex)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSubjectEs}
                onChange={(e) => onNewSubjectEsChange(e.target.value)}
                placeholder="Agregar materia..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddSubjectEs())}
              />
              <Button type="button" onClick={onAddSubjectEs}>
                Add
              </Button>
            </div>
          </div>

          {/* Logo */}
          <FileUploader
            label="Institution Logo"
            bucketName="education"
            value={edu.logo_url}
            onChange={(url) => onUpdate(index, 'logo_url', url)}
            fileType="image"
            description="Upload institution logo"
          />

          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Education
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export default function AboutManagement() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [about, setAbout] = useState<{
    id?: string;
    content_en: string;
    content_es: string;
  }>({
    content_en: '',
    content_es: '',
  });
  const [education, setEducation] = useState<Education[]>([]);
  const [newSubjectEn, setNewSubjectEn] = useState<{ [key: number]: string }>({});
  const [newSubjectEs, setNewSubjectEs] = useState<{ [key: number]: string }>({});

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    // Load about - get all rows and use the first one
    const { data: aboutDataArray, error: aboutError } = await supabase
      .from('about')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (aboutError) {
      console.error('Error loading about data:', aboutError);
      toast.error('Error loading about data: ' + aboutError.message);
    } else if (aboutDataArray && aboutDataArray.length > 0) {
      const aboutData = aboutDataArray[0];
      console.log('Loaded about data:', aboutData);
      setAbout(aboutData);
    } else {
      console.log('No about data found');
    }

    // Load education
    const { data: educationData, error: educationError } = await supabase
      .from('education')
      .select('*')
      .order('order', { ascending: true });

    if (educationError) {
      console.error('Error loading education data:', educationError);
      toast.error('Error loading education data: ' + educationError.message);
    } else if (educationData) {
      setEducation(educationData);
    }

    setLoading(false);
  }

  async function handleSaveAbout(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      // Check if any record exists in the database
      const { data: existingData } = await supabase
        .from('about')
        .select('id')
        .limit(1);

      if (existingData && existingData.length > 0) {
        // Update the first existing record
        const updateData = {
          content_en: about.content_en,
          content_es: about.content_es,
        };
        const recordId = (existingData[0] as { id: string }).id;
        const { error } = await supabase
          .from('about')
          .update(updateData as never)
          .eq('id', recordId);

        if (error) {
          console.error('Update error:', error);
          toast.error('Error saving: ' + error.message);
        } else {
          toast.success('About section saved successfully!');
          // Update local state with the id
          setAbout({ ...about, id: recordId });
        }
      } else {
        // No record exists, insert a new one
        const insertData = {
          content_en: about.content_en,
          content_es: about.content_es,
        };
        const { data, error } = await supabase
          .from('about')
          .insert(insertData as never)
          .select()
          .single();

        if (error) {
          console.error('Insert error:', error);
          toast.error('Error saving: ' + error.message);
        } else {
          toast.success('About section saved successfully!');
          if (data) {
            setAbout(data);
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    }

    setSaving(false);
  }

  async function handleSaveEducation(edu: Education) {
    const { error } = await supabase
      .from('education')
      .upsert(edu)
      .select()
      .single();

    if (error) {
      toast.error('Error saving education: ' + error.message);
      return false;
    }

    await loadData();
    return true;
  }

  async function handleDeleteEducation(id: string) {
    if (!window.confirm('Are you sure you want to delete this education entry?')) {
      return;
    }

    const { error } = await supabase.from('education').delete().eq('id', id);

    if (error) {
      toast.error('Error deleting: ' + error.message);
    } else {
      await loadData();
    }
  }

  function addNewEducation() {
    const maxOrder = education.length > 0 ? Math.max(...education.map((e) => e.order)) : 0;
    setEducation([
      ...education,
      {
        order: maxOrder + 1,
        level_en: "Bachelor's Degree",
        level_es: 'Licenciatura',
        status: 'graduated',
        degree_en: '',
        degree_es: null,
        institution_en: '',
        institution_es: null,
        start_date: '',
        end_date: null,
        gpa: null,
        show_gpa: false,
        subjects_en: [],
        subjects_es: [],
        logo_url: null,
        is_visible: true,
      },
    ]);
  }

  function updateEducation(index: number, field: keyof Education, value: Education[keyof Education]) {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  }

  function addSubjectEn(index: number) {
    const subject = newSubjectEn[index]?.trim();
    if (!subject) return;

    const updated = [...education];
    updated[index] = {
      ...updated[index],
      subjects_en: [...(updated[index].subjects_en || []), subject],
    };
    setEducation(updated);
    setNewSubjectEn({ ...newSubjectEn, [index]: '' });
  }

  function addSubjectEs(index: number) {
    const subject = newSubjectEs[index]?.trim();
    if (!subject) return;

    const updated = [...education];
    updated[index] = {
      ...updated[index],
      subjects_es: [...(updated[index].subjects_es || []), subject],
    };
    setEducation(updated);
    setNewSubjectEs({ ...newSubjectEs, [index]: '' });
  }

  function removeSubjectEn(eduIndex: number, subjectIndex: number) {
    const updated = [...education];
    updated[eduIndex] = {
      ...updated[eduIndex],
      subjects_en: updated[eduIndex].subjects_en?.filter((_, i) => i !== subjectIndex) || [],
    };
    setEducation(updated);
  }

  function removeSubjectEs(eduIndex: number, subjectIndex: number) {
    const updated = [...education];
    updated[eduIndex] = {
      ...updated[eduIndex],
      subjects_es: updated[eduIndex].subjects_es?.filter((_, i) => i !== subjectIndex) || [],
    };
    setEducation(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">About & Education</h1>
        <p className="text-muted-foreground mt-2">
          Manage your about section and educational background
        </p>
      </div>

      {/* About Section */}
      <form onSubmit={handleSaveAbout}>
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="content_en">Content (English) *</Label>
              <textarea
                id="content_en"
                value={about.content_en}
                onChange={(e) => setAbout({ ...about, content_en: e.target.value })}
                className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2"
                placeholder="Write about yourself in English..."
                required
              />
            </div>

            <div>
              <Label htmlFor="content_es">Content (Spanish)</Label>
              <textarea
                id="content_es"
                value={about.content_es || ''}
                onChange={(e) => setAbout({ ...about, content_es: e.target.value })}
                className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2"
                placeholder="Escribe sobre ti en español..."
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save About Section
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* Education Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Education</h2>
          <Button onClick={addNewEducation}>
            <Plus className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        </div>

        {education.map((edu, index) => (
          <EducationItem
            key={edu.id || index}
            edu={edu}
            index={index}
            onUpdate={updateEducation}
            onSave={handleSaveEducation}
            onDelete={handleDeleteEducation}
            newSubjectEn={newSubjectEn[index] || ''}
            newSubjectEs={newSubjectEs[index] || ''}
            onNewSubjectEnChange={(value) =>
              setNewSubjectEn({ ...newSubjectEn, [index]: value })
            }
            onNewSubjectEsChange={(value) =>
              setNewSubjectEs({ ...newSubjectEs, [index]: value })
            }
            onAddSubjectEn={() => addSubjectEn(index)}
            onAddSubjectEs={() => addSubjectEs(index)}
            onRemoveSubjectEn={(subIndex) => removeSubjectEn(index, subIndex)}
            onRemoveSubjectEs={(subIndex) => removeSubjectEs(index, subIndex)}
          />
        ))}

        {education.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No education entries yet. Click "Add Education" to create one.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
