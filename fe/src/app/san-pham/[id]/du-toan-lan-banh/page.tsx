import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LegacyCalculatorPage({ params }: Props) {
  const { id } = await params;
  redirect(`/${id}/du-toan-lan-banh`);
}
