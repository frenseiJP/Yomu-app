import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShareCorrectionView from "@/components/marketing/ShareCorrectionView";
import { decodeSharePayload } from "@/lib/share/encode";

type Props = { params: { token: string } };

export const metadata: Metadata = {
  title: "Shared Japanese Correction | Frensei",
  description: "A Japanese coaching correction shared from Frensei.",
  robots: { index: false, follow: true },
};

export default function ShareCorrectionPage({ params }: Props) {
  const data = decodeSharePayload(params.token);
  if (!data) notFound();
  return <ShareCorrectionView data={data} />;
}
