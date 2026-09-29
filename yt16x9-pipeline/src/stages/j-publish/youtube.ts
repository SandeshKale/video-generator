/**
 * BUILD_PLAN.md section 5.11. LAUNCH BLOCKER (do this in Week 1, not Week
 * 10 -- see the validation doc's independent finding 3.5.1): a YouTube API
 * project created after 28 Jul 2020 uploads videos as forced-private until
 * it passes Google's compliance audit
 * (developers.google.com/youtube/v3/guides/quota_and_compliance_audits).
 * Submit that audit application immediately; it has no published SLA.
 * Until it clears, publish pipeline output through YouTube Studio manually
 * -- do not block the editorial loop on Google's timeline.
 */
import { google } from "googleapis";

export async function isApiProjectAudited(): Promise<boolean> {
  // TODO: track this as a config flag once the audit clears; there is no
  // API call that reports audit status directly.
  return false;
}

export async function uploadVideo(params: {
  filePath: string;
  title: string;
  description: string; // must include chapter-formatted timestamps (0:00 first, >=3 stamps, >=10s apart, ascending)
  publishAtIso: string;
  madeForKids: boolean;
  aiDisclosure: "none" | "photoreal" | "animated";
}): Promise<{ videoId: string }> {
  const audited = await isApiProjectAudited();
  if (!audited) {
    throw new Error(
      "YouTube API project is not yet audited -- videos.insert will be forced private regardless of " +
        "status.privacyStatus. Publish this video through YouTube Studio manually instead of calling this function.",
    );
  }

  const auth = new google.auth.OAuth2(process.env.YOUTUBE_CLIENT_ID, process.env.YOUTUBE_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
  const youtube = google.youtube({ version: "v3", auth });

  throw new Error(
    `TODO Week 10: youtube.videos.insert({ part: ["snippet","status"], requestBody: { snippet: { title, description }, ` +
      `status: { privacyStatus: "private", publishAt: "${params.publishAtIso}", selfDeclaredMadeForKids: ${params.madeForKids} } }, ` +
      `media: { body: fs.createReadStream(filePath) } }). publishAt is ignored unless privacyStatus is "private". ` +
      `Set AI disclosure via Studio/API fields when aiDisclosure="${params.aiDisclosure}".`,
  );
}
