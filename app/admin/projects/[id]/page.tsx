'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploader } from '@/components/admin/FileUploader';

export default function ProjectEditPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState({
    title_en: '',
    title_es: '',
    description_en: '',
    description_es: '',
    image_url: '',
    video_url: '',
    demo_url: '',
    repo_url: '',
    technologies: [] as string[],
    is_featured: false,
    is_visible: true,
    order: 0,
  });
  const [techInput, setTechInput] = useState('');
  const [existingTechnologies, setExistingTechnologies] = useState<string[]>([]);

  const supabase = createClient();
  const isNew = id === 'new';

  useEffect(() => {
    if (id && !isNew) {
      loadProject();
    }
    loadExistingTechnologies();
  }, [id]);

  async function loadExistingTechnologies() {
    const { data } = await supabase.from('projects').select('technologies');

    if (data) {
      // Extract all unique technologies from all projects
      const techSet = new Set<string>();
      data.forEach((project) => {
        (project.technologies || []).forEach((tech: string) => techSet.add(tech));
      });
      setExistingTechnologies(Array.from(techSet).sort());
    }
  }

  async function loadProject() {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').eq('id', id).single();
    if (data) {
      setProject(data);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (isNew) {
      // Get the highest order value and add 1
      const { data: projects } = await supabase
        .from('projects')
        .select('order')
        .order('order', { ascending: false })
        .limit(1);

      const nextOrder = projects && projects.length > 0 ? projects[0].order + 1 : 0;

      const { error } = await supabase.from('projects').insert({
        ...project,
        order: nextOrder,
      } as never);
      if (error) {
        toast.error('Error creating project: ' + error.message);
      } else {
        toast.success('Project created successfully!');
        router.push('/admin/projects');
      }
    } else {
      const { error } = await supabase
        .from('projects')
        .update(project as never)
        .eq('id', id);
      if (error) {
        toast.error('Error updating project: ' + error.message);
      } else {
        toast.success('Project updated successfully!');
        router.push('/admin/projects');
      }
    }

    setSaving(false);
  }

  function addTechnology() {
    if (techInput.trim()) {
      // Check if technology already exists in current project
      if (!project.technologies.includes(techInput.trim())) {
        setProject({
          ...project,
          technologies: [...project.technologies, techInput.trim()],
        });
      }
      setTechInput('');
    }
  }

  function addExistingTechnology(tech: string) {
    // Check if technology already exists in current project
    if (!project.technologies.includes(tech)) {
      setProject({
        ...project,
        technologies: [...project.technologies, tech],
      });
    }
  }

  function removeTechnology(index: number) {
    setProject({
      ...project,
      technologies: project.technologies.filter((_, i) => i !== index),
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isNew ? 'Add New Project' : 'Edit Project'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title_en">Title (English) *</Label>
                <Input
                  id="title_en"
                  value={project.title_en}
                  onChange={(e) =>
                    setProject({ ...project, title_en: e.target.value })
                  }
                  placeholder="My Amazing Project"
                  required
                />
              </div>
              <div>
                <Label htmlFor="title_es">Título (Español)</Label>
                <Input
                  id="title_es"
                  value={project.title_es || ''}
                  onChange={(e) =>
                    setProject({ ...project, title_es: e.target.value })
                  }
                  placeholder="Mi Proyecto Increíble"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description_en">Description (English) *</Label>
                <textarea
                  id="description_en"
                  value={project.description_en}
                  onChange={(e) =>
                    setProject({ ...project, description_en: e.target.value })
                  }
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                  placeholder="A brief description of your project..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="description_es">Descripción (Español)</Label>
                <textarea
                  id="description_es"
                  value={project.description_es || ''}
                  onChange={(e) =>
                    setProject({ ...project, description_es: e.target.value })
                  }
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Una breve descripción de tu proyecto..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media & Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Project Image */}
            <FileUploader
              label="Project Image"
              bucketName="project-media"
              value={project.image_url}
              onChange={(url) => setProject({ ...project, image_url: url })}
              fileType="image"
              description="Upload project screenshot or image (recommended: 1200x630px)"
            />

            {/* Project Video */}
            <FileUploader
              label="Project Video (Optional)"
              bucketName="project-media"
              value={project.video_url}
              onChange={(url) => setProject({ ...project, video_url: url })}
              fileType="video"
              description="Upload project demo video (optional)"
            />

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="demo_url">Demo URL</Label>
                <Input
                  id="demo_url"
                  value={project.demo_url || ''}
                  onChange={(e) =>
                    setProject({ ...project, demo_url: e.target.value })
                  }
                  placeholder="https://myproject.com"
                />
              </div>

              <div>
                <Label htmlFor="repo_url">Repository URL</Label>
                <Input
                  id="repo_url"
                  value={project.repo_url || ''}
                  onChange={(e) =>
                    setProject({ ...project, repo_url: e.target.value })
                  }
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add new technology manually */}
            <div>
              <Label>Add New Technology</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Type a new technology..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                />
                <Button type="button" onClick={addTechnology}>
                  Add
                </Button>
              </div>
            </div>

            {/* Select from existing technologies */}
            {existingTechnologies.length > 0 && (
              <div>
                <Label>Or Select from Existing</Label>
                <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md bg-muted/50 max-h-48 overflow-y-auto">
                  {existingTechnologies
                    .filter((tech) => !project.technologies.includes(tech))
                    .map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => addExistingTechnology(tech)}
                        className="px-3 py-1 bg-background hover:bg-primary/10 border rounded-full text-sm transition-colors"
                      >
                        + {tech}
                      </button>
                    ))}
                  {existingTechnologies.filter((tech) => !project.technologies.includes(tech))
                    .length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      All existing technologies already added
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Selected technologies */}
            <div>
              <Label>Selected Technologies</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologies.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No technologies added yet</p>
                ) : (
                  project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(i)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={project.is_featured}
                onChange={(e) =>
                  setProject({ ...project, is_featured: e.target.checked })
                }
              />
              <Label htmlFor="is_featured">Featured (show on homepage)</Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_visible"
                checked={project.is_visible}
                onChange={(e) =>
                  setProject({ ...project, is_visible: e.target.checked })
                }
              />
              <Label htmlFor="is_visible">Visible</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isNew ? 'Create Project' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/projects')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
