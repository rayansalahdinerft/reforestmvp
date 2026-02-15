import avatar1 from "@/assets/avatars/avatar1.png";
import avatar2 from "@/assets/avatars/avatar2.png";
import avatar3 from "@/assets/avatars/avatar3.png";
import avatar4 from "@/assets/avatars/avatar4.png";
import avatar5 from "@/assets/avatars/avatar5.png";
import avatar6 from "@/assets/avatars/avatar6.png";
import avatar7 from "@/assets/avatars/avatar7.png";
import avatar8 from "@/assets/avatars/avatar8.png";
import avatar9 from "@/assets/avatars/avatar9.png";
import avatar10 from "@/assets/avatars/avatar10.png";
import avatar11 from "@/assets/avatars/avatar11.png";
import avatar12 from "@/assets/avatars/avatar12.png";

export const PRESET_AVATARS = [
  avatar1, avatar2, avatar3, avatar4, avatar5, avatar6,
  avatar7, avatar8, avatar9, avatar10, avatar11, avatar12,
];

/**
 * Resolve an avatar URL from the database.
 * Preset avatars are stored as "preset:0" through "preset:11".
 * Custom uploads are stored as full URLs.
 */
export const resolveAvatarUrl = (storedUrl: string | null | undefined, fallback: string): string => {
  if (!storedUrl) return fallback;
  
  const presetMatch = storedUrl.match(/^preset:(\d+)$/);
  if (presetMatch) {
    const index = parseInt(presetMatch[1], 10);
    return PRESET_AVATARS[index] ?? fallback;
  }
  
  return storedUrl;
};
