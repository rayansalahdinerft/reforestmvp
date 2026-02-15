import { useState, useRef } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PRESET_AVATARS } from "@/utils/avatarResolver";

interface AvatarPickerProps {
  currentAvatar: string;
  walletAddress: string;
  onAvatarChanged: () => void;
}

const AvatarPicker = ({ currentAvatar, walletAddress, onAvatarChanged }: AvatarPickerProps) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectPreset = async (index: number) => {
    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke("update-display-name", {
        body: { walletAddress: walletAddress.toLowerCase(), avatarUrl: `preset:${index}` },
      });
      if (error) throw error;
      toast.success("Avatar updated! 🎨");
      onAvatarChanged();
      setOpen(false);
    } catch (err) {
      toast.error("Failed to update avatar");
      console.error(err);
    }
    setSaving(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large (max 2MB)");
      return;
    }

    setSaving(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${walletAddress.toLowerCase()}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error } = await supabase.functions.invoke("update-display-name", {
        body: { walletAddress: walletAddress.toLowerCase(), avatarUrl: publicUrl },
      });
      if (error) throw error;

      toast.success("Avatar uploaded! 📸");
      onAvatarChanged();
      setOpen(false);
    } catch (err) {
      toast.error("Upload failed");
      console.error(err);
    }
    setSaving(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative group w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all">
          <img src={currentAvatar} alt="avatar" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Choose your avatar</p>

        {saving && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}

        {!saving && (
          <>
            <div className="grid grid-cols-4 gap-2 mb-3 max-h-48 overflow-y-auto scrollbar-none">
              {PRESET_AVATARS.map((av, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectPreset(i)}
                  className="w-full aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all hover:scale-105"
                >
                  <img src={av} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-sm text-muted-foreground hover:text-foreground transition-all"
            >
              <Upload className="w-4 h-4" />
              Import your own
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileUpload}
            />
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AvatarPicker;
