import { Montserrat } from 'next/font/google';
import VideoDownloader from '@/components/VideoDownloader';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Features from '@/components/Features';
import Platforms from '@/components/Platforms';

const montserrat = Montserrat({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 mb-4 ${montserrat.className}`}>
            Video Downloader
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Download videos from YouTube, Instagram, Facebook, Threads, and TikTok in seconds.
          </p>
        </div>
        
        <VideoDownloader />
        
        <Platforms />
        
        <Features />
      </div>
      <Footer />
    </main>
  );
}