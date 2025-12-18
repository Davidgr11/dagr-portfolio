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

interface Certification {
  id: string;
  name_en: string;
  issuer_en: string;
  is_visible: boolean;
  is_featured: boolean;
  issue_date: string;
  order: number;
}

interface SortableCertificationItemProps {
  cert: Certification;
  onToggleVisibility: (cert: Certification) => void;
  onToggleFeatured: (cert: Certification) => void;
  onDelete: (id: string) => void;
}

function SortableCertificationItem({
  cert,
  onToggleVisibility,
  onToggleFeatured,
  onDelete
}: SortableCertificationItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cert.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
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
                <h3 className="text-lg font-semibold truncate">{cert.name_en}</h3>
                {cert.is_featured && (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                )}
                {!cert.is_visible && (
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
              <h3 className="text-xl font-semibold">{cert.name_en}</h3>
              {cert.is_featured && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
              {!cert.is_visible && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                  Hidden
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {cert.issuer_en}
            </p>
            <p className="text-xs text-muted-foreground">
              Issued: {formatDate(cert.issue_date)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap md:flex-nowrap gap-2 md:flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleFeatured(cert)}
              title={cert.is_featured ? 'Remove from featured' : 'Add to featured'}
            >
              <Star className={cert.is_featured ? 'fill-current' : ''} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleVisibility(cert)}
            >
              {cert.is_visible ? <Eye /> : <EyeOff />}
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/certifications/${cert.id}`}>
                <Edit />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(cert.id)}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CertificationsManagement() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
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
    loadCertifications();
  }, []);

  async function loadCertifications() {
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .order('order', { ascending: true });

    if (data) setCertifications(data);
    setLoading(false);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = certifications.findIndex((c) => c.id === active.id);
    const newIndex = certifications.findIndex((c) => c.id === over.id);

    const newCertifications = arrayMove(certifications, oldIndex, newIndex);
    setCertifications(newCertifications);

    // Update order in database
    const updates = newCertifications.map((cert, index) => ({
      id: cert.id,
      order: index,
    }));

    for (const update of updates) {
      await supabase
        .from('certifications')
        .update({ order: update.order })
        .eq('id', update.id);
    }
  }

  async function deleteCertification(id: string) {
    if (!confirm('Are you sure you want to delete this certification?')) return;

    await supabase.from('certifications').delete().eq('id', id);
    loadCertifications();
  }

  async function toggleVisibility(cert: Certification) {
    await supabase
      .from('certifications')
      .update({ is_visible: !cert.is_visible })
      .eq('id', cert.id);
    loadCertifications();
  }

  async function toggleFeatured(cert: Certification) {
    await supabase
      .from('certifications')
      .update({ is_featured: !cert.is_featured })
      .eq('id', cert.id);
    loadCertifications();
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Certifications Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your professional certifications. Drag and drop to reorder.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/certifications/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Certification
          </Link>
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={certifications.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-4">
            {certifications.map((cert) => (
              <SortableCertificationItem
                key={cert.id}
                cert={cert}
                onToggleVisibility={toggleVisibility}
                onToggleFeatured={toggleFeatured}
                onDelete={deleteCertification}
              />
            ))}

            {certifications.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No certifications yet. Add your first one!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
