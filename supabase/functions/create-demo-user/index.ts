import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password, full_name, role, role_setup } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Check if user already exists by trying to get them
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find(u => u.email === email);

    if (existing) {
      // User exists, just return success — client will sign in normally
      return new Response(JSON.stringify({ exists: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create user with auto-confirm
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = newUser.user.id;

    // Update profile
    await supabaseAdmin.from("profiles").update({ full_name }).eq("id", userId);

    // Assign role
    await supabaseAdmin.from("user_roles").insert({ user_id: userId, role, is_active: true });

    // Role-specific setup
    if (role === "teacher" || role_setup === "teacher") {
      await supabaseAdmin.from("teachers").insert({ id: userId, active: true, languages_taught: ["en", "pt"] });
    }
    if (role === "student" || role_setup === "student") {
      await supabaseAdmin.from("student_preferences").insert({ user_id: userId });
    }
    if (role === "company_hr" || role_setup === "company_hr") {
      const { data: company } = await supabaseAdmin
        .from("companies")
        .insert({ name: "Demo Corp", cnpj: "00000000000100" })
        .select()
        .single();
      if (company) {
        await supabaseAdmin.from("company_employees").insert({
          company_id: company.id,
          user_id: userId,
          active: true,
          approved_at: new Date().toISOString(),
        });
      }
    }

    return new Response(JSON.stringify({ created: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
