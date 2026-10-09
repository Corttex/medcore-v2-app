import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getUserAndUnit(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) return { user: null, unitId: null };

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, primaryUnitId: true, fullName: true, role: true }
  });

  if (!dbUser) return { user: null, unitId: null };

  const url = new URL(req.url);
  const unitId = url.searchParams.get("unitId") || dbUser.primaryUnitId;

  return { user: dbUser, unitId };
}
