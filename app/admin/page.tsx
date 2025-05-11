"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  getAllSettings,
  updateFooterSettings,
  updateSeoSettings,
  updateSiteSettings,
  type FooterSettings,
  type SeoSettings,
  type SiteSettings,
} from "@/lib/settings";
import { ExternalLink, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [seoSettings, setSeoSettings] = useState<SeoSettings | null>(null);
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const { site, seo, footer } = await getAllSettings();
        setSiteSettings(site);
        setSeoSettings(seo);
        setFooterSettings(footer);
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Settings",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred while loading settings. Please check the console for more details and try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSiteSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;

    setIsLoading(true);
    const success = await updateSiteSettings(siteSettings);
    setIsLoading(false);

    if (success) {
      toast({
        title: "Settings updated",
        description: "Site settings have been saved successfully.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update site settings. Please try again.",
      });
    }
  };

  const handleSeoSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seoSettings) return;

    setIsLoading(true);
    const success = await updateSeoSettings(seoSettings);
    setIsLoading(false);

    if (success) {
      toast({
        title: "Settings updated",
        description: "SEO settings have been saved successfully.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update SEO settings. Please try again.",
      });
    }
  };

  const handleFooterSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerSettings) return;

    setIsLoading(true);
    const success = await updateFooterSettings(footerSettings);
    setIsLoading(false);

    if (success) {
      toast({
        title: "Settings updated",
        description: "Footer settings have been saved successfully.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update footer settings. Please try again.",
      });
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "favicon"
  ) => {
    const file = e.target.files?.[0];
    if (!file || !siteSettings) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();

      if (type === "logo") {
        setSiteSettings({ ...siteSettings, logo_url: url });
      } else {
        setSiteSettings({ ...siteSettings, favicon_url: url });
      }

      toast({
        title: "File uploaded",
        description: `${
          type === "logo" ? "Logo" : "Favicon"
        } has been uploaded successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!siteSettings || !seoSettings || !footerSettings) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild variant="outline">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Visit Website</span>
            <ExternalLink className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <form onSubmit={handleSiteSettingsSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Site Name
                  </label>
                  <Input
                    value={siteSettings.site_name}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        site_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Logo</label>
                  <div className="flex items-center gap-4">
                    {siteSettings.logo_url && (
                      <img
                        src={siteSettings.logo_url}
                        alt="Site Logo"
                        className="h-12 w-auto"
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "logo")}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Favicon
                  </label>
                  <div className="flex items-center gap-4">
                    {siteSettings.favicon_url && (
                      <img
                        src={siteSettings.favicon_url}
                        alt="Favicon"
                        className="h-8 w-8"
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "favicon")}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card className="p-6">
            <form onSubmit={handleSeoSettingsSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Meta Title
                  </label>
                  <Input
                    value={seoSettings.meta_title}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        meta_title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Meta Description
                  </label>
                  <Textarea
                    value={seoSettings.meta_description}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        meta_description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Meta Keywords
                  </label>
                  <Input
                    value={seoSettings.meta_keywords}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        meta_keywords: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    OG Title
                  </label>
                  <Input
                    value={seoSettings.og_title}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        og_title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    OG Description
                  </label>
                  <Textarea
                    value={seoSettings.og_description}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        og_description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    OG Image URL
                  </label>
                  <Input
                    value={seoSettings.og_image_url}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        og_image_url: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Custom Head Code
                  </label>
                  <Textarea
                    value={seoSettings.custom_head}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        custom_head: e.target.value,
                      })
                    }
                    placeholder="Add custom code to be inserted in the <head> section"
                    className="font-mono text-sm"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Custom Body Code (Start)
                  </label>
                  <Textarea
                    value={seoSettings.custom_body}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        custom_body: e.target.value,
                      })
                    }
                    placeholder="Add custom code to be inserted at the start of the <body> section"
                    className="font-mono text-sm"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Custom Footer Code
                  </label>
                  <Textarea
                    value={seoSettings.custom_footer}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        custom_footer: e.target.value,
                      })
                    }
                    placeholder="Add custom code to be inserted before closing </body> tag"
                    className="font-mono text-sm"
                    rows={4}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update SEO"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <Card className="p-6">
            <form onSubmit={handleFooterSettingsSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Footer Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Footer Text
                  </label>
                  <Textarea
                    value={footerSettings.footer_text}
                    onChange={(e) =>
                      setFooterSettings({
                        ...footerSettings,
                        footer_text: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Copyright Text
                  </label>
                  <Input
                    value={footerSettings.copyright_text}
                    onChange={(e) =>
                      setFooterSettings({
                        ...footerSettings,
                        copyright_text: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Contact Email
                  </label>
                  <Input
                    type="email"
                    value={footerSettings.contact_email}
                    onChange={(e) =>
                      setFooterSettings({
                        ...footerSettings,
                        contact_email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Contact Phone
                  </label>
                  <Input
                    type="tel"
                    value={footerSettings.contact_phone}
                    onChange={(e) =>
                      setFooterSettings({
                        ...footerSettings,
                        contact_phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Social Links
                  </label>
                  {footerSettings.social_links.map((link, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Platform (e.g., Twitter)"
                        value={link.platform}
                        onChange={(e) => {
                          const newLinks = [...footerSettings.social_links];
                          newLinks[index] = {
                            ...link,
                            platform: e.target.value,
                          };
                          setFooterSettings({
                            ...footerSettings,
                            social_links: newLinks,
                          });
                        }}
                      />
                      <Input
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...footerSettings.social_links];
                          newLinks[index] = { ...link, url: e.target.value };
                          setFooterSettings({
                            ...footerSettings,
                            social_links: newLinks,
                          });
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          const newLinks = footerSettings.social_links.filter(
                            (_, i) => i !== index
                          );
                          setFooterSettings({
                            ...footerSettings,
                            social_links: newLinks,
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newLinks = [
                        ...footerSettings.social_links,
                        { platform: "", url: "", icon: "" },
                      ];
                      setFooterSettings({
                        ...footerSettings,
                        social_links: newLinks,
                      });
                    }}
                  >
                    Add Social Link
                  </Button>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Footer Settings"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
