import Link from "next/link";
import { Home, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-16 md:py-24 text-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Floating Icon Wrapper */}
        <div className="relative mb-6 flex items-center justify-center w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700/50 animate-bounce [animation-duration:3s]">
          <Compass className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin [animation-duration:15s]" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full" />
        </div>

        {/* Big 404 Text */}
        <h1 className="text-8xl md:text-9xl font-black tracking-tight text-slate-800 dark:text-slate-100 mb-4 select-none drop-shadow-sm bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
          Không Tìm Thấy Trang
        </h2>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-10 max-w-lg leading-relaxed">
          Đường dẫn bạn đang truy cập không tồn tại hoặc đã được di chuyển sang địa chỉ mới.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            Về Trang Chủ
          </Link>
          <Link
            href="/tin-tuc"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:bg-slate-100 dark:active:bg-slate-700 rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Xem Tin Tức
          </Link>
        </div>

        {/* Support Link */}
        <p className="mt-12 text-sm text-slate-400 dark:text-slate-500">
          Bạn cần hỗ trợ?{" "}
          <Link
            href="/lien-he"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Liên hệ với đại lý
          </Link>
        </p>
      </div>
    </div>
  );
}
