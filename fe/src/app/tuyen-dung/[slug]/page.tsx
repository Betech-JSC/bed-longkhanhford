import { notFound } from "next/navigation";
import { jobsAPI } from "@/lib/api";
import JobDetailClient from "@/components/jobs/JobDetailClient";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    const res = await jobsAPI.getBySlug(slug).catch(() => null) as any;
    const job = res?.job || res?.data || res;

    if (!job || typeof job !== "object") return {};

    const title = `${job.title} | Tuyển dụng | Long Khánh Ford`;
    const description = job.description || `Ứng tuyển vị trí ${job.title} tại đại lý Long Khánh Ford. Cơ hội thăng tiến, chế độ đãi ngộ hấp dẫn, thu nhập cạnh tranh.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/tuyen-dung/${slug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "vi_VN",
      },
    };
  } catch (error) {
    console.error("Error generating metadata for job page:", error);
    return {};
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  let job = null;

  try {
    const res = await jobsAPI.getBySlug(slug).catch(() => null) as any;
    const jobData = res?.job || res?.data || res;
    if (jobData && typeof jobData === "object") {
      job = jobData;
    }
  } catch (error) {
    console.error("Error loading job in server page:", error);
  }

  if (!job) {
    notFound();
  }

  return <JobDetailClient job={job} />;
}
