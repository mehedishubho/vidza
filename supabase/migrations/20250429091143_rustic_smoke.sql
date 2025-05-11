/*
  # Create Settings Tables

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `site_name` (text)
      - `logo_url` (text)
      - `favicon_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `seo_settings`
      - `id` (uuid, primary key)
      - `meta_title` (text)
      - `meta_description` (text)
      - `meta_keywords` (text)
      - `og_title` (text)
      - `og_description` (text)
      - `og_image_url` (text)
      - `custom_head` (text)
      - `custom_body` (text)
      - `custom_footer` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `footer_settings`
      - `id` (uuid, primary key)
      - `footer_text` (text)
      - `copyright_text` (text)
      - `social_links` (jsonb)
      - `contact_email` (text)
      - `contact_phone` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT '',
  logo_url text DEFAULT '',
  favicon_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create seo_settings table
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_title text NOT NULL DEFAULT '',
  meta_description text DEFAULT '',
  meta_keywords text DEFAULT '',
  og_title text DEFAULT '',
  og_description text DEFAULT '',
  og_image_url text DEFAULT '',
  custom_head text DEFAULT '',
  custom_body text DEFAULT '',
  custom_footer text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create footer_settings table
CREATE TABLE IF NOT EXISTS footer_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  footer_text text DEFAULT '',
  copyright_text text DEFAULT '',
  social_links jsonb DEFAULT '[]'::jsonb,
  contact_email text DEFAULT '',
  contact_phone text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Allow full access to authenticated users" ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON seo_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON footer_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_footer_settings_updated_at
  BEFORE UPDATE ON footer_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();