import { NextRequest } from "next/server";
import { getAccessTokenFromRequest } from "@/lib/auth/server";
import { ApiRouteError } from "@/lib/api/route-errors";
import { getCurrentAppUser } from "@/lib/repositories/users";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AppUser, UserRole } from "@/types/user";

export async function requireAppUserFromRequest(
  request: NextRequest,
  allowedRoles?: UserRole[],
): Promise<{
  accessToken: string;
  supabase: ReturnType<typeof createServerSupabaseClient>;
  user: AppUser;
}> {
  const accessToken = getAccessTokenFromRequest(request);

  if (!accessToken) {
    throw new ApiRouteError("Unauthorized", 401);
  }

  const supabase = createServerSupabaseClient(accessToken);
  const user = await getCurrentAppUser(supabase, accessToken);

  if (!user) {
    throw new ApiRouteError("User profile not found", 403);
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new ApiRouteError("Forbidden", 403);
  }

  return { accessToken, supabase, user };
}
