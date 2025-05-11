import { CheckCircle } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Multi-Platform Support",
      description: "Download videos from YouTube, Instagram, Facebook, Threads, and TikTok with ease.",
      icon: "🌐",
    },
    {
      title: "High Quality Downloads",
      description: "Choose from multiple quality options including HD, SD, and audio-only formats.",
      icon: "✨",
    },
    {
      title: "Fast & Reliable",
      description: "Our optimized servers ensure quick downloads without interruptions.",
      icon: "⚡",
    },
    {
      title: "No Registration Required",
      description: "No account needed - just paste the URL and download immediately.",
      icon: "🔒",
    },
    {
      title: "User-Friendly Interface",
      description: "Simple, intuitive design makes downloading videos a breeze.",
      icon: "👌",
    },
    {
      title: "Completely Free",
      description: "All features are available at no cost, with no hidden fees.",
      icon: "💸",
    },
  ];

  return (
    <section id="features" className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Why Choose Our Video Downloader</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our tool offers everything you need to download your favorite videos with just a few clicks.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card/50 border rounded-xl p-6 hover:shadow-md transition-all hover:bg-card hover:-translate-y-1"
          >
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-16 max-w-3xl mx-auto p-6 bg-primary/5 rounded-xl border border-primary/10">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-primary/10 rounded-full p-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">100% Safe & Secure</h3>
            <p className="text-muted-foreground">
              We don't store your videos or personal information. Your privacy is our priority.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}