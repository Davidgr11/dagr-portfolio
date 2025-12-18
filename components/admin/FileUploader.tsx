'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, File, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface FileUploaderProps {
  label: string;
  bucketName: string;
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  fileType?: 'image' | 'pdf' | 'any';
  description?: string;
}

export function FileUploader({
  label,
  bucketName,
  value,
  onChange,
  accept,
  fileType = 'any',
  description,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Determine accept attribute based on fileType
  const getAcceptAttribute = () => {
    if (accept) return accept;
    if (fileType === 'image') return 'image/*';
    if (fileType === 'pdf') return 'application/pdf';
    return '*/*';
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!value) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this file?');
    if (!confirmDelete) return;

    setDeleting(true);

    try {
      // Extract file path from URL
      const url = new URL(value);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts[pathParts.length - 1];

      // Delete from storage
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        console.warn('Delete error (file may not exist):', error);
      }

      onChange(null);
      toast.success('File deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`Error deleting file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeleting(false);
    }
  };

  const renderPreview = () => {
    if (!value) return null;

    if (fileType === 'image' && value) {
      return (
        <div className="relative w-full h-48 mt-2 rounded-lg overflow-hidden border border-border bg-muted/30">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-contain"
          />
        </div>
      );
    }

    if (fileType === 'pdf' && value) {
      return (
        <div className="mt-2 p-4 border border-border rounded-lg bg-muted/30 flex items-center gap-3">
          <File className="h-8 w-8 text-red-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Resume/CV</p>
            <p className="text-xs text-muted-foreground truncate">{value}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-2 p-3 border border-border rounded-lg bg-muted/30">
        <p className="text-sm text-muted-foreground truncate">{value}</p>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {renderPreview()}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || deleting}
          className="flex-1"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {value ? 'Replace' : 'Upload'} {fileType === 'image' ? 'Image' : fileType === 'pdf' ? 'PDF' : 'File'}
            </>
          )}
        </Button>

        {value && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={uploading || deleting}
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptAttribute()}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
