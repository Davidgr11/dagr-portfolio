import { createClient } from '@/lib/supabase/server';

/**
 * Translate text from English to Spanish using LibreTranslate API
 * This uses a free, open-source translation API
 * Alternative: Use Google Translate API if you have a key
 */
export async function translateText(
  text: string,
  sourceLang: string = 'en',
  targetLang: string = 'es'
): Promise<string> {
  // Check cache first
  const supabase = await createClient();
  const { data: cached } = await supabase
    .from('translations')
    .select('translated_text')
    .eq('source_text', text)
    .eq('source_lang', sourceLang)
    .eq('target_lang', targetLang)
    .single();

  if (cached) {
    return (cached as { translated_text: string }).translated_text;
  }

  try {
    // Using LibreTranslate (free, no API key required)
    // You can self-host this or use the public instance
    const libreTranslateUrl =
      process.env.LIBRE_TRANSLATE_URL || 'https://libretranslate.com/translate';

    const response = await fetch(libreTranslateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
        api_key: process.env.LIBRE_TRANSLATE_API_KEY || '',
      }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    const translatedText = data.translatedText;

    // Cache the translation
    await supabase.from('translations').insert({
      source_text: text,
      source_lang: sourceLang,
      target_lang: targetLang,
      translated_text: translatedText,
    } as never);

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback: return original text if translation fails
    return text;
  }
}

/**
 * Alternative: Google Translate API implementation
 * Uncomment this if you prefer to use Google Translate
 */
/*
export async function translateTextWithGoogle(
  text: string,
  targetLang: string = 'es'
): Promise<string> {
  const supabase = await createClient();
  const { data: cached } = await supabase
    .from('translations')
    .select('translated_text')
    .eq('source_text', text)
    .eq('target_lang', targetLang)
    .single();

  if (cached) {
    return cached.translated_text;
  }

  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error('Google Translate API error');
    }

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;

    await supabase.from('translations').insert({
      source_text: text,
      source_lang: 'en',
      target_lang: targetLang,
      translated_text: translatedText,
    });

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}
*/

/**
 * Auto-translate all fields that need translation when content is saved in admin
 */
export async function autoTranslateFields(
  fields: Record<string, string>
): Promise<Record<string, string>> {
  const translatedFields: Record<string, string> = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value && typeof value === 'string') {
      translatedFields[key] = await translateText(value);
    }
  }

  return translatedFields;
}
