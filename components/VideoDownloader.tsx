"use client";

import { PlatformBadge } from "@/components/PlatformBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import VideoInfo from "@/components/VideoInfo";
import VideoThumbnail from "@/components/VideoThumbnail";
import { useToast } from "@/hooks/use-toast";
import { detectPlatform } from "@/lib/platform-detector";
import { Check, Link as LinkIcon, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";

interface VideoData {
  title: string;
  thumbnail: string;
  platform: string;
  formats: Array<{
    quality: string;
    format: string;
    size: string;
    url: string;
  }>;
}

export default function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [platform, setPlatform] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const { toast } = useToast();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);

    if (inputUrl) {
      const detectedPlatform = detectPlatform(inputUrl);
      setPlatform(detectedPlatform);
    } else {
      setPlatform(null);
    }
  };

  const handleClearUrl = () => {
    setUrl("");
    setPlatform(null);
    setVideoData(null);
  };

  const handlePasteUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      const detectedPlatform = detectPlatform(text);
      setPlatform(detectedPlatform);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Clipboard access denied",
        description: "Please allow clipboard access or paste the URL manually.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast({
        variant: "destructive",
        title: "URL is required",
        description: "Please enter a video URL to download.",
      });
      return;
    }

    if (!platform) {
      toast({
        variant: "destructive",
        title: "Unsupported platform",
        description: "The URL you entered is not from a supported platform.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let description = errorData.error || "Failed to fetch video info.";
        if (errorData.details) description += ` Details: ${errorData.details}.`;
        if (errorData.stderr)
          description += ` Server Log (stderr): ${String(
            errorData.stderr
          ).substring(0, 150)}${
            String(errorData.stderr).length > 150 ? "..." : ""
          }.`;
        if (errorData.stdout)
          description += ` Server Log (stdout): ${String(
            errorData.stdout
          ).substring(0, 150)}${
            String(errorData.stdout).length > 150 ? "..." : ""
          }.`;
        if (errorData.stack)
          description += ` Stack: ${String(errorData.stack).substring(0, 150)}${
            String(errorData.stack).length > 150 ? "..." : ""
          }.`;

        // Log the full error data to the console for more detailed debugging
        console.error("Backend error response:", errorData);
        throw new Error(description);
      }

      const data = await response.json();
      setVideoData({
        ...data,
        platform,
      });

      toast({
        title: "Video information fetched",
        description: "Choose a format to download the video.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Fetching Video",
        description:
          error instanceof Error
            ? error.message
            : "An unknown error occurred. Please try again.",
        duration: 9000, // Increased duration for potentially longer messages
      });
      // Log the error object caught by this block, which includes the detailed message
      console.error("Frontend handleSubmit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (
    quality: string,
    format: string,
    downloadUrl: string
  ) => {
    try {
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `video.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download started",
        description: `Downloading ${quality} ${format.toUpperCase()} file...`,
        action: (
          <ToastAction
            altText="View downloads"
            onClick={() => window.open(downloadUrl)}
          >
            View
          </ToastAction>
        ),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to start download. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-t border-blue-500/20 bg-card/95 backdrop-blur-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="url"
                  placeholder="Paste video URL here..."
                  className="pr-10"
                  value={url}
                  onChange={handleUrlChange}
                  disabled={isLoading}
                />
                {url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-destructive h-7 w-7"
                    onClick={handleClearUrl}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={handlePasteUrl}
                disabled={isLoading}
                className="gap-2 min-w-[100px]"
              >
                <LinkIcon className="h-4 w-4" />
                Paste
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !url}
                className="gap-2 min-w-[100px]"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Fetch
              </Button>
            </div>

            {platform && (
              <div className="mt-2 flex items-center">
                <PlatformBadge platform={platform} />
              </div>
            )}
          </div>

          {videoData && !isLoading && (
            <div className="mt-6 space-y-6 animate-in fade-in-50 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VideoThumbnail
                  src={videoData.thumbnail}
                  alt={videoData.title}
                  platform={videoData.platform}
                />
                <VideoInfo
                  title={videoData.title}
                  platform={videoData.platform}
                  formats={videoData.formats}
                  onDownload={handleDownload}
                />
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                <p className="text-muted-foreground animate-pulse">
                  Fetching video information...
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
