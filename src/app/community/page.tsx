import { CommunityLounge } from "@/components/community-lounge";
import { PageHeader } from "@/components/signage";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Community — Buddy",
  description:
    "The Buddy departure lounge — one global room plus one for every country. No likes, no followers, just people who've been where you're going.",
};

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const { room } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          tag="The lounge"
          title="Everyone, everywhere."
          lede="One global room for all of Buddy, plus one room for every country on earth. Drop in, say hi, ask what you're too scared to ask in class."
        />

        <CommunityLounge initialRoom={room} />
      </main>

      <SiteFooter />
    </div>
  );
}
