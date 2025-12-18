'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, GripVertical } from 'lucide-react';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Project {
  id: string;
  title_en: string;
  description_en: string;
  is_featured: boolean;
  is_visible: boolean;
  technologies: string[];
  demo_url: string | null;
  repo_url: string | null;
  order: number;
}

interface SortableProjectItemProps {
  project: Project;
  onToggleVisibility: (project: Project) => void;
  onToggleFeatured: (project: Project) => void;
  onDelete: (id: string) => void;
}

function SortableProjectItem({
  project,
  onToggleVisibility,
  onToggleFeatured,
  onDelete
}: SortableProjectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style}>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
          {/* Mobile: Header with drag handle and actions */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Drag Handle */}
            <button
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold truncate">{project.title_en}</h3>
                {project.is_featured && (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                )}
                {!project.is_visible && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded flex-shrink-0">
                    Hidden
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop: Drag Handle */}
          <button
            className="hidden md:block cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground mt-1 touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Desktop: Title */}
            <div className="hidden md:flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold">{project.title_en}</h3>
              {project.is_featured && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
              {!project.is_visible && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                  Hidden
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {project.description_en}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.slice(0, 5).map((tech, i) => (
                <span
                  key={i}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap md:flex-nowrap gap-2 md:flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleFeatured(project)}
              title={project.is_featured ? 'Remove from featured' : 'Add to featured'}
            >
              <Star className={project.is_featured ? 'fill-current' : ''} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleVisibility(project)}
            >
              {project.is_visible ? <Eye /> : <EyeOff />}
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/projects/${project.id}`}>
                <Edit />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true });

    if (data) setProjects(data);
    setLoading(false);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);

    const newProjects = arrayMove(projects, oldIndex, newIndex);
    setProjects(newProjects);

    // Update order in database
    const updates = newProjects.map((project, index) => ({
      id: project.id,
      order: index,
    }));

    // Batch update all orders
    for (const update of updates) {
      await supabase
        .from('projects')
        .update({ order: update.order })
        .eq('id', update.id);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    await supabase.from('projects').delete().eq('id', id);
    loadProjects();
  }

  async function toggleVisibility(project: Project) {
    await supabase
      .from('projects')
      .update({ is_visible: !project.is_visible })
      .eq('id', project.id);
    loadProjects();
  }

  async function toggleFeatured(project: Project) {
    await supabase
      .from('projects')
      .update({ is_featured: !project.is_featured })
      .eq('id', project.id);
    loadProjects();
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio projects. Drag and drop to reorder.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-4">
            {projects.map((project) => (
              <SortableProjectItem
                key={project.id}
                project={project}
                onToggleVisibility={toggleVisibility}
                onToggleFeatured={toggleFeatured}
                onDelete={deleteProject}
              />
            ))}

            {projects.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No projects yet. Add your first one!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
