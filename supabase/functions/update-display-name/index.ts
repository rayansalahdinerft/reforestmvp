import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { walletAddress, displayName, avatarUrl } = await req.json();

    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: 'walletAddress is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const updatePayload: Record<string, any> = {};

    // Handle display name update
    if (displayName !== undefined) {
      const sanitized = displayName
        ? displayName.trim().slice(0, 20).replace(/[^a-zA-Z0-9\s_\-\.🌱🌳🌲🌿🍃]/g, '')
        : null;
      updatePayload.display_name = sanitized || null;
    }

    // Handle avatar URL update
    if (avatarUrl !== undefined) {
      updatePayload.avatar_url = avatarUrl || null;
    }

    if (Object.keys(updatePayload).length === 0) {
      return new Response(
        JSON.stringify({ error: 'Nothing to update' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Upsert: create row if it doesn't exist yet
    const { data, error } = await supabase
      .from('wallet_stats')
      .upsert(
        { wallet_address: normalizedAddress, ...updatePayload },
        { onConflict: 'wallet_address' }
      )
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, displayName: data.display_name, avatarUrl: data.avatar_url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
