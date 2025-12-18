'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploader } from '@/components/admin/FileUploader';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

export default function HeroManagement() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedBasic, setExpandedBasic] = useState(true);
  const [expandedContact, setExpandedContact] = useState(false);
  const [expandedMedia, setExpandedMedia] = useState(false);
  const [profile, setProfile] = useState({
    title_en: '',
    title_es: '',
    subtitle_en: '',
    subtitle_es: '',
    description_en: '',
    description_es: '',
    badge_text_en: '',
    badge_text_es: '',
    email: '',
    location_en: '',
    location_es: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    profile_image_url: '',
    resume_url: '',
  });

  const supabase = createClient();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').single();
    if (data) {
      setProfile(data);
    }
    setLoading(false);
  }

  async function saveProfile() {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();

    if (error) {
      toast.error('Error saving: ' + error.message);
    } else {
      toast.success('Profile saved successfully!');
    }
    setSaving(false);
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
        <h1 className="text-3xl font-bold">Hero Section Management</h1>
        <p className="text-muted-foreground mt-2">
          Update your profile information and social links
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <CardTitle>Basic Information</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedBasic(!expandedBasic)}
                className="h-8 w-8 p-0"
              >
                {expandedBasic ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          {expandedBasic && (
            <CardContent className="space-y-4">
            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title_en">Title/Name (English) *</Label>
                <Input
                  id="title_en"
                  value={profile.title_en}
                  onChange={(e) => setProfile({ ...profile, title_en: e.target.value })}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="title_es">Título/Nombre (Español)</Label>
                <Input
                  id="title_es"
                  value={profile.title_es || ''}
                  onChange={(e) => setProfile({ ...profile, title_es: e.target.value })}
                  placeholder="Tu Nombre"
                />
              </div>
            </div>

            {/* Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subtitle_en">Subtitle (English) *</Label>
                <Input
                  id="subtitle_en"
                  value={profile.subtitle_en}
                  onChange={(e) => setProfile({ ...profile, subtitle_en: e.target.value })}
                  placeholder="Full Stack Developer"
                  required
                />
              </div>
              <div>
                <Label htmlFor="subtitle_es">Subtítulo (Español)</Label>
                <Input
                  id="subtitle_es"
                  value={profile.subtitle_es || ''}
                  onChange={(e) => setProfile({ ...profile, subtitle_es: e.target.value })}
                  placeholder="Desarrollador Full Stack"
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description_en">Description (English) *</Label>
                <textarea
                  id="description_en"
                  value={profile.description_en}
                  onChange={(e) => setProfile({ ...profile, description_en: e.target.value })}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Brief description about yourself"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description_es">Descripción (Español)</Label>
                <textarea
                  id="description_es"
                  value={profile.description_es || ''}
                  onChange={(e) => setProfile({ ...profile, description_es: e.target.value })}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Breve descripción sobre ti"
                />
              </div>
            </div>

            {/* Badge Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="badge_text_en">Badge Text (English)</Label>
                <Input
                  id="badge_text_en"
                  value={profile.badge_text_en || ''}
                  onChange={(e) => setProfile({ ...profile, badge_text_en: e.target.value })}
                  placeholder="Available for Hire"
                />
              </div>
              <div>
                <Label htmlFor="badge_text_es">Texto del Badge (Español)</Label>
                <Input
                  id="badge_text_es"
                  value={profile.badge_text_es || ''}
                  onChange={(e) => setProfile({ ...profile, badge_text_es: e.target.value })}
                  placeholder="Disponible para Contratar"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location_en">Location (English)</Label>
                <Input
                  id="location_en"
                  value={profile.location_en || ''}
                  onChange={(e) => setProfile({ ...profile, location_en: e.target.value })}
                  placeholder="New York, USA"
                />
              </div>
              <div>
                <Label htmlFor="location_es">Ubicación (Español)</Label>
                <Input
                  id="location_es"
                  value={profile.location_es || ''}
                  onChange={(e) => setProfile({ ...profile, location_es: e.target.value })}
                  placeholder="Nueva York, EE.UU."
                />
              </div>
            </div>

          </CardContent>
          )}
        </Card>

        {/* Contact & Social Links */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <CardTitle>Contact & Social Links</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedContact(!expandedContact)}
                className="h-8 w-8 p-0"
              >
                {expandedContact ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          {expandedContact && (
            <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={profile.linkedin_url || ''}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                value={profile.github_url || ''}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div>
              <Label htmlFor="twitter_url">Twitter URL</Label>
              <Input
                id="twitter_url"
                value={profile.twitter_url || ''}
                onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

          </CardContent>
          )}
        </Card>

        {/* Media Files */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <CardTitle>Media Files</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedMedia(!expandedMedia)}
                className="h-8 w-8 p-0"
              >
                {expandedMedia ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          {expandedMedia && (
            <CardContent className="space-y-6">
            <FileUploader
              label="Profile Image"
              bucketName="profile-images"
              value={profile.profile_image_url || null}
              onChange={(url) => setProfile({ ...profile, profile_image_url: url || '' })}
              fileType="image"
              description="Upload your profile photo. Recommended: Square image, at least 500x500px."
            />

            <FileUploader
              label="Resume/CV"
              bucketName="resumes"
              value={profile.resume_url || null}
              onChange={(url) => setProfile({ ...profile, resume_url: url || '' })}
              fileType="pdf"
              description="Upload your resume or CV in PDF format."
            />

          </CardContent>
          )}
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveProfile} disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
