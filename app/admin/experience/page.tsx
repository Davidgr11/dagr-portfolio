'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { FileUploader } from '@/components/admin/FileUploader';
import { toast } from 'sonner';

interface Experience {
  id?: string;
  order: number;
  position_en: string;
  position_es: string | null;
  company_en: string;
  company_es: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  employment_type_en: string;
  employment_type_es: string | null;
  achievements_en: string[] | null;
  achievements_es: string[] | null;
  logo_url: string | null;
  is_visible: boolean;
}

interface ExperienceItemProps {
  exp: Experience;
  index: number;
  onUpdate: (index: number, field: keyof Experience, value: Experience[keyof Experience]) => void;
  onSave: (exp: Experience) => Promise<boolean>;
  onDelete: (id: string) => void;
  newAchievementEn: string;
  newAchievementEs: string;
  onNewAchievementEnChange: (value: string) => void;
  onNewAchievementEsChange: (value: string) => void;
  onAddAchievementEn: () => void;
  onAddAchievementEs: () => void;
  onRemoveAchievementEn: (achIndex: number) => void;
  onRemoveAchievementEs: (achIndex: number) => void;
}

function ExperienceItem({
  exp,
  index,
  onUpdate,
  onSave,
  onDelete,
  newAchievementEn,
  newAchievementEs,
  onNewAchievementEnChange,
  onNewAchievementEsChange,
  onAddAchievementEn,
  onAddAchievementEs,
  onRemoveAchievementEn,
  onRemoveAchievementEs,
}: ExperienceItemProps) {
  const [isExpanded, setIsExpanded] = useState(!exp.id); // Expand if new
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave(exp);
    setSaving(false);
  }

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Title and Status */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <CardTitle className="text-base md:text-lg truncate">
              {exp.position_en || 'New Experience Entry'}
            </CardTitle>
            {!exp.is_visible && (
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
              onClick={() => onUpdate(index, 'is_visible', !exp.is_visible)}
              title={exp.is_visible ? 'Hide' : 'Show'}
              className="h-8 w-8 p-0"
            >
              {exp.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            {exp.id && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(exp.id!)}
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
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Order</Label>
                <Input
                  type="number"
                  value={exp.order}
                  onChange={(e) =>
                    onUpdate(index, 'order', parseInt(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Employment Type (English) *</Label>
                <select
                  value={exp.employment_type_en}
                  onChange={(e) => onUpdate(index, 'employment_type_en', e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Contract">Contract</option>
                  <option value="Entrepreneur">Entrepreneur</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>
              <div>
                <Label>Tipo de Empleo (Español)</Label>
                <select
                  value={exp.employment_type_es || ''}
                  onChange={(e) => onUpdate(index, 'employment_type_es', e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="Tiempo completo">Tiempo completo</option>
                  <option value="Medio tiempo">Medio tiempo</option>
                  <option value="Becario">Becario</option>
                  <option value="Trainee">Trainee</option>
                  <option value="Prácticas">Prácticas</option>
                  <option value="Autoempleo">Autoempleo</option>
                  <option value="Independiente">Independiente</option>
                  <option value="Por honorarios">Por honorarios</option>
                  <option value="Emprendedor">Emprendedor</option>
                  <option value="Por temporada">Por temporada</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Position (English) *</Label>
              <Input
                value={exp.position_en}
                onChange={(e) => onUpdate(index, 'position_en', e.target.value)}
                placeholder="Full Stack Developer"
                required
              />
            </div>
            <div>
              <Label>Position (Spanish)</Label>
              <Input
                value={exp.position_es || ''}
                onChange={(e) => onUpdate(index, 'position_es', e.target.value)}
                placeholder="Desarrollador Full Stack"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Company (English) *</Label>
              <Input
                value={exp.company_en}
                onChange={(e) =>
                  onUpdate(index, 'company_en', e.target.value)
                }
                placeholder="Tech Company Inc."
                required
              />
            </div>
            <div>
              <Label>Company (Spanish)</Label>
              <Input
                value={exp.company_es || ''}
                onChange={(e) =>
                  onUpdate(index, 'company_es', e.target.value)
                }
                placeholder="Tech Company Inc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Date *</Label>
              <Input
                type="date"
                value={exp.start_date}
                onChange={(e) => onUpdate(index, 'start_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={exp.end_date || ''}
                onChange={(e) => onUpdate(index, 'end_date', e.target.value)}
                disabled={exp.is_current}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`is-current-${index}`}
                checked={exp.is_current}
                onChange={(e) => {
                  onUpdate(index, 'is_current', e.target.checked);
                  if (e.target.checked) {
                    onUpdate(index, 'end_date', null);
                  }
                }}
                className="w-4 h-4"
              />
              <Label htmlFor={`is-current-${index}`}>Currently working here</Label>
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={exp.location || ''}
                onChange={(e) => onUpdate(index, 'location', e.target.value)}
                placeholder="CDMX, Mexico"
              />
            </div>
          </div>

          {/* Achievements - English */}
          <div>
            <Label>Key Achievements (English)</Label>
            <div className="space-y-2 mb-2">
              {exp.achievements_en?.map((achievement, achIndex) => (
                <div
                  key={achIndex}
                  className="flex items-start gap-2 p-2 bg-muted/50 rounded-md"
                >
                  <span className="flex-1 text-sm">{achievement}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveAchievementEn(achIndex)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newAchievementEn}
                onChange={(e) => onNewAchievementEnChange(e.target.value)}
                placeholder="Add an achievement in English..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onAddAchievementEn();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={onAddAchievementEn}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Achievements - Spanish */}
          <div>
            <Label>Logros Clave (Español)</Label>
            <div className="space-y-2 mb-2">
              {exp.achievements_es?.map((achievement, achIndex) => (
                <div
                  key={achIndex}
                  className="flex items-start gap-2 p-2 bg-muted/50 rounded-md"
                >
                  <span className="flex-1 text-sm">{achievement}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveAchievementEs(achIndex)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newAchievementEs}
                onChange={(e) => onNewAchievementEsChange(e.target.value)}
                placeholder="Agregar un logro en español..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onAddAchievementEs();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={onAddAchievementEs}
              >
                Agregar
              </Button>
            </div>
          </div>

          {/* Company Logo */}
          <FileUploader
            label="Company Logo"
            bucketName="company-logos"
            value={exp.logo_url}
            onChange={(url) => onUpdate(index, 'logo_url', url)}
            fileType="image"
            description="Upload company logo (optional)"
          />

          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Experience Entry
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export default function ExperienceManagement() {
  const [loading, setLoading] = useState(false);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [newAchievementEn, setNewAchievementEn] = useState<{ [key: number]: string }>({});
  const [newAchievementEs, setNewAchievementEs] = useState<{ [key: number]: string }>({});

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: experienceData } = await supabase
      .from('experience')
      .select('*')
      .order('order', { ascending: true });

    if (experienceData) {
      setExperience(experienceData);
    }

    setLoading(false);
  }

  async function handleSaveExperience(exp: Experience) {
    const { error } = await supabase
      .from('experience')
      .upsert(exp)
      .select()
      .single();

    if (error) {
      toast.error('Error saving experience: ' + error.message);
      return false;
    }

    await loadData();
    toast.success('Experience saved successfully!');
    return true;
  }

  async function handleDeleteExperience(id: string) {
    if (!window.confirm('Are you sure you want to delete this experience entry?')) {
      return;
    }

    const { error } = await supabase.from('experience').delete().eq('id', id);

    if (error) {
      toast.error('Error deleting: ' + error.message);
    } else {
      await loadData();
    }
  }

  function addNewExperience() {
    const maxOrder = experience.length > 0 ? Math.max(...experience.map((e) => e.order)) : 0;
    setExperience([
      ...experience,
      {
        order: maxOrder + 1,
        position_en: '',
        position_es: null,
        company_en: '',
        company_es: null,
        start_date: '',
        end_date: null,
        is_current: false,
        location: null,
        employment_type_en: 'Full-time',
        employment_type_es: 'Tiempo completo',
        achievements_en: [],
        achievements_es: [],
        logo_url: null,
        is_visible: true,
      },
    ]);
  }

  function updateExperience(index: number, field: keyof Experience, value: Experience[keyof Experience]) {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  }

  function addAchievementEn(index: number) {
    const achievement = newAchievementEn[index]?.trim();
    if (!achievement) return;

    const updated = [...experience];
    updated[index] = {
      ...updated[index],
      achievements_en: [...(updated[index].achievements_en || []), achievement],
    };
    setExperience(updated);
    setNewAchievementEn({ ...newAchievementEn, [index]: '' });
  }

  function addAchievementEs(index: number) {
    const achievement = newAchievementEs[index]?.trim();
    if (!achievement) return;

    const updated = [...experience];
    updated[index] = {
      ...updated[index],
      achievements_es: [...(updated[index].achievements_es || []), achievement],
    };
    setExperience(updated);
    setNewAchievementEs({ ...newAchievementEs, [index]: '' });
  }

  function removeAchievementEn(expIndex: number, achIndex: number) {
    const updated = [...experience];
    updated[expIndex] = {
      ...updated[expIndex],
      achievements_en: updated[expIndex].achievements_en?.filter((_, i) => i !== achIndex) || [],
    };
    setExperience(updated);
  }

  function removeAchievementEs(expIndex: number, achIndex: number) {
    const updated = [...experience];
    updated[expIndex] = {
      ...updated[expIndex],
      achievements_es: updated[expIndex].achievements_es?.filter((_, i) => i !== achIndex) || [],
    };
    setExperience(updated);
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
        <h1 className="text-3xl font-bold">Experience</h1>
        <p className="text-muted-foreground mt-2">
          Manage your work experience and professional background
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Work Experience</h2>
          <Button onClick={addNewExperience}>
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </div>

        {experience.map((exp, index) => (
          <ExperienceItem
            key={exp.id || index}
            exp={exp}
            index={index}
            onUpdate={updateExperience}
            onSave={handleSaveExperience}
            onDelete={handleDeleteExperience}
            newAchievementEn={newAchievementEn[index] || ''}
            newAchievementEs={newAchievementEs[index] || ''}
            onNewAchievementEnChange={(value) =>
              setNewAchievementEn({ ...newAchievementEn, [index]: value })
            }
            onNewAchievementEsChange={(value) =>
              setNewAchievementEs({ ...newAchievementEs, [index]: value })
            }
            onAddAchievementEn={() => addAchievementEn(index)}
            onAddAchievementEs={() => addAchievementEs(index)}
            onRemoveAchievementEn={(achIndex) => removeAchievementEn(index, achIndex)}
            onRemoveAchievementEs={(achIndex) => removeAchievementEs(index, achIndex)}
          />
        ))}

        {experience.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No experience entries yet. Click "Add Experience" to create one.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
