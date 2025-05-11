import { detectPlatform } from "@/lib/platform-detector";
import { spawn } from "child_process";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Preliminary check to ensure yt-dlp is executable
    try {
      console.log("Attempting to get yt-dlp version as a preliminary check...");
      await new Promise((resolve, reject) => {
        const ytdlp = spawn("yt-dlp", ["--version"]);
        let stdout = "";
        let stderr = "";
        ytdlp.stdout.on("data", (data) => (stdout += data.toString()));
        ytdlp.stderr.on("data", (data) => (stderr += data.toString()));
        ytdlp.on("close", (code) => {
          if (code === 0) {
            console.log(
              "yt-dlp preliminary version check successful. Version:",
              stdout.trim()
            );
            resolve(stdout);
          } else {
            console.error(
              "yt-dlp preliminary check failed with code:",
              code,
              "stderr:",
              stderr.trim()
            );
            reject(new Error(`yt-dlp --version failed: ${stderr.trim()}`));
          }
        });
        ytdlp.on("error", (err) => {
          console.error("Failed to start yt-dlp for preliminary check:", err);
          reject(err);
        });
      });
    } catch (preliminaryError) {
      console.error(
        "Critical: yt-dlp failed its preliminary check (e.g., binary not found or not executable).",
        preliminaryError
      );
      return NextResponse.json(
        {
          error:
            "Video processing component failed to initialize. Please contact support.",
          details:
            preliminaryError.message ||
            "yt-dlp binary might be missing or not executable.",
        },
        { status: 500 }
      );
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const platform = detectPlatform(url);
    if (!platform) {
      return NextResponse.json(
        { error: "Unsupported platform" },
        { status: 400 }
      );
    }

    // Configure youtube-dl options based on platform
    const options = {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      extractAudio: false,
      format: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
      addHeader:
        platform === "Threads"
          ? [
              "User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language:en-US,en;q=0.5",
              "Cookie:ig_did=; csrftoken=; mid=; ig_nrcb=1",
            ]
          : [],
    };

    try {
      console.log("Calling yt-dlp with URL:", url);
      const ytDlpArgs = [
        url,
        "--dump-single-json",
        "--no-warnings",
        "--no-call-home",
        "--no-check-certificate",
        "--prefer-free-formats",
        "--youtube-skip-dash-manifest",
        platform === "Threads" ? "--add-header" : "",
        platform === "Threads"
          ? "User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
          : "",
        platform === "Threads" ? "--add-header" : "",
        platform === "Threads"
          ? "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
          : "",
        platform === "Threads" ? "--add-header" : "",
        platform === "Threads" ? "Accept-Language:en-US,en;q=0.5" : "",
        platform === "Threads" ? "--add-header" : "",
        platform === "Threads"
          ? "Cookie:ig_did=; csrftoken=; mid=; ig_nrcb=1"
          : "",
        "--format",
        "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
      ].filter(Boolean); // Filter out empty strings from conditional headers

      console.log("Calling yt-dlp with args:", ytDlpArgs.join(" "));

      const videoInfoPromise = new Promise((resolve, reject) => {
        const ytdlp = spawn("yt-dlp", ytDlpArgs);
        let stdoutData = "";
        let stderrData = "";

        ytdlp.stdout.on("data", (data) => {
          stdoutData += data.toString();
        });

        ytdlp.stderr.on("data", (data) => {
          stderrData += data.toString();
        });

        ytdlp.on("close", (code) => {
          if (code === 0) {
            try {
              const jsonData = JSON.parse(stdoutData);
              resolve(jsonData);
            } catch (parseError) {
              console.error(
                "Failed to parse yt-dlp JSON output:",
                parseError,
                "Raw output:",
                stdoutData
              );
              reject(
                new Error("Failed to parse video information from yt-dlp.")
              );
            }
          } else {
            console.error(
              `yt-dlp process exited with code ${code}. Stderr: ${stderrData}`
            );
            const error = new Error(
              `Failed to fetch video information. yt-dlp exited with code ${code}.`
            );
            (error as any).stderr = stderrData;
            (error as any).stdout = stdoutData;
            reject(error);
          }
        });

        ytdlp.on("error", (err) => {
          console.error("Failed to start yt-dlp process:", err);
          reject(new Error("Failed to start video processing component."));
        });
      });

      const videoInfo = (await videoInfoPromise) as any;
      console.log(
        "Raw videoInfo from yt-dlp:",
        JSON.stringify(videoInfo, null, 2)
      );

      // Log the keys of videoInfo to understand its structure better
      if (videoInfo) {
        console.log("Keys in videoInfo:", Object.keys(videoInfo).join(", "));
      }

      let formats = [];

      // Ensure videoInfo is defined and has the expected structure
      if (!videoInfo) {
        console.error("yt-dlp error: videoInfo is undefined or null");
        return NextResponse.json(
          {
            error:
              "Failed to process video. Video information could not be retrieved.",
            details: "yt-dlp returned no information.",
            stderr: null,
            stdout: null,
          },
          { status: 500 }
        );
      }

      // Check if videoInfo.formats exists and is an array
      if (videoInfo && Array.isArray(videoInfo.formats)) {
        // Try to get preferred formats first (1080p, 720p, 480p)
        formats = videoInfo.formats
          .filter(
            (f: any) =>
              f.url &&
              f.ext === "mp4" &&
              f.height &&
              [1080, 720, 480].includes(f.height)
          )
          .map((f: any) => ({
            quality:
              f.format_note || (f.height ? `${f.height}p` : "Unknown Quality"),
            format: f.ext,
            size: f.filesize
              ? `${Math.round(f.filesize / 1024 / 1024)} MB`
              : "Unknown",
            url: f.url,
          }))
          .sort((a: any, b: any) => {
            const getQualityNumber = (q: string) =>
              parseInt(q.replace("p", "")) || 0;
            return getQualityNumber(b.quality) - getQualityNumber(a.quality);
          });

        // If no preferred formats are found, get up to 5 other MP4 resolutions
        if (formats.length === 0) {
          console.log(
            "Preferred formats not found, looking for other MP4 resolutions."
          );
          formats = videoInfo.formats
            .filter(
              (f: any) => f.url && f.ext === "mp4" && f.height // Ensure height is present for sorting
            )
            .sort((a: any, b: any) => b.height - a.height) // Sort by height descending
            .slice(0, 5) // Take top 5
            .map((f: any) => ({
              quality:
                f.format_note ||
                (f.height ? `${f.height}p` : "Unknown Quality"),
              format: f.ext,
              size: f.filesize
                ? `${Math.round(f.filesize / 1024 / 1024)} MB`
                : "Unknown",
              url: f.url,
            }));
        }
      } else if (videoInfo) {
        console.warn(
          "videoInfo.formats is not an array or is missing. videoInfo.formats:",
          videoInfo.formats
        );
      }

      // Fallback: If still no formats were found (neither preferred nor top 5 other), try to get the direct URL from videoInfo root
      if (
        formats.length === 0 &&
        videoInfo &&
        videoInfo.url &&
        videoInfo.ext === "mp4"
      ) {
        console.log(
          "No specific formats found, using direct URL from videoInfo root as fallback."
        );
        formats.push({
          quality: videoInfo.height ? `${videoInfo.height}p` : "Best Available",
          format: videoInfo.ext,
          size: videoInfo.filesize
            ? `${Math.round(videoInfo.filesize / 1024 / 1024)} MB`
            : "Unknown",
          url: videoInfo.url,
        });
      }

      // Additional check for videoInfo properties before accessing them for the response
      const title = videoInfo?.title || `${platform} Video`;
      const thumbnail =
        videoInfo?.thumbnail ||
        (videoInfo?.thumbnails && videoInfo.thumbnails[0]?.url) ||
        "";

      if (formats.length === 0) {
        console.error(
          "No downloadable formats could be extracted. Final videoInfo state:",
          JSON.stringify(videoInfo, null, 2)
        );
        throw new Error(
          "No downloadable formats found after processing videoInfo."
        );
      }

      return NextResponse.json({
        title,
        thumbnail,
        formats,
      });
    } catch (error) {
      console.error("yt-dlp error:", error);
      const err = error as any;
      if (err.stderr) {
        console.error("yt-dlp stderr:", err.stderr);
      }
      if (err.stdout) {
        console.error("yt-dlp stdout:", err.stdout);
      }
      return NextResponse.json(
        {
          error: "Failed to process video. Please check the URL and try again.",
          details: error instanceof Error ? error.message : String(error),
          stderr: (error as any).stderr || null,
          stdout: (error as any).stdout || null,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Download error:", error);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
        stack: error.stack || null,
      },
      { status: 500 }
    );
  }
}
