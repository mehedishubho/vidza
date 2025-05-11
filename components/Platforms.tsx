import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Youtube, Instagram, Facebook, MessageCircle, Music } from "lucide-react";

export default function Platforms() {
  const platforms = [
    {
      name: "YouTube",
      icon: <Youtube className="h-8 w-8 text-[#FF0000]" />,
      color: "bg-red-500",
      formats: "MP4, WebM, MP3",
      quality: "Up to 4K",
      bgColor: "bg-[#FFE9E9]",
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-8 w-8 text-[#E4405F]" />,
      color: "bg-gradient-to-tr from-purple-600 to-pink-500",
      formats: "MP4",
      quality: "HD",
      bgColor: "bg-[#FFE9F3]",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-8 w-8 text-[#1877F2]" />,
      color: "bg-blue-600",
      formats: "MP4, WebM",
      quality: "HD",
      bgColor: "bg-[#E9F1FF]",
    },
    {
      name: "Threads",
      icon: <MessageCircle className="h-8 w-8 text-[#7A3CF1]" />,
      color: "bg-black",
      formats: "MP4",
      quality: "HD",
      bgColor: "bg-[#F1E9FF]",
    },
    {
      name: "TikTok",
      icon: <Music className="h-8 w-8 text-white" />,
      color: "bg-black",
      formats: "MP4",
      quality: "HD",
      bgColor: "bg-black",
    },
  ];

  return (
    <section id="platforms" className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Supported Platforms</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Download videos from all of your favorite social media platforms with just a few clicks.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {platforms.map((platform, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-all hover:-translate-y-1">
            <div className={`h-2 w-full ${platform.color}`}></div>
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full ${platform.bgColor} shadow-lg`}>
                {platform.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{platform.name}</h3>
              <div className="text-sm text-muted-foreground">
                <p>Formats: {platform.formats}</p>
                <p>Quality: {platform.quality}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}