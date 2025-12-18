'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { FileUploader } from '@/components/admin/FileUploader';
import { toast } from 'sonner';
import Link from 'next/link';

interface Certification {
  id?: string;
  order: number;
  name_en: string;
  name_es: string | null;
  description_en: string | null;
  description_es: string | null;
  issuer_en: string;
  issuer_es: string | null;
  logo_url: string | null;
  certificate_file_url: string | null;
  certificate_url: string | null;
  issue_date: string;
  is_verified: boolean;
  is_featured: boolean;
  is_visible: boolean;
}

export default function CertificationEdit() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [certification, setCertification] = useState<Certification>({
    order: 0,
    name_en: '',
    name_es: null,
    description_en: null,
    description_es: null,
    issuer_en: '',
    issuer_es: null,
    logo_url: null,
    certificate_file_url: null,
    certificate_url: null,
    issue_date: '',
    is_verified: false,
    is_featured: false,
    is_visible: true,
  });

  const supabase = createClient();
  const isNew = params.id === 'new';

  useEffect(() => {
    if (!isNew) {
      loadCertification();
    } else {
      loadMaxOrder();
      setLoading(false);
    }
  }, [params.id]);

  async function loadMaxOrder() {
    const { data } = await supabase
      .from('certifications')
      .select('order')
      .order('order', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      setCertification(prev => ({ ...prev, order: data[0].order + 1 }));
    }
  }

  async function loadCertification() {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      toast.error('Error loading certification');
      router.push('/admin/certifications');
      return;
    }

    if (data) {
      setCertification(data);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('certifications')
      .upsert(certification)
      .select()
      .single();

    if (error) {
      toast.error('Error saving certification: ' + error.message);
      setSaving(false);
      return;
    }

    toast.success('Certification saved successfully!');
    setSaving(false);
    router.push('/admin/certifications');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/certifications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isNew ? 'Add Certification' : 'Edit Certification'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isNew ? 'Create a new certification' : 'Update certification details'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Certification Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name_en">Name (English) *</Label>
                <Input
                  id="name_en"
                  value={certification.name_en}
                  onChange={(e) =>
                    setCertification({ ...certification, name_en: e.target.value })
                  }
                  placeholder="AWS Certified Developer"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name_es">Name (Spanish)</Label>
                <Input
                  id="name_es"
                  value={certification.name_es || ''}
                  onChange={(e) =>
                    setCertification({ ...certification, name_es: e.target.value })
                  }
                  placeholder="Desarrollador Certificado de AWS"
                />
              </div>
            </div>

            {/* Issuer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issuer_en">Issuer (English) *</Label>
                <Input
                  id="issuer_en"
                  value={certification.issuer_en}
                  onChange={(e) =>
                    setCertification({ ...certification, issuer_en: e.target.value })
                  }
                  placeholder="Amazon Web Services"
                  required
                />
              </div>
              <div>
                <Label htmlFor="issuer_es">Issuer (Spanish)</Label>
                <Input
                  id="issuer_es"
                  value={certification.issuer_es || ''}
                  onChange={(e) =>
                    setCertification({ ...certification, issuer_es: e.target.value })
                  }
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description_en">Description (English)</Label>
              <textarea
                id="description_en"
                value={certification.description_en || ''}
                onChange={(e) =>
                  setCertification({ ...certification, description_en: e.target.value })
                }
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2"
                placeholder="Associate level certification for AWS cloud development..."
              />
            </div>

            <div>
              <Label htmlFor="description_es">Description (Spanish)</Label>
              <textarea
                id="description_es"
                value={certification.description_es || ''}
                onChange={(e) =>
                  setCertification({ ...certification, description_es: e.target.value })
                }
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2"
                placeholder="Certificación de nivel asociado para desarrollo en la nube de AWS..."
              />
            </div>

            {/* Dates and URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issue_date">Issue Date *</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={certification.issue_date}
                  onChange={(e) =>
                    setCertification({ ...certification, issue_date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="certificate_url">Certificate URL</Label>
                <Input
                  id="certificate_url"
                  type="url"
                  value={certification.certificate_url || ''}
                  onChange={(e) =>
                    setCertification({ ...certification, certificate_url: e.target.value })
                  }
                  placeholder="https://verify.example.com/cert/..."
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_verified"
                  checked={certification.is_verified}
                  onChange={(e) =>
                    setCertification({ ...certification, is_verified: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="is_verified">Verified Certification</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={certification.is_featured}
                  onChange={(e) =>
                    setCertification({ ...certification, is_featured: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_visible"
                  checked={certification.is_visible}
                  onChange={(e) =>
                    setCertification({ ...certification, is_visible: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="is_visible">Visible</Label>
              </div>
            </div>

            {/* Logo */}
            <FileUploader
              label="Certification Logo"
              bucketName="certifications"
              value={certification.logo_url}
              onChange={(url) =>
                setCertification({ ...certification, logo_url: url })
              }
              fileType="image"
              description="Upload certification or issuer logo"
            />

            {/* Certificate File */}
            <FileUploader
              label="Certificate File"
              bucketName="certifications"
              value={certification.certificate_file_url}
              onChange={(url) =>
                setCertification({ ...certification, certificate_file_url: url })
              }
              fileType="any"
              description="Upload the actual certification file (image or PDF)"
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isNew ? 'Create Certification' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/certifications">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
