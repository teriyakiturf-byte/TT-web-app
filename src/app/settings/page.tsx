import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Nav from "@/components/Nav";
import SettingsForm from "@/components/SettingsForm";

export const metadata = {
  title: "Settings · Teriyaki Turf",
};

// Settings is private — never cache and always read fresh user data.
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  // Unauthenticated users are sent to sign in, then back here.
  if (!userId) {
    redirect("/signin?callbackUrl=/settings");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      zip: true,
      lawnSqft: true,
      grassType: true,
      planPurchased: true,
    },
  });

  if (!user) {
    redirect("/signin?callbackUrl=/settings");
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-md px-4 py-8">
        <SettingsForm
          email={user.email}
          zip={user.zip ?? ""}
          lawnSqft={user.lawnSqft ?? null}
          grassType={user.grassType ?? null}
          planPurchased={user.planPurchased}
        />
      </main>
    </>
  );
}
