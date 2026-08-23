import React, { useState } from 'react';
import { X, Download, Share2, Sparkles, Heart, Check, Eye } from 'lucide-react';
import { playSuccessChime, playShutterSound } from '../utils/audio';

interface PromoKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PROMO_IMAGES = [
  {
    id: 1,
    title: 'Giao Diện Bước 1: Chụp Ảnh Live Camera & Bộ Lọc Xinh',
    description: 'Chụp trực tiếp giao diện Web Camera: Khung ngắm pastel, đếm ngược 3s, filter tai thỏ/má hồng.',
    url: '/promo/1_chup_camera_live.jpg',
    caption: 'Tự tin thả dáng với camera góc rộng, hiệu ứng làm mịn da tự nhiên & bộ lọc tai thỏ xinh xắn chuẩn idol K-Pop 📸✨',
    tag: 'Bước 1: Camera Live',
  },
  {
    id: 2,
    title: 'Giao Diện Phòng Chụp Đôi Từ Xa (Duo Realtime)',
    description: 'Ảnh chụp màn hình 2 điện thoại kết nối song song, đếm ngược chụp chung và thả tim theo thời gian thực.',
    url: '/promo/2_phong_chup_doi.jpg',
    caption: 'Tính năng độc quyền: Chụp ảnh đôi online với bạn bè hoặc người yêu ở xa cực mượt, ghép nửa trái tim siêu dễ thương 💕👩‍❤️‍👨',
    tag: 'Chụp Đôi Online',
  },
  {
    id: 3,
    title: 'Giao Diện Bước 2: Phòng Decor Sticker & Đổi Khung',
    description: 'Ảnh chụp màn hình thao tác kéo thả sticker nơ Y2K, chọn bảng màu khung pastel và gắn tem ngày tháng.',
    url: '/promo/3_trang_tri_sticker.jpg',
    caption: 'Thoả sức sáng tạo với kho sticker Y2K, ruy băng nơ, tai mèo cùng bảng màu khung pastel ngọt ngào 🎀🎨',
    tag: 'Bước 2: Decor Studio',
  },
  {
    id: 4,
    title: 'Giao Diện Bước 3: Xuất Dải Ảnh HD & Tạo Live GIF',
    description: 'Ảnh chụp màn hình dải ảnh hoàn thiện với các nút bấm Tải ảnh HD, Tải GIF và Quét mã QR.',
    url: '/promo/4_xuat_anh_gif.jpg',
    caption: 'Nhận ngay dải ảnh nét căng chuẩn HD và ảnh động Live GIF chuyển động cực bắt mắt để đăng Story/TikTok ngay lập tức 📲🌟',
    tag: 'Bước 3: Tải Ảnh & GIF',
  },
  {
    id: 5,
    title: 'Banner Tổng Quan Toàn Bộ 3 Bước Chụp Photobooth',
    description: 'Poster quảng cáo tổng hợp 3 bước: 1. Chụp Camera -> 2. Thiết kế Decor -> 3. Tải thành phẩm.',
    url: '/promo/5_tong_quan_3_buoc.jpg',
    caption: 'Tiệm Photobooth Hàn Quốc Online Miễn Phí ngay trên điện thoại: Chỉ 3 bước đơn giản là có ngay dải ảnh 4 ô cực xinh 💖✨',
    tag: 'Poster 3 Bước',
  },
];

export const PromoKitModal: React.FC<PromoKitModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = async (imgUrl: string, fileName: string, id?: number) => {
    playSuccessChime();
    if (id) setDownloadingId(id);

    try {
      // 1. Fetch file as blob to guarantee download attribute works across all domains/Vercel
      const response = await fetch(imgUrl);
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();

      // 2. Check if mobile Web Share API is available with file support
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'PicZo Marketing Poster',
            text: 'Bộ ảnh quảng cáo Photobooth Hàn Quốc PicZo! 📸',
          });
          if (id) setDownloadingId(null);
          return;
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') {
            if (id) setDownloadingId(null);
            return;
          }
        }
      }

      // 3. Trigger blob download
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 5000);
    } catch (err) {
      console.warn('Blob download fallback to direct anchor/tab', err);
      // Fallback: Open in new tab or direct link
      const a = document.createElement('a');
      a.href = imgUrl;
      a.download = fileName;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      if (id) setDownloadingId(null);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    for (let i = 0; i < PROMO_IMAGES.length; i++) {
      const item = PROMO_IMAGES[i];
      await handleDownload(item.url, `PicZo_Promo_${item.id}.jpg`);
      // Small pause between downloads so browser doesn't block multi-download
      await new Promise((r) => setTimeout(r, 600));
    }
    setIsDownloadingAll(false);
  };

  const handleCopyCaption = (id: number, text: string) => {
    playShutterSound();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-rose-100">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50/80 via-pink-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-neutral-900 font-['Quicksand']">
                  Bộ 5 Ảnh Quảng Cáo PicZo Photobooth
                </h3>
                <span className="text-[11px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                  HD Nét Cao
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Bấm vào nút <strong className="text-neutral-700">"Tải Ảnh Này"</strong> để lưu ngay về điện thoại / máy tính
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white hover:bg-rose-50 text-neutral-500 hover:text-neutral-900 border border-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Gallery List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FAF8F5]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROMO_IMAGES.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 bg-neutral-100 group overflow-hidden cursor-pointer" onClick={() => setPreviewImage(item.url)}>
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                    <span>#{index + 1} • {item.tag}</span>
                  </div>

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(item.url);
                      }}
                      className="px-3 py-1.5 rounded-full bg-white text-neutral-800 text-xs font-bold shadow-md flex items-center gap-1 hover:bg-neutral-50"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem lớn
                    </button>
                  </div>
                </div>

                {/* Info & Action Buttons */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Caption box */}
                  <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100/80 text-xs text-neutral-600 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-rose-700">
                      <span>Gợi ý caption đăng bài:</span>
                      <button
                        onClick={() => handleCopyCaption(item.id, item.caption)}
                        className="text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Đã sao chép</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3 h-3" />
                            <span>Copy Caption</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-500 italic line-clamp-2">
                      "{item.caption}"
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleDownload(item.url, `PicZo_Promo_${item.id}.jpg`, item.id)}
                      disabled={downloadingId === item.id || isDownloadingAll}
                      className="flex-1 py-2 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      {downloadingId === item.id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang tải...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải Ảnh Này (HD)</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setPreviewImage(item.url)}
                      className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                      title="Xem phóng to ảnh"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-rose-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 text-center sm:text-left">
            💡 <em>Bạn cũng có thể nhấn giữ vào ảnh trên điện thoại để chọn "Lưu hình ảnh".</em>
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isDownloadingAll ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải toàn bộ...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  <span>Tải Toàn Bộ 5 Ảnh</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(previewImage, 'PicZo_HD.jpg');
                }}
                className="px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
              >
                <Download className="w-4 h-4" /> Tải về máy
              </button>
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
