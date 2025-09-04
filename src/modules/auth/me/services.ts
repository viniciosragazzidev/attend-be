import { auth } from "@/utils/auth";
import { AuthMeView } from "./schemas.js";

export async function getCurrentUser(
  headers: Record<string, any>
): Promise<AuthMeView | null> {
  // Converter para Headers nativo
  const nativeHeaders = new Headers();
  Object.entries(headers).forEach(([key, value]) => {
    if (value) nativeHeaders.append(key, value.toString());
  });

  const session = await auth.api.getSession({
    headers: nativeHeaders,
  });

  if (!session) {
    return null;
  }

  return {
    user: session.user,
    session: {
      id: session.session.id,
      userId: session.session.userId,
    },
  };
}