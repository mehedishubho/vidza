"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";

interface Format {
  quality: string;
  format: string;
  size: string;
  url: string;
}

interface VideoInfoProps {
  title: string;
  platform: string;
  formats: Format[];
  onDownload: (quality: string, format: string, url: string) => void;
}

export default function VideoInfo({ title, platform, formats, onDownload }: VideoInfoProps) {
  const getFormatIcon = (format: string) => {
    if (format.toLowerCase() === "mp3") {
      return "🎵";
    } else if (["mp4", "webm", "mov"].includes(format.toLowerCase())) {
      return "🎬";
    }
    return "📁";
  };
  
  const getQualityColor = (quality: string) => {
    if (quality.includes("1080p") || quality.includes("HD")) {
      return "text-green-500";
    } else if (quality.includes("720p")) {
      return "text-blue-500";
    } else if (quality.includes("480p")) {
      return "text-yellow-500";
    } else if (quality.includes("Audio")) {
      return "text-purple-500";
    }
    return "text-gray-500";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold line-clamp-2" title={title}>
        {title}
      </h2>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          Available Formats
        </h3>
        <div className="space-y-2">
          {formats.map((format, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg" aria-hidden="true">
                  {getFormatIcon(format.format)}
                </span>
                <div>
                  <p className={`font-medium ${getQualityColor(format.quality)}`}>
                    {format.quality}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format.format.toUpperCase()} • {format.size}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onDownload(format.quality, format.format, format.url)}
                className="gap-1"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        Downloaded content should only be used for personal purposes.
        Please respect the copyright and terms of service of {platform}.
      </p>
    </div>
  );
}