'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { FileUploader } from '@/components/admin/FileUploader';
import { toast } from 'sonner';
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

interface Award {
  id?: string;
  order: number;
  title_en: string;
  title_es: string | null;
  description_en: string | null;
  description_es: string | null;
  issuer_en: string;
  issuer_es: string | null;
  icon_url: string | null;
  certificate_url: string | null;
  date: string;
  is_visible: boolean;
}

// Sortable Award Item Component
function SortableAwardItem({
  award,
  index,
  onUpdate,
  onSave,
  onDelete,
  saving,
}: {
  award: Award;
  index: number;
  onUpdate: (field: keyof Award, value: Award[keyof Award]) => void;
  onSave: () => void;
  onDelete: () => void;
  saving: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(!award.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: award.id || `temp-${index}` });

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
              {award.title_en || 'New Award'}
            </CardTitle>
            {!award.is_visible && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded flex-shrink-0">
                Hidden
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {award.id && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdate('is_visible', !award.is_visible)}
                  title={award.is_visible ? 'Hide' : 'Show'}
                  className="h-8 w-8 p-0"
                >
                  {award.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onDelete}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
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
          {/* Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={award.date}
                onChange={(e) => onUpdate('date', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Title (English) *</Label>
              <Input
                value={award.title_en}
                onChange={(e) => onUpdate('title_en', e.target.value)}
                placeholder="Best Innovation Award"
                required
              />
            </div>
            <div>
              <Label>Title (Spanish)</Label>
              <Input
                value={award.title_es || ''}
                onChange={(e) => onUpdate('title_es', e.target.value)}
                placeholder="Premio a la Mejor Innovación"
              />
            </div>
          </div>

          {/* Issuer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Issuer (English) *</Label>
              <Input
                value={award.issuer_en}
                onChange={(e) => onUpdate('issuer_en', e.target.value)}
                placeholder="Tech Conference 2023"
                required
              />
            </div>
            <div>
              <Label>Issuer (Spanish)</Label>
              <Input
                value={award.issuer_es || ''}
                onChange={(e) => onUpdate('issuer_es', e.target.value)}
                placeholder="Conferencia Tech 2023"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Description (English)</Label>
              <textarea
                value={award.description_en || ''}
                onChange={(e) => onUpdate('description_en', e.target.value)}
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                placeholder="Awarded for innovative solution in web development..."
              />
            </div>
            <div>
              <Label>Description (Spanish)</Label>
              <textarea
                value={award.description_es || ''}
                onChange={(e) => onUpdate('description_es', e.target.value)}
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                placeholder="Premiado por solución innovadora en desarrollo web..."
              />
            </div>
          </div>

          {/* Certificate URL */}
          <div>
            <Label>Certificate URL</Label>
            <Input
              type="url"
              value={award.certificate_url || ''}
              onChange={(e) => onUpdate('certificate_url', e.target.value)}
              placeholder="https://awards.example.com/certificate/..."
            />
          </div>

          {/* Icon */}
          <FileUploader
            label="Award Icon"
            bucketName="awards-icons"
            value={award.icon_url}
            onChange={(url) => onUpdate('icon_url', url)}
            fileType="image"
            description="Upload award icon or trophy image"
          />

          {/* Save Button */}
          <Button onClick={onSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Award
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export default function AwardsManagement() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [awards, setAwards] = useState<Award[]>([]);

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

    const { data: awardsData } = await supabase
      .from('awards')
      .select('*')
      .order('order', { ascending: true });

    if (awardsData) {
      setAwards(awardsData);
    }

    setLoading(false);
  }

  async function handleSaveAward(award: Award) {
    setSaving(true);

    const { error } = await supabase
      .from('awards')
      .upsert(award)
      .select()
      .single();

    if (error) {
      toast.error('Error saving award: ' + error.message);
      setSaving(false);
      return false;
    }

    await loadData();
    setSaving(false);
    toast.success('Award saved successfully!');
    return true;
  }

  async function handleDeleteAward(id: string) {
    if (!window.confirm('Are you sure you want to delete this award?')) {
      return;
    }

    const { error } = await supabase.from('awards').delete().eq('id', id);

    if (error) {
      toast.error('Error deleting: ' + error.message);
    } else {
      await loadData();
      toast.success('Award deleted successfully!');
    }
  }

  function addNewAward() {
    const maxOrder = awards.length > 0 ? Math.max(...awards.map((a) => a.order)) : 0;
    setAwards([
      ...awards,
      {
        order: maxOrder + 1,
        title_en: '',
        title_es: null,
        description_en: null,
        description_es: null,
        issuer_en: '',
        issuer_es: null,
        icon_url: null,
        certificate_url: null,
        date: '',
        is_visible: true,
      },
    ]);
  }

  function updateAward(index: number, field: keyof Award, value: Award[keyof Award]) {
    const updated = [...awards];
    updated[index] = { ...updated[index], [field]: value };
    setAwards(updated);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = awards.findIndex(
      (a) => (a.id || `temp-${awards.indexOf(a)}`) === active.id
    );
    const newIndex = awards.findIndex(
      (a) => (a.id || `temp-${awards.indexOf(a)}`) === over.id
    );

    const reordered = arrayMove(awards, oldIndex, newIndex);

    // Update order values
    const updatedAwards = reordered.map((award, idx) => ({
      ...award,
      order: idx + 1,
    }));

    setAwards(updatedAwards);

    // Save order to database
    try {
      const updates = updatedAwards
        .filter((a) => a.id)
        .map((a) => ({
          id: a.id,
          order: a.order,
        }));

      for (const update of updates) {
        await supabase.from('awards').update({ order: update.order }).eq('id', update.id);
      }

      toast.success('Order updated successfully!');
    } catch (error) {
      toast.error('Error updating order');
      loadData(); // Reload to reset order
    }
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
        <h1 className="text-3xl font-bold">Leadership & Awards</h1>
        <p className="text-muted-foreground mt-2">
          Manage your leadership experiences, awards, honors, and recognitions
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Awards</h2>
          <Button onClick={addNewAward}>
            <Plus className="mr-2 h-4 w-4" />
            Add Award
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={awards.map((a, idx) => a.id || `temp-${idx}`)}
            strategy={verticalListSortingStrategy}
          >
            {awards.map((award, index) => (
              <SortableAwardItem
                key={award.id || `temp-${index}`}
                award={award}
                index={index}
                onUpdate={(field, value) => updateAward(index, field, value)}
                onSave={() => handleSaveAward(award)}
                onDelete={() => award.id && handleDeleteAward(award.id)}
                saving={saving}
              />
            ))}
          </SortableContext>
        </DndContext>

        {awards.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No awards yet. Click "Add Award" to create one.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
