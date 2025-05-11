import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true
  }
});

// Add cache for settings
let settingsCache = {
  site: null as SiteSettings | null,
  seo: null as SeoSettings | null,
  footer: null as FooterSettings | null,
  lastFetched: 0
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface SiteSettings {
  id: string;
  site_name: string;
  logo_url: string;
  favicon_url: string;
  created_at: string;
  updated_at: string;
}

export interface SeoSettings {
  id: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  custom_head: string;
  custom_body: string;
  custom_footer: string;
  created_at: string;
  updated_at: string;
}

export interface FooterSettings {
  id: string;
  footer_text: string;
  copyright_text: string;
  social_links: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  // Check cache
  if (settingsCache.site && Date.now() - settingsCache.lastFetched < CACHE_DURATION) {
    return settingsCache.site;
  }

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }

  // Update cache
  settingsCache.site = data;
  settingsCache.lastFetched = Date.now();
  return data;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<boolean> {
  const { data: existingSettings } = await supabase
    .from('site_settings')
    .select('id')
    .limit(1)
    .maybeSingle();

  const id = existingSettings?.id || '1';

  const { error } = await supabase
    .from('site_settings')
    .upsert({ id, ...settings })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating site settings:', error);
    return false;
  }

  // Invalidate cache
  settingsCache.site = null;
  settingsCache.lastFetched = 0;
  return true;
}

export async function getSeoSettings(): Promise<SeoSettings | null> {
  // Check cache
  if (settingsCache.seo && Date.now() - settingsCache.lastFetched < CACHE_DURATION) {
    return settingsCache.seo;
  }

  const { data, error } = await supabase
    .from('seo_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching SEO settings:', error);
    return null;
  }

  // Update cache
  settingsCache.seo = data;
  settingsCache.lastFetched = Date.now();
  return data;
}

export async function updateSeoSettings(settings: Partial<SeoSettings>): Promise<boolean> {
  const { data: existingSettings } = await supabase
    .from('seo_settings')
    .select('id')
    .limit(1)
    .maybeSingle();

  const id = existingSettings?.id || '1';

  const { error } = await supabase
    .from('seo_settings')
    .upsert({ id, ...settings })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating SEO settings:', error);
    return false;
  }

  // Invalidate cache
  settingsCache.seo = null;
  settingsCache.lastFetched = 0;
  return true;
}

export async function getFooterSettings(): Promise<FooterSettings | null> {
  // Check cache
  if (settingsCache.footer && Date.now() - settingsCache.lastFetched < CACHE_DURATION) {
    return settingsCache.footer;
  }

  const { data, error } = await supabase
    .from('footer_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching footer settings:', error);
    return null;
  }

  // Update cache
  settingsCache.footer = data;
  settingsCache.lastFetched = Date.now();
  return data;
}

export async function updateFooterSettings(settings: Partial<FooterSettings>): Promise<boolean> {
  const { data: existingSettings } = await supabase
    .from('footer_settings')
    .select('id')
    .limit(1)
    .maybeSingle();

  const id = existingSettings?.id || '1';

  const { error } = await supabase
    .from('footer_settings')
    .upsert({ id, ...settings })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating footer settings:', error);
    return false;
  }

  // Invalidate cache
  settingsCache.footer = null;
  settingsCache.lastFetched = 0;
  return true;
}

// Add a function to fetch all settings at once
export async function getAllSettings() {
  const [site, seo, footer] = await Promise.all([
    getSiteSettings(),
    getSeoSettings(),
    getFooterSettings(),
  ]);

  return { site, seo, footer };
}