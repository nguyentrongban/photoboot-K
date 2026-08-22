import React, { useState } from 'react';
import { ChevronDown, Sparkles, Camera, Heart, CheckCircle2, HelpCircle } from 'lucide-react';

export const SeoContentSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "PicZo - App Photobooth Online là gì?",
      a: "PicZo là ứng dụng Web Photobooth Online miễn phí 100%, hỗ trợ bạn tự chụp ảnh 4 ô vuông (인생네컷) hoặc dải dọc 3-4 tấm phong cách Hàn Quốc trực tiếp qua camera máy tính hoặc điện thoại mà không cần cài đặt phần mềm."
    },
    {
      q: "Làm thế nào để chụp ảnh 4 ô Hàn Quốc đẹp trên PicZo?",
      a: "Bạn chỉ cần mở PicZo, bật camera/webcam, chọn bố cục 2x2 vuông hoặc dải 4 ảnh dọc. Sử dụng chế độ làm mịn da K-Glow tự nhiên, chọn màu khung nơ pastel hoặc vintage, dán thêm sticker cute và tải về file in 300 DPI siêu nét."
    },
    {
      q: "Ảnh xuất ra từ PicZo có đạt chuẩn in không?",
      a: "Có! PicZo hỗ trợ kết xuất hình ảnh sắc nét độ phân giải cao 300 DPI, sẵn sàng cho việc in ấn dải ảnh lưu giữ kỷ niệm hoặc đăng tải sắc nét lên Instagram, Facebook, TikTok và Zalo."
    },
    {
      q: "PicZo có lưu giữ hình ảnh cá nhân của người dùng không?",
      a: "Tuyệt đối không! PicZo hoạt động hoàn toàn bảo mật trên trình duyệt của bạn (Client-Side Rendering). Tất cả hình ảnh chụp và ghép đều được xử lý cục bộ trên thiết bị của bạn, bảo vệ quyền riêng tư 100%."
    }
  ];

  return (
    <section 
      aria-label="Thông tin PicZo Photobooth Online & FAQ SEO" 
      className="w-full max-w-5xl mx-auto px-4 my-8 font-['Quicksand']"
    >
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-rose-100/80 shadow-sm overflow-hidden">
        {/* Toggle Bar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-rose-50/40 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-neutral-800 group-hover:text-rose-600 transition-colors">
                PicZo - Chụp Ảnh Photobooth Online 4 Ô Hàn Quốc Miễn Phí
              </h2>
              <p className="text-xs text-neutral-500">
                Tìm hiểu thêm về tính năng, hướng dẫn chụp ảnh &amp; FAQ câu hỏi thường gặp
              </p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-rose-500' : ''}`} />
        </button>

        {/* Collapsible Content Section for Search Engine Indexing */}
        {isOpen && (
          <div className="px-6 pb-6 pt-2 border-t border-rose-100/50 space-y-6 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {/* Main SEO Intro Article */}
            <article className="space-y-4">
              <header>
                <h1 className="text-base sm:text-lg font-bold text-neutral-900 mb-2">
                  PicZo: Ứng Dụng Photobooth Online Chụp Ảnh 4 Ô Phong Cách Hàn Quốc Top 1
                </h1>
                <p>
                  Bạn đang tìm kiếm một <strong>Photobooth Online</strong> nhanh chóng, tiện lợi để lưu giữ những khoảnh khắc đáng yêu cùng bạn bè và người thương? <strong>PicZo</strong> mang trải nghiệm tiệm chụp ảnh <em>인생네컷 (Life Four Cuts)</em> chuẩn Hàn Quốc đến ngay trên thiết bị của bạn.
                </p>
              </header>

              <div className="grid sm:grid-cols-3 gap-4 my-4">
                <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-700 text-xs">
                    <Camera className="w-4 h-4 text-rose-500" />
                    <span>Đa Dạng Bố Cục</span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Hỗ trợ dải 4 ảnh vuông 2x2 thời thượng, dải 3-4 ảnh dọc cổ điển chuẩn Hàn.
                  </p>
                </div>

                <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-700 text-xs">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Làm Mịn Da K-Glow</span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Công nghệ mịn da thông minh che khuyết điểm nhưng vẫn giữ mắt môi sắc nét.
                  </p>
                </div>

                <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-700 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-rose-500" />
                    <span>Xuất Ảnh 300 DPI</span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Xuất file ảnh độ phân giải cao sẵn sàng in ấn kỷ niệm hoặc chia sẻ MXH.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold text-neutral-800 mb-1.5">
                  Tại Sao Nên Chọn Chụp Ảnh Photobooth Online Trên PicZo?
                </h2>
                <ul className="list-disc list-inside space-y-1 text-neutral-600">
                  <li><strong>Không Cần Cài Đặt:</strong> Sử dụng trực tiếp trên Chrome, Safari, Edge cực kỳ nhanh mượt.</li>
                  <li><strong>Bộ Lộc Màu Đa Dạng:</strong> TikTok Pinky, Vintage Warm, Rosy Soft, K-Glow mịn màng.</li>
                  <li><strong>Kho Sticker &amp; Khung Ảnh Vintage:</strong> Mẫu viền nơ pastel, sticker hoạt hình cực xinh.</li>
                  <li><strong>Miễn Phí 100%:</strong> Không gắn watermark khó chịu, tự do sáng tạo dải ảnh của riêng bạn.</li>
                </ul>
              </div>
            </article>

            {/* Structured FAQ Section */}
            <div className="pt-4 border-t border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-rose-500" />
                Câu Hỏi Thường Gặp Về PicZo Photobooth (FAQ)
              </h3>
              
              <div className="space-y-2">
                {faqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    className="border border-neutral-100 rounded-xl overflow-hidden bg-neutral-50/50"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full px-4 py-2.5 text-left font-semibold text-neutral-800 flex justify-between items-center text-xs hover:text-rose-600 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-rose-500' : ''}`} />
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-4 pb-3 text-xs text-neutral-600 border-t border-neutral-100 pt-2 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
