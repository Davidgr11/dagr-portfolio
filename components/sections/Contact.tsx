'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FadeIn } from '@/components/animations/FadeIn';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';

interface ContactProps {
  locale: string;
}

export function Contact({ locale }: ContactProps) {
  const t = useTranslations('sections');
  const tContact = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showForm, setShowForm] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          is_read: false,
        });

      if (error) throw error;

      setSubmitStatus('success');
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');

      // Reset error message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setShowForm(true);
    setSubmitStatus('idle');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Title */}
        <FadeIn>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 mb-4">
              <Mail className="h-6 w-6 text-cyan-400" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">
              {tContact('title')}
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              {tContact('subtitle')}
            </p>
          </div>
        </FadeIn>

        {/* Contact Form or Success Message */}
        <FadeIn delay={0.2}>
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl shadow-cyan-500/10">
            {showForm ? (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    {tContact('formTitle')}
                  </CardTitle>
                  <CardDescription className="text-white/70 text-base">
                    {tContact('formSubtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email - 2 columns on desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name Input */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white/90 text-base">
                          {tContact('name')}
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={tContact('namePlaceholder')}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400/50 focus:ring-cyan-400/50"
                        />
                      </div>

                      {/* Email Input */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/90 text-base">
                          {tContact('email')}
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={tContact('emailPlaceholder')}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400/50 focus:ring-cyan-400/50"
                        />
                      </div>
                    </div>

                    {/* Subject Input - Full width */}
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white/90 text-base">
                        {tContact('subject')}
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder={tContact('subjectPlaceholder')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400/50 focus:ring-cyan-400/50"
                      />
                    </div>

                    {/* Message Textarea - Full width */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white/90 text-base">
                        {tContact('message')}
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={tContact('messagePlaceholder')}
                        rows={5}
                        className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Error Message */}
                    {submitStatus === 'error' && (
                      <div className="p-4 rounded-lg bg-red-500/20 border border-red-400/30 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-300 font-medium">{tContact('errorTitle')}</p>
                          <p className="text-red-300/80 text-base mt-1">{tContact('errorMessage')}</p>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-2xl shadow-blue-500/50 border-0"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          {tContact('sending')}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {tContact('send')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <CardContent className="py-12">
                {/* Success Message */}
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-500/20 border border-green-400/30">
                    <CheckCircle2 className="h-12 w-12 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-300 mb-2">
                      {tContact('successTitle')}
                    </h3>
                    <p className="text-green-300/80 text-base max-w-md mx-auto">
                      {tContact('successMessage')}
                    </p>
                  </div>
                  <Button
                    onClick={handleSendAnother}
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-cyan-400/50"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {tContact('sendAnother')}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}
