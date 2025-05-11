export function detectPlatform(url: string): string | null {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // YouTube
    if (
      hostname.includes("youtube.com") || 
      hostname.includes("youtu.be") ||
      hostname.includes("youtube-nocookie.com")
    ) {
      return "YouTube";
    }
    
    // Instagram
    if (
      hostname.includes("instagram.com") || 
      hostname.includes("instagr.am")
    ) {
      return "Instagram";
    }
    
    // Facebook
    if (
      hostname.includes("facebook.com") || 
      hostname.includes("fb.com") ||
      hostname.includes("fb.watch")
    ) {
      return "Facebook";
    }
    
    // TikTok
    if (
      hostname.includes("tiktok.com") || 
      hostname.includes("vm.tiktok.com")
    ) {
      return "TikTok";
    }
    
    // Threads
    if (hostname.includes("threads.net")) {
      return "Threads";
    }
    
    return null;
  } catch (error) {
    // If the URL is invalid, return null
    return null;
  }
}

export function getVideoId(url: string, platform: string): string | null {
  if (!url || !platform) return null;
  
  try {
    const urlObj = new URL(url);
    
    switch (platform.toLowerCase()) {
      case "youtube": {
        // Handle youtube.com/watch?v=VIDEO_ID
        if (urlObj.hostname.includes("youtube.com") && urlObj.pathname.includes("/watch")) {
          return urlObj.searchParams.get("v");
        }
        
        // Handle youtu.be/VIDEO_ID
        if (urlObj.hostname.includes("youtu.be")) {
          return urlObj.pathname.substring(1);
        }
        
        return null;
      }
      
      case "instagram": {
        // Handle instagram.com/p/CODE/ or instagram.com/reel/CODE/
        const pathSegments = urlObj.pathname.split("/").filter(Boolean);
        if ((pathSegments[0] === "p" || pathSegments[0] === "reel") && pathSegments[1]) {
          return pathSegments[1];
        }
        
        return null;
      }
      
      case "facebook": {
        // Facebook URLs are complex and varied, but most video URLs have a video ID
        // This is a simplified version
        if (urlObj.pathname.includes("/videos/")) {
          const matches = urlObj.pathname.match(/\/videos\/(\d+)/);
          return matches ? matches[1] : null;
        }
        
        return null;
      }
      
      case "tiktok": {
        // Handle tiktok.com/@username/video/VIDEO_ID
        const pathSegments = urlObj.pathname.split("/").filter(Boolean);
        if (pathSegments.includes("video") && pathSegments.length > 2) {
          const videoIdIndex = pathSegments.indexOf("video") + 1;
          if (videoIdIndex < pathSegments.length) {
            return pathSegments[videoIdIndex];
          }
        }
        
        return null;
      }
      
      case "threads": {
        // Handle threads.net/@username/post/POST_ID
        const pathSegments = urlObj.pathname.split("/").filter(Boolean);
        if (pathSegments.includes("post") && pathSegments.length > 2) {
          const postIdIndex = pathSegments.indexOf("post") + 1;
          if (postIdIndex < pathSegments.length) {
            return pathSegments[postIdIndex];
          }
        }
        
        return null;
      }
      
      default:
        return null;
    }
  } catch (error) {
    return null;
  }
}