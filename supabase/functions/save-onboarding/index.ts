import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dynamicUserId, firstName, pseudo, avatarUrl } = await req.json();

    if (!dynamicUserId || !firstName?.trim() || !pseudo?.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate pseudo format
    const pseudoClean = pseudo.trim();
    if (pseudoClean.length < 3 || pseudoClean.length > 20) {
      return new Response(
        JSON.stringify({ error: "Pseudo must be 3-20 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(pseudoClean)) {
      return new Response(
        JSON.stringify({ error: "Pseudo contains invalid characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check pseudo uniqueness
    const { data: existing } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("pseudo", pseudoClean)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: "This pseudo is already taken" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upsert profile
    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(
        {
          dynamic_user_id: dynamicUserId,
          first_name: firstName.trim(),
          pseudo: pseudoClean,
          avatar_url: avatarUrl || null,
          onboarding_completed: true,
        },
        { onConflict: "dynamic_user_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error saving profile:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, profile: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Onboarding error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
