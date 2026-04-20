import { createClient as createSupabaseServerClient } from "@/src/utils/supabase/server";

function envFlagEnabled(raw: string | undefined): boolean {
  if (!raw) return false;
  const v = raw.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function isRouteSpecificGateEnabled(routeKey: "vocab_enrich" | "openai_generate_prompt"): boolean {
  if (routeKey === "vocab_enrich") {
    return envFlagEnabled(process.env.REQUIRE_AUTH_FOR_VOCAB_ENRICH);
  }
  return envFlagEnabled(process.env.REQUIRE_AUTH_FOR_OPENAI_GENERATE_PROMPT);
}

/**
 * Staged rollout flag:
 * - false (default): keep current public behavior
 * - true: require authenticated Supabase user
 * Enable in production by setting:
 *   REQUIRE_AUTH_FOR_HIGH_COST_AI_ROUTES=true
 * Optional route-specific overrides:
 *   REQUIRE_AUTH_FOR_VOCAB_ENRICH=true
 *   REQUIRE_AUTH_FOR_OPENAI_GENERATE_PROMPT=true
 */
export function isHighCostAuthGateEnabled(): boolean {
  return envFlagEnabled(process.env.REQUIRE_AUTH_FOR_HIGH_COST_AI_ROUTES);
}

export async function getUnauthorizedResponseIfNeeded(
  routeKey: "vocab_enrich" | "openai_generate_prompt",
): Promise<Response | null> {
  if (!isHighCostAuthGateEnabled() && !isRouteSpecificGateEnabled(routeKey)) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) return null;
  } catch {
    // If auth check fails while gate is enabled, fail closed.
  }
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
