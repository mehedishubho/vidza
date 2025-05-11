import { Badge } from "@/components/ui/badge";
import { 
  Youtube, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  Music 
} from "lucide-react";

interface PlatformBadgeProps {
  platform: string;
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  // Map platforms to their details
  const platformMap: Record<string, { icon: JSX.Element; color: string; label: string }> = {
    "youtube": { 
      icon: <Youtube className="h-3 w-3" />, 
      color: "bg-red-500/10 text-red-600 hover:bg-red-500/20", 
      label: "YouTube" 
    },
    "instagram": { 
      icon: <Instagram className="h-3 w-3" />, 
      color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20", 
      label: "Instagram" 
    },
    "facebook": { 
      icon: <Facebook className="h-3 w-3" />, 
      color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20", 
      label: "Facebook" 
    },
    "threads": { 
      icon: <MessageCircle className="h-3 w-3" />, 
      color: "bg-black/10 text-black dark:text-white hover:bg-black/20", 
      label: "Threads" 
    },
    "tiktok": { 
      icon: <Music className="h-3 w-3" />, 
      color: "bg-black/10 text-black dark:text-white hover:bg-black/20", 
      label: "TikTok" 
    },
  };
  
  // Get platform details or use default
  const platformDetails = platformMap[platform.toLowerCase()] || {
    icon: <Music className="h-3 w-3" />,
    color: "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20",
    label: platform || "Unknown"
  };

  return (
    <Badge 
      variant="outline" 
      className={`${platformDetails.color} transition-colors`}
    >
      {platformDetails.icon}
      <span className="ml-1">{platformDetails.label} detected</span>
    </Badge>
  );
}