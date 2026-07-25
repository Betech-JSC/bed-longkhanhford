import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string; versionSlug: string }>;
};

export default async function LegacyVersionPage({ params }: Props) {
  const { id, versionSlug } = await params;
  redirect(`/${id}/${versionSlug}`);
}
