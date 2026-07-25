import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LegacyComparePage({ params }: Props) {
  const { id } = await params;
  redirect(`/${id}/so-sanh`);
}
