"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { vehiclesAPI, servicesAPI } from "@/lib/api";

export default function Footer() {
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    const fetchFooterData = async () => {
      try {
        const [catsData, servicesData] = await Promise.all([
          vehiclesAPI.getCategories().catch(() => null),
          servicesAPI.getAll().catch(() => null)
        ]);

        const cats = (catsData as any)?.data || catsData;
        if (active && Array.isArray(cats) && cats.length > 0) {
          setCategoriesList(cats);
        }

        const services = (servicesData as any)?.services || (servicesData as any)?.data || servicesData;
        if (active && Array.isArray(services) && services.length > 0) {
          setServicesList(services);
        }
      } catch (err) {
        console.error("Error fetching footer data:", err);
      }
    };
    fetchFooterData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="bg-[#f8f9fa] text-neutral-800 pt-[50px] pb-[30px] px-4 lg:px-[80px] border-t border-neutral-200 mt-auto">
      {/* Upper Grid Area */}
      <div className="max-w-[1152px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-12">
        
        {/* Column 1: Company Profile Info (spans 3) */}
        <div className="space-y-4 lg:col-span-3">
          <div className="space-y-1">
            <h3 className="text-[20px] font-extrabold tracking-tight text-[#002f6c] font-display leading-[1.3]">
              Long Khánh Ford
            </h3>
            <p className="text-xs font-bold text-[#002f6c] font-display leading-snug">
              Công Ty TNHH Dịch Vụ Thương Mại Ô Tô Tấn Phát
            </p>
          </div>
          <div className="text-xs text-neutral-600 space-y-2.5 font-normal">
            <p>
              <strong className="text-neutral-800 font-bold">Mã số thuế:</strong> 3603892309
            </p>
            <p>
              <strong className="text-neutral-800 font-bold">Địa chỉ:</strong> Đường 21/4, Tổ 1, Khu phố Cẩm Tân, Phường Hàng Gòn, Thành phố Đồng Nai, Việt Nam
            </p>
            <p>
              <strong className="text-neutral-800 font-bold">Hotline KD:</strong> 0812 86 86 22
            </p>
            <p>
              <strong className="text-neutral-800 font-bold">Hotline Dv:</strong> 1900 888 992 – 02513 646 998
            </p>
            <p>
              <strong className="text-neutral-800 font-bold">Email:</strong> marketing@longkhanhford.com.vn
            </p>
            <p>
              <strong className="text-neutral-800 font-bold">Website:</strong> longkhanhford.com.vn
            </p>
          </div>
        </div>

        {/* Column 2: Các Dòng Xe & Công Cụ Hỗ Trợ (spans 2) */}
        <div className="space-y-8 lg:col-span-2">
          {/* CÁC DÒNG XE */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold tracking-wider text-[#002f6c] uppercase font-display border-b border-neutral-200 pb-2">
              CÁC DÒNG XE
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <Link href="/san-pham" className="hover:text-[#066fef] transition-colors block">
                  Tất cả dòng xe
                </Link>
              </li>
              {categoriesList.length > 0 ? (
                categoriesList.map((cat) => (
                  <li key={cat.id}>
                    <Link 
                      href={`/dong-xe/${cat.slug}`} 
                      className="hover:text-[#066fef] transition-colors block"
                    >
                      {cat.title.startsWith("Xe") ? cat.title : `Xe ${cat.title}`}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/dong-xe/suv" className="hover:text-[#066fef] transition-colors block">
                      Xe SUV
                    </Link>
                  </li>
                  <li>
                    <Link href="/dong-xe/thuong-mai" className="hover:text-[#066fef] transition-colors block">
                      Xe Thương Mại
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/xe-da-qua-su-dung" className="hover:text-[#066fef] transition-colors block">
                  Xe đã qua sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* CÔNG CỤ HỖ TRỢ */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold tracking-wider text-[#002f6c] uppercase font-display border-b border-neutral-200 pb-2">
              CÔNG CỤ
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <Link href="/bang-gia" className="hover:text-[#066fef] transition-colors block">
                  Bảng giá xe Ford
                </Link>
              </li>
              <li>
                <Link href="/cong-cu/uoc-tinh-lan-banh" className="hover:text-[#066fef] transition-colors block">
                  Ước tính lăn bánh
                </Link>
              </li>
              <li>
                <Link href="/cong-cu/uoc-tinh-tra-gop" className="hover:text-[#066fef] transition-colors block">
                  Ước tính trả góp
                </Link>
              </li>
              <li>
                <Link href="/cong-cu/so-sanh-xe" className="hover:text-[#066fef] transition-colors block">
                  So sánh xe
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Column 3: Dịch vụ & Bảo dưỡng (spans 2) */}
        <div className="space-y-4 lg:col-span-2">
          <h4 className="text-sm font-extrabold tracking-wider text-[#002f6c] uppercase font-display border-b border-neutral-200 pb-2">
            <Link href="/dich-vu" className="hover:text-[#066fef] transition-colors">
              DỊCH VỤ
            </Link>
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-600">
            {servicesList.length > 0 ? (
              servicesList.map((srv) => {
                const href = (srv.custom_link && srv.custom_link.startsWith('/dich-vu/'))
                  ? srv.custom_link
                  : `/dich-vu/${srv.slug}`;
                return (
                  <li key={srv.id}>
                    <Link href={href} className="hover:text-[#066fef] transition-colors block">
                      {srv.title}
                    </Link>
                  </li>
                );
              })
            ) : (
              <>
                <li>
                  <Link href="/dich-vu/cham-soc-khach-hang" className="hover:text-[#066fef] transition-colors block">
                    Chăm sóc khách hàng
                  </Link>
                </li>
                <li>
                  <Link href="/dich-vu/bao-duong-nhanh" className="hover:text-[#066fef] transition-colors block">
                    Bảo dưỡng nhanh
                  </Link>
                </li>
                <li>
                  <Link href="/dich-vu/bao-duong-dinh-ky" className="hover:text-[#066fef] transition-colors block">
                    Bảo dưỡng định kỳ
                  </Link>
                </li>
                <li>
                  <Link href="/dich-vu/giao-nhan-xe-tan-noi" className="hover:text-[#066fef] transition-colors block">
                    Nhận & Giao xe tận nơi
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Column 4: Ford Long Khánh Links (spans 2) */}
        <div className="space-y-4 lg:col-span-2">
          <h4 className="text-sm font-extrabold tracking-wider text-[#002f6c] uppercase font-display border-b border-neutral-200 pb-2">
            FORD LK
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-600">
            <li>
              <Link href="/gioi-thieu" className="hover:text-[#066fef] transition-colors block">
                Giới thiệu công ty
              </Link>
            </li>
            <li>
              <Link href="/tuyen-dung" className="hover:text-[#066fef] transition-colors block">
                Tuyển dụng
              </Link>
            </li>
            <li>
              <Link href="/lien-he" className="hover:text-[#066fef] transition-colors block">
                Liên hệ
              </Link>
            </li>
            <li>
              <Link href="/khao-sat-lai-thu" className="hover:text-[#066fef] transition-colors block">
                Khảo sát lái thử
              </Link>
            </li>
            <li>
              <Link href="/khao-sat-dich-vu" className="hover:text-[#066fef] transition-colors block">
                Khảo sát dịch vụ
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Facebook widget & Social Media (spans 3) */}
        <div className="space-y-6 lg:col-span-3">
          {/* Facebook Fanpage Embed */}
          <div className="w-full overflow-hidden rounded-lg bg-white border border-neutral-200 shadow-sm" style={{ height: "180px" }}>
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Flongkhanhfordofficial%2F&tabs&width=500&height=180&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
              width="100%"
              height="180"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="Facebook Fanpage Long Khánh Ford"
            ></iframe>
          </div>

          {/* Social Icons (Facebook, Zalo, YouTube, TikTok) */}
          <div className="flex gap-4 pt-2">
            {/* Facebook */}
            <a 
              href="https://www.facebook.com/longkhanhfordofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-[#1877f2] transition-colors flex items-center justify-center text-neutral-700 hover:text-white"
              title="Facebook"
            >
              <svg width="28" height="27" viewBox="0 0 28 27" fill="none" className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 13.318C0 19.9031 5.02036 25.3783 11.5855 26.4881V16.9229H8.10982V13.2441H11.5855V10.3009C11.5855 6.9899 13.8253 5.15046 16.992 5.15046C17.996 5.15046 19.0774 5.29761 20.0814 5.44476V8.82936H18.305C16.6058 8.82936 16.2196 9.63872 16.2196 10.6688V13.2441H19.927L19.3091 16.9229H16.2196V26.4881C22.7848 25.3783 27.8051 19.9031 27.8051 13.318C27.8051 5.99312 21.5489 0 13.9025 0C6.25614 0 0 5.99312 0 13.318Z" fill="currentColor"/>
              </svg>
            </a>
            {/* Zalo */}
            <a 
              href="https://zalo.me/0812868622"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-[#0068ff] transition-colors flex items-center justify-center text-neutral-700 hover:text-white"
              title="Zalo"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <mask id="footer-zalo-mask" x="0" y="0" width="32" height="32">
                    <rect x="0" y="0" width="32" height="32" fill="white" />
                    <path d="M13.1605 10.88H6.93646V12.2146H11.2556L6.99707 17.4923C6.86363 17.6864 6.7666 17.8684 6.7666 18.2809V18.6206H12.6387C12.9299 18.6206 13.1726 18.378 13.1726 18.0868V17.3709H8.63502L12.6387 12.348C12.6994 12.2753 12.8086 12.1418 12.8572 12.0812L12.8814 12.0447C13.1119 11.705 13.1605 11.4138 13.1605 11.062V10.88ZM21.0826 18.6206H21.9683V10.88H20.6337V18.1717C20.6337 18.4144 20.8279 18.6206 21.0826 18.6206ZM16.521 12.6031C14.8467 12.6031 13.4878 13.962 13.4878 15.6363C13.4878 17.3106 14.8467 18.6694 16.521 18.6694C18.1953 18.6694 19.5541 17.3106 19.5541 15.6363C19.5663 13.962 18.2074 12.6031 16.521 12.6031ZM16.521 17.4198C15.5382 17.4198 14.7375 16.619 14.7375 15.6363C14.7375 14.6536 15.5382 13.8528 16.521 13.8528C17.5037 13.8528 18.3045 14.6536 18.3045 15.6363C18.3045 16.619 17.5158 17.4198 16.521 17.4198ZM25.9115 12.5544C24.225 12.5544 22.8541 13.9254 22.8541 15.6118C22.8541 17.2982 24.225 18.6693 25.9115 18.6693C27.5979 18.6693 28.9689 17.2982 28.9689 15.6118C28.9689 13.9254 27.5979 12.5544 25.9115 12.5544ZM25.9115 17.4196C24.9166 17.4196 24.1158 16.6188 24.1158 15.6239C24.1158 14.6291 24.9166 13.8283 25.9115 13.8283C26.9064 13.8283 27.7071 14.6291 27.7071 15.6239C27.7071 16.6188 26.9064 17.4196 25.9115 17.4196Z" fill="black" />
                  </mask>
                </defs>
                <path fillRule="evenodd" clipRule="evenodd" d="M4.97875 27.8971C6.46541 28.0614 8.3241 27.6375 9.64384 26.9968C15.3746 30.1644 24.3328 30.0131 29.7553 26.5428C29.9656 26.2274 30.1621 25.8993 30.3444 25.5592C31.4282 23.5379 32.0005 21.2608 32.0005 17.3642V14.5392C32.0005 10.6426 31.4282 8.3655 30.3444 6.34415C29.2728 4.32279 27.6777 2.7398 25.6563 1.65605C23.6349 0.572313 21.3579 0 17.4613 0H14.6241C11.3054 0 9.15104 0.417763 7.34093 1.21532C7.24199 1.30392 7.1449 1.39404 7.04986 1.48566C1.73929 6.60499 1.33561 17.702 5.83878 23.73C5.8438 23.7389 5.84937 23.7479 5.85548 23.757C6.54957 24.7798 5.87984 26.5699 4.83263 27.617C4.66215 27.7754 4.72304 27.8728 4.97875 27.8971Z" fill="currentColor" mask="url(#footer-zalo-mask)" />
              </svg>
            </a>
            {/* YouTube */}
            <a 
              href="https://youtube.com/@longkhanhford"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-[#ff0000] transition-colors flex items-center justify-center text-neutral-700 hover:text-white"
              title="YouTube"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.7609 7.20005C23.7609 7.20005 23.5266 5.54536 22.8047 4.8188C21.8906 3.86255 20.8688 3.85786 20.4 3.80161C17.0438 3.55786 12.0047 3.55786 12.0047 3.55786H11.9953C11.9953 3.55786 6.95625 3.55786 3.6 3.80161C3.13125 3.85786 2.10938 3.86255 1.19531 4.8188C0.473438 5.54536 0.24375 7.20005 0.24375 7.20005C0.24375 7.20005 0 9.14536 0 11.086V12.9047C0 14.8454 0.239062 16.7907 0.239062 16.7907C0.239062 16.7907 0.473437 18.4454 1.19062 19.1719C2.10469 20.1282 3.30469 20.0954 3.83906 20.1985C5.76094 20.3813 12 20.4375 12 20.4375C12 20.4375 17.0438 20.4282 20.4 20.1891C20.8688 20.1329 21.8906 20.1282 22.8047 19.1719C23.5266 18.4454 23.7609 16.7907 23.7609 16.7907C23.7609 16.7907 24 14.85 24 12.9047V11.086C24 9.14536 23.7609 7.20005 23.7609 7.20005ZM9.52031 15.1125V8.36724L16.0031 11.7516L9.52031 15.1125Z" fill="currentColor"/>
              </svg>
            </a>
            {/* TikTok */}
            <a 
              href="https://www.tiktok.com/@longkhanhford.official"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-[#010101] transition-colors flex items-center justify-center text-neutral-700 hover:text-white"
              title="TikTok"
            >
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_tiktok)">
                  <path d="M17.0725 0.905762H13.0278V17.2536C13.0278 19.2014 11.4722 20.8014 9.53626 20.8014C7.60034 20.8014 6.04469 19.2014 6.04469 17.2536C6.04469 15.3406 7.56577 13.7753 9.43257 13.7058V9.60143C5.31872 9.67096 2 13.0449 2 17.2536C2 21.4971 5.38786 24.9058 9.57085 24.9058C13.7538 24.9058 17.1416 21.4623 17.1416 17.2536V8.87096C18.6627 9.98403 20.5295 10.6449 22.5 10.6797V6.57533C19.4579 6.47098 17.0725 3.96663 17.0725 0.905762Z" fill="currentColor"/>
                </g>
                <defs>
                  <clipPath id="clip0_tiktok">
                    <rect width="24" height="24" fill="white" transform="translate(0 0.905762)"/>
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Disclosures */}
      <div className="max-w-[1152px] mx-auto border-t border-neutral-200 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 gap-4">
          <p>
            Copyright © 2026 Ford Long Khánh. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-6">
            <Link href="/dieu-khoan-su-dung" className="hover:text-neutral-800 transition-colors">
              Điều khoản và điều kiện
            </Link>
            <Link href="/chinh-sach-bao-mat" className="hover:text-neutral-800 transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
