'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Plus, Trash2, Edit, ChevronDown, ChevronUp, GripVertical, Eye, EyeOff } from 'lucide-react';
import { FileUploader } from '@/components/admin/FileUploader';
import { toast } from 'sonner';
import Image from 'next/image';
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

interface SkillCategory {
  id?: string;
  order: number;
  name_en: string;
  name_es: string | null;
  is_visible: boolean;
}

interface Skill {
  id?: string;
  category_id: string;
  order: number;
  name: string;
  logo_url: string | null;
  is_visible: boolean;
}

interface SortableCategoryItemProps {
  category: SkillCategory;
  categorySkills: Skill[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateCategory: (field: string, value: string | boolean) => void;
  onSaveCategory: () => void;
  onDeleteCategory: () => void;
  onSkillsReorder: (skills: Skill[]) => void;
  onEditSkill: (skill: Skill) => void;
  onDeleteSkill: (skillId: string) => void;
  onAddSkill: () => void;
  saving: boolean;
}

// Sortable Category Component
function SortableCategoryItem({
  category,
  categorySkills,
  isExpanded,
  onToggleExpand,
  onUpdateCategory,
  onSaveCategory,
  onDeleteCategory,
  onSkillsReorder,
  onEditSkill,
  onDeleteSkill,
  onAddSkill,
  saving,
}: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id || `temp-${category.order}` });

  // Create sensors at component level (not conditionally)
  const skillsSensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style}>
      <CardHeader className="p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Drag Handle */}
          <button
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </button>

          {/* Title and Status */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <CardTitle className="text-base md:text-lg truncate">
              {category.name_en || 'New Category'}
            </CardTitle>
            {!category.is_visible && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded flex-shrink-0">
                Hidden
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {category.id && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateCategory('is_visible', !category.is_visible)}
                  title={category.is_visible ? 'Hide' : 'Show'}
                  className="h-8 w-8 p-0"
                >
                  {category.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteCategory(category.id!)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
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
        <CardContent className="space-y-6">
          {/* Category Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name (English) *</Label>
              <Input
                value={category.name_en}
                onChange={(e) => onUpdateCategory('name_en', e.target.value)}
                placeholder="Frontend Technologies"
                required
              />
            </div>
            <div>
              <Label>Name (Spanish)</Label>
              <Input
                value={category.name_es || ''}
                onChange={(e) => onUpdateCategory('name_es', e.target.value)}
                placeholder="Tecnologías Frontend"
              />
            </div>
          </div>

          {/* Skills Section */}
          {category.id && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Skills</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onAddSkill}
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Add Skill
                </Button>
              </div>

              {/* Skills Grid with Drag & Drop */}
              <DndContext
                sensors={skillsSensors}
                collisionDetection={closestCenter}
                onDragEnd={onSkillsReorder}
              >
                <SortableContext
                  items={categorySkills.map((s: Skill) => s.id || `temp-${s.order}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categorySkills.map((skill: Skill) => (
                      <SortableSkillItem
                        key={skill.id || `temp-${skill.order}`}
                        skill={skill}
                        onEdit={() => onEditSkill(skill)}
                        onDelete={() => onDeleteSkill(skill.id!)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {categorySkills.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No skills yet. Click "Add Skill" to create one.
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <Button onClick={onSaveCategory} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Category
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

// Sortable Skill Item
function SortableSkillItem({ skill, onEdit, onDelete }: { skill: Skill; onEdit: (skill: Skill) => void; onDelete: (skillId: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id || `temp-${skill.order}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      <div className="aspect-square bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-all p-2 flex items-center justify-center">
        {skill.logo_url ? (
          <Image
            src={skill.logo_url}
            alt={skill.name}
            width={80}
            height={80}
            className="object-contain"
          />
        ) : (
          <span className="text-xs text-center text-muted-foreground">
            {skill.name || 'No logo'}
          </span>
        )}
      </div>

      {/* Drag Handle */}
      <button
        className="absolute top-1 left-1 cursor-grab active:cursor-grabbing bg-background/80 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3" />
      </button>

      {/* Actions */}
      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="secondary"
          className="h-6 w-6"
          onClick={onEdit}
        >
          <Edit className="h-3 w-3" />
        </Button>
        {skill.id && (
          <Button
            size="icon"
            variant="destructive"
            className="h-6 w-6"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Skill Name */}
      <p className="text-xs text-center mt-1 truncate">{skill.name}</p>
    </div>
  );
}

export default function SkillsManagement() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const supabase = createClient();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: categoriesData } = await supabase
      .from('skills_categories')
      .select('*')
      .order('order', { ascending: true });

    if (categoriesData) {
      setCategories(categoriesData);
    }

    const { data: skillsData } = await supabase
      .from('skills')
      .select('*')
      .order('order', { ascending: true });

    if (skillsData) {
      setSkills(skillsData);
    }

    setLoading(false);
  }

  async function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => (c.id || `temp-${c.order}`) === active.id);
    const newIndex = categories.findIndex((c) => (c.id || `temp-${c.order}`) === over.id);

    const newCategories = arrayMove(categories, oldIndex, newIndex);
    setCategories(newCategories);

    // Update order in database for saved items
    const updates = newCategories
      .filter(cat => cat.id)
      .map((cat, index) => ({ id: cat.id, order: index }));

    for (const update of updates) {
      await supabase
        .from('skills_categories')
        .update({ order: update.order })
        .eq('id', update.id);
    }
  }

  async function handleSkillsReorder(categoryId: string, event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const categorySkills = skills.filter((s) => s.category_id === categoryId);
    const oldIndex = categorySkills.findIndex((s) => (s.id || `temp-${s.order}`) === active.id);
    const newIndex = categorySkills.findIndex((s) => (s.id || `temp-${s.order}`) === over.id);

    const reorderedSkills = arrayMove(categorySkills, oldIndex, newIndex);

    // Update skills state
    const otherSkills = skills.filter((s) => s.category_id !== categoryId);
    setSkills([...otherSkills, ...reorderedSkills]);

    // Update order in database
    const updates = reorderedSkills
      .filter(skill => skill.id)
      .map((skill, index) => ({ id: skill.id, order: index }));

    for (const update of updates) {
      await supabase
        .from('skills')
        .update({ order: update.order })
        .eq('id', update.id);
    }
  }

  async function handleSaveCategory(category: SkillCategory) {
    setSaving(true);

    const { error } = await supabase
      .from('skills_categories')
      .upsert(category)
      .select()
      .single();

    if (error) {
      toast.error('Error saving category: ' + error.message);
      setSaving(false);
      return false;
    }

    await loadData();
    setSaving(false);
    toast.success('Category saved successfully!');
    return true;
  }

  async function handleDeleteCategory(id: string) {
    if (!window.confirm('Are you sure? This will also delete all skills in this category.')) {
      return;
    }

    const { error } = await supabase.from('skills_categories').delete().eq('id', id);

    if (error) {
      toast.error('Error deleting: ' + error.message);
    } else {
      await loadData();
    }
  }

  async function handleSaveSkill(skill: Skill) {
    setSaving(true);

    const { error } = await supabase
      .from('skills')
      .upsert(skill)
      .select()
      .single();

    if (error) {
      toast.error('Error saving skill: ' + error.message);
      setSaving(false);
      return false;
    }

    await loadData();
    setSaving(false);
    toast.success('Skill saved successfully!');
    setIsSkillModalOpen(false);
    setEditingSkill(null);
    return true;
  }

  async function handleDeleteSkill(id: string) {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    const { error } = await supabase.from('skills').delete().eq('id', id);

    if (error) {
      toast.error('Error deleting: ' + error.message);
    } else {
      await loadData();
    }
  }

  function addNewCategory() {
    const maxOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.order)) : 0;
    const newCat = {
      order: maxOrder + 1,
      name_en: '',
      name_es: null,
      is_visible: true,
    };
    setCategories([...categories, newCat]);
  }

  function addNewSkill(categoryId: string) {
    const categorySkills = skills.filter((s) => s.category_id === categoryId);
    const maxOrder = categorySkills.length > 0 ? Math.max(...categorySkills.map((s) => s.order)) : 0;
    setEditingSkill({
      category_id: categoryId,
      order: maxOrder + 1,
      name: '',
      logo_url: null,
      is_visible: true,
    });
    setIsSkillModalOpen(true);
  }

  function updateCategory(index: number, field: keyof SkillCategory, value: SkillCategory[keyof SkillCategory]) {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  }

  function toggleExpanded(categoryId: string) {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
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
        <h1 className="text-3xl font-bold">Skills Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your skills categories and individual skills. Drag and drop to reorder.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={addNewCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories with Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleCategoryDragEnd}
      >
        <SortableContext
          items={categories.map((c) => c.id || `temp-${c.order}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {categories.map((category, index) => {
              const categorySkills = skills.filter((s) => s.category_id === category.id);
              const isExpanded = category.id ? expandedCategories.has(category.id) : true;

              return (
                <SortableCategoryItem
                  key={category.id || `temp-${category.order}`}
                  category={category}
                  categorySkills={categorySkills}
                  isExpanded={isExpanded}
                  onToggleExpand={() => category.id && toggleExpanded(category.id)}
                  onUpdateCategory={(field: string, value: string | boolean) => updateCategory(index, field as keyof SkillCategory, value)}
                  onSaveCategory={() => handleSaveCategory(category)}
                  onDeleteCategory={handleDeleteCategory}
                  onSkillsReorder={(event: DragEndEvent) => handleSkillsReorder(category.id!, event)}
                  onEditSkill={(skill: Skill) => {
                    setEditingSkill(skill);
                    setIsSkillModalOpen(true);
                  }}
                  onDeleteSkill={handleDeleteSkill}
                  onAddSkill={() => addNewSkill(category.id!)}
                  saving={saving}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No categories yet. Click "Add Category" to create one.
          </CardContent>
        </Card>
      )}

      {/* Edit Skill Modal */}
      <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSkill?.id ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
            <DialogDescription>
              Update the skill name and logo
            </DialogDescription>
          </DialogHeader>

          {editingSkill && (
            <div className="space-y-4">
              <div>
                <Label>Skill Name *</Label>
                <Input
                  value={editingSkill.name}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, name: e.target.value })
                  }
                  placeholder="React, TypeScript, etc."
                  required
                />
              </div>

              <FileUploader
                label="Skill Logo"
                bucketName="tech-logos"
                value={editingSkill.logo_url}
                onChange={(url) =>
                  setEditingSkill({ ...editingSkill, logo_url: url })
                }
                fileType="image"
                description="Upload technology logo"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="skill-visible"
                  checked={editingSkill.is_visible}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, is_visible: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="skill-visible">Visible</Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSkillModalOpen(false);
                    setEditingSkill(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => handleSaveSkill(editingSkill)} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Skill
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
