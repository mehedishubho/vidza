import Image from "next/image";
import { cn } from "@/lib/utils";

interface VideoThumbnailProps {
  src: string;
  alt: string;
  platform: string;
}

export default function VideoThumbnail({ src, alt, platform }: VideoThumbnailProps) {
  const platformOverlayClass = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "youtube":
        return "bg-red-500";
      case "instagram":
        return "bg-gradient-to-tr from-purple-600 to-pink-500";
      case "facebook":
        return "bg-blue-600";
      case "threads":
        return "bg-black";
      case "tiktok":
        return "bg-black";
      default:
        return "bg-gray-800";
    }
  };

  const platformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "youtube":
        return "▶️";
      case "instagram":
        return "📸";
      case "facebook":
        return "👍";
      case "threads":
        return "🧵";
      case "tiktok":
        return "🎵";
      default:
        return "🎬";
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden aspect-video bg-muted transition-all group">
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all z-10"></div>
      
      <div className={cn(
        "absolute top-2 left-2 py-1 px-2 rounded text-white text-xs font-medium flex items-center gap-1 z-20",
        platformOverlayClass(platform)
      )}>
        <span>{platformIcon(platform)}</span>
        <span>{platform}</span>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-black/60 flex items-center justify-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </div>
      </div>
      
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}