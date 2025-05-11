import Link from "next/link";
import { Download } from "lucide-react";
import { getFooterSettings } from "@/lib/settings";

export default async function Footer() {
  const settings = await getFooterSettings();

  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-950 border-t">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">Vidza</span>
            </div>
            {settings?.footer_text && (
              <p className="text-sm text-muted-foreground text-center md:text-left">
                {settings.footer_text}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6">
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Resources</h2>
              <ul className="text-muted-foreground font-medium">
                <li className="mb-2">
                  <Link href="#" className="hover:text-foreground transition-colors">Documentation</Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">Blog</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Follow us</h2>
              <ul className="text-muted-foreground font-medium">
                {settings?.social_links.map((link, index) => (
                  <li key={index} className="mb-2">
                    <Link 
                      href={link.url} 
                      className="hover:text-foreground transition-colors" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {link.platform}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase">Contact</h2>
              <ul className="text-muted-foreground font-medium">
                {settings?.contact_email && (
                  <li className="mb-2">
                    <a 
                      href={`mailto:${settings.contact_email}`} 
                      className="hover:text-foreground transition-colors"
                    >
                      {settings.contact_email}
                    </a>
                  </li>
                )}
                {settings?.contact_phone && (
                  <li>
                    <a 
                      href={`tel:${settings.contact_phone}`} 
                      className="hover:text-foreground transition-colors"
                    >
                      {settings.contact_phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-4">
          <p className="text-center text-xs text-muted-foreground">
            {settings?.copyright_text || `© ${new Date().getFullYear()} Vidza. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}