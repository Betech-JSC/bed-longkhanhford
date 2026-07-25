import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LegacySanPhamPage({ params }: Props) {
  const { id } = await params;
  redirect(`/${id}`);
}
