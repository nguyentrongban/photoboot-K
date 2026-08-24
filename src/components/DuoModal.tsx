import React, { useState } from 'react';
import { DuoMode, PhotoboothSettings } from '../types';
import { X, Heart, Link as LinkIcon, Check, Copy, Sparkles, Users, Camera } from 'lucide-react';
import { LottieIcon } from './LottieIcon';

interface DuoModalProps {
  settings: PhotoboothSettings;
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: (roomCode: string, userName: string, isHost: boolean, duoMode?: DuoMode) => void;
  initialRoomCode?: string;
}

export const DuoModal: React.FC<DuoModalProps> = ({
  settings,
  isOpen,
  onClose,
  onJoinRoom,
  initialRoomCode = '',
}) => {
  const [tab, setTab] = useState<'create' | 'join'>(initialRoomCode ? 'join' : 'create');
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('duo_username') || 'Bạn Thân 🌸');
  const [roomCodeInput, setRoomCodeInput] = useState<string>(initialRoomCode);
  const [selectedMode, setSelectedMode] = useState<DuoMode>('split-heart');
  const [createdRoomCode, setCreatedRoomCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Extract pure 6-character room code from string or full URL
  const sanitizeRoomCode = (input: string): string => {
    let clean = input.trim();
    // If user pasted a full URL or query string
    if (clean.includes('room=')) {
      const match = clean.match(/room=([A-Za-z0-9]+)/i);
      if (match && match[1]) {
        clean = match[1];
      }
    }
    // Remove non-alphanumeric chars and capitalize
    return clean.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
  };

  const handleCreateRoom = async () => {
    if (!userName.trim()) {
      setErrorMsg('Vui lòng nhập tên của bạn nhé!');
      return;
    }
    setErrorMsg(null);
    setIsCreating(true);
    localStorage.setItem('duo_username', userName.trim());

    const isVercel = typeof window !== 'undefined' && (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('now.sh'));

    if (!isVercel) {
      try {
        const res = await fetch('/api/rooms/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hostName: userName.trim(),
            duoMode: selectedMode,
            settings,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.room) {
            if (data.userId) {
              localStorage.setItem('duo_uid', data.userId);
            }
            setCreatedRoomCode(data.room.code);
            setIsCreating(false);
            return;
          }
        }
      } catch (err) {
        console.log('Server REST API create error:', err);
      }
    }

    const fallbackCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const fallbackUid = `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    localStorage.setItem('duo_uid', fallbackUid);
    setCreatedRoomCode(fallbackCode);
    setIsCreating(false);
  };

  const handleEnterCreatedRoom = () => {
    if (createdRoomCode) {
      onJoinRoom(createdRoomCode, userName.trim(), true, selectedMode);
    }
  };

  const handleJoinExistingRoom = () => {
    const code = sanitizeRoomCode(roomCodeInput);
    if (!code || code.length < 4) {
      setErrorMsg('Vui lòng nhập chính xác mã phòng gồm 6 ký tự!');
      return;
    }
    if (!userName.trim()) {
      setErrorMsg('Vui lòng nhập tên của bạn nhé!');
      return;
    }
    setErrorMsg(null);
    localStorage.setItem('duo_username', userName.trim());
    localStorage.removeItem('duo_uid');

    onJoinRoom(code, userName.trim(), false, selectedMode);
  };

  const shareUrl = createdRoomCode
    ? `${window.location.origin}${window.location.pathname}?room=${createdRoomCode}`
    : '';

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100/80 font-['Quicksand']">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-xs shadow-pink-200">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-black text-neutral-900">
                Duo Booth • Chụp Đôi Từ Xa
              </h3>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                Realtime
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Chụp chung với người yêu hoặc bạn thân dù đang ở xa nhau 💕
            </p>
          </div>
        </div>

        {/* Created Room Share Stage */}
        {createdRoomCode ? (
          <div className="space-y-4">
            <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl text-center space-y-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                Mã Phòng Chụp Của Bạn
              </span>
              <div className="text-3xl sm:text-4xl font-black text-rose-600 tracking-widest font-mono">
                {createdRoomCode}
              </div>
              <p className="text-xs text-neutral-600">
                Gửi mã này hoặc link bên dưới cho người ấy để cùng vào chụp chung nhé!
              </p>
            </div>

            {/* Share Link Box */}
            <div className="flex items-center gap-2 bg-neutral-100/80 p-2 rounded-2xl border border-neutral-200">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-2 text-xs text-neutral-700 font-mono outline-hidden select-all"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer whitespace-nowrap"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Đã chép!' : 'Sao chép link'}</span>
              </button>
            </div>

            <button
              onClick={handleEnterCreatedRoom}
              className="w-full py-3.5 px-4 rounded-2xl bg-neutral-900 hover:bg-black text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Camera className="w-4 h-4" />
              <span>Vào Phòng Chụp Ngay</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Tabs: Create vs Join */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-2xl">
              <button
                onClick={() => {
                  setTab('create');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  tab === 'create'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Tạo Phòng Mới</span>
              </button>
              <button
                onClick={() => {
                  setTab('join');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  tab === 'join'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-pink-500" />
                <span>Tham Gia Phòng Có Sẵn</span>
              </button>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 flex items-center justify-between">
                <span>Tên hiển thị của bạn:</span>
                <span className="text-[11px] text-neutral-400 font-normal">Ví dụ: Anh yêu, Mèo Ú,...</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nhập biệt danh của bạn..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs font-bold text-neutral-900 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all outline-hidden"
              />
            </div>

            {tab === 'create' ? (
              <>
                {/* Duo Mode Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700">
                    Chọn chế độ chụp đôi:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMode('split-heart')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedMode === 'split-heart'
                          ? 'border-rose-400 bg-rose-50/70 text-rose-950 shadow-2xs'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span className="text-sm font-bold block mb-0.5">💖 Ghép Trái Tim</span>
                      <span className="text-[10px] text-neutral-500 block leading-tight">
                        Mỗi ô chia đôi: Bạn bên trái, người ấy bên phải ghép thành trái tim.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMode('side-by-side')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedMode === 'side-by-side'
                          ? 'border-rose-400 bg-rose-50/70 text-rose-950 shadow-2xs'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span className="text-sm font-bold block mb-0.5">🎞️ Dải Song Song</span>
                      <span className="text-[10px] text-neutral-500 block leading-tight">
                        2 dải ảnh song song riêng biệt cho mỗi người.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMode('alternating')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedMode === 'alternating'
                          ? 'border-rose-400 bg-rose-50/70 text-rose-950 shadow-2xs'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span className="text-sm font-bold block mb-0.5">🔄 Luân Phiên Ô</span>
                      <span className="text-[10px] text-neutral-500 block leading-tight">
                        Ô 1 là bạn, Ô 2 là người ấy, thay phiên nhau trên dải ảnh.
                      </span>
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
                    {errorMsg}
                  </p>
                )}

                <button
                  onClick={handleCreateRoom}
                  disabled={isCreating}
                  className="w-full py-3.5 px-4 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-rose-300" />
                  <span>{isCreating ? 'Đang tạo phòng...' : 'Tạo Mã Phòng & Link Mời'}</span>
                </button>
              </>
            ) : (
              <>
                {/* Join Code Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-neutral-700">
                      Nhập mã phòng 6 ký tự (hoặc dán link):
                    </label>
                    {roomCodeInput && (
                      <button
                        type="button"
                        onClick={() => setRoomCodeInput('')}
                        className="text-[11px] text-neutral-400 hover:text-neutral-600 font-medium cursor-pointer"
                      >
                        Xoá
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={roomCodeInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.includes('http') || val.includes('room=')) {
                        setRoomCodeInput(sanitizeRoomCode(val));
                      } else {
                        setRoomCodeInput(val.toUpperCase());
                      }
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="VD: XD0BHU"
                    className="w-full px-3.5 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-center text-xl font-black font-mono tracking-widest text-neutral-900 uppercase focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all outline-hidden shadow-inner"
                  />
                  <p className="text-[11px] text-neutral-400 text-center">
                    Bạn có thể nhập mã 6 ký tự hoặc dán trực tiếp link được người ấy gửi
                  </p>
                </div>

                {errorMsg && (
                  <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center animate-shake">
                    {errorMsg}
                  </p>
                )}

                <button
                  onClick={handleJoinExistingRoom}
                  disabled={isJoining}
                  className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
                >
                  {isJoining ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang kiểm tra phòng...</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Tham Gia Phòng Chụp Ngay</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
