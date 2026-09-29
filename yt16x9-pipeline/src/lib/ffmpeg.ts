/** Thin wrapper around Bun.spawn for ffmpeg/ffprobe -- no fluent-ffmpeg
 * dependency needed, Bun's own spawn covers everything this pipeline uses. */

export async function runFfmpeg(args: string[]): Promise<void> {
  const proc = Bun.spawn(["ffmpeg", "-y", ...args], { stdout: "inherit", stderr: "inherit" });
  const code = await proc.exited;
  if (code !== 0) throw new Error(`ffmpeg exited ${code}: ffmpeg ${args.join(" ")}`);
}

export async function runFfprobeJson(args: string[]): Promise<any> {
  const proc = Bun.spawn(["ffprobe", "-v", "error", "-of", "json", ...args], { stdout: "pipe", stderr: "inherit" });
  const out = await new Response(proc.stdout).text();
  const code = await proc.exited;
  if (code !== 0) throw new Error(`ffprobe exited ${code}: ffprobe ${args.join(" ")}`);
  return JSON.parse(out);
}
