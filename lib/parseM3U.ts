import { Channel } from "@/types/channel";

export function parseM3U(text: string): Channel[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const result: Channel[] = [];
  let meta: Partial<Channel> = {};

  for (const line of lines) {
    if (line.startsWith("#EXTINF")) {
      meta = {};
      const nameMatch = line.match(/,(.+)$/);
      if (nameMatch) meta.name = nameMatch[1].trim();
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      if (logoMatch) meta.logo = logoMatch[1];
      const groupMatch = line.match(/group-title="([^"]*)"/);
      if (groupMatch) meta.group = groupMatch[1];
    } else if (
      line.startsWith("http") ||
      line.startsWith("rtmp") ||
      line.startsWith("rtsp")
    ) {
      if (meta.name) {
        result.push({
          name: meta.name,
          url: line,
          logo: meta.logo,
          group: meta.group,
          key: meta.name + "_" + line.slice(-20),
        });
        meta = {};
      }
    }
  }
  return result;
}
