import React, { useState } from 'react';
import { CapturedPhoto, PhotoboothSettings, Step } from './types';
import { Header } from './components/Header';
import { Step1Config } from './components/Step1Config';
import { Step2Camera } from './components/Step2Camera';
import { Step3Result } from './components/Step3Result';
import { SeoContentSection } from './components/SeoContentSection';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const [settings, setSettings] = useState<PhotoboothSettings>({
    layoutType: 'strip-3',
    themeId: 'airmail_postcard',
    colorId: 'airmail_kraft',
    filterId: 'none',
    title: 'KATE & JACKSON',
    subtitle: 'got hitched!',
    showDate: true,
    customDate: '1.10.14',
    showQrCode: true,
    showFilmHoles: false,
    isDoubleStrip: false,
    stickers: [],
    skinSmooth: 30,
  });

  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);

  const targetPhotoCount = settings.layoutType === 'strip-3' ? 3 : 4;

  const handleUpdateSettings = (updater: Partial<PhotoboothSettings>) => {
    setSettings((prev) => ({ ...prev, ...updater }));
  };

  const handleStartCapture = () => {
    setCurrentStep(2);
  };

  const handlePhotosCaptured = (captured: CapturedPhoto[]) => {
    setPhotos(captured);
  };

  const handleFinishStep2 = () => {
    setCurrentStep(3);
  };

  const handleRetake = () => {
    setPhotos([]);
    setCurrentStep(2);
  };

  const handleResetAll = () => {
    if (window.confirm('Bạn có muốn làm mới từ đầu không? Toàn bộ ảnh sẽ được tạo mới.')) {
      setPhotos([]);
      setCurrentStep(1);
    }
  };

  const canGoToStep2 = true;
  const canGoToStep3 = photos.filter(Boolean).length === targetPhotoCount;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col selection:bg-rose-200 selection:text-rose-900 font-sans text-neutral-900 antialiased">
      {/* Header */}
      <Header
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        canGoToStep2={canGoToStep2}
        canGoToStep3={canGoToStep3}
        onResetAll={handleResetAll}
      />

      {/* Main Screen according to Step */}
      <main className="flex-1 flex flex-col justify-start">
        {currentStep === 1 && (
          <Step1Config
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onStartCapture={handleStartCapture}
          />
        )}

        {currentStep === 2 && (
          <Step2Camera
            settings={settings}
            photos={photos}
            onPhotosCaptured={handlePhotosCaptured}
            onFinishStep2={handleFinishStep2}
            onBackToStep1={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3Result
            photos={photos}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onRetake={handleRetake}
          />
        )}

        {/* SEO Article & FAQ Section for Google Search Engine Indexing */}
        <SeoContentSection />
      </main>

      {/* Premium Minimalist Footer */}
      <footer className="w-full py-6 border-t border-neutral-100 bg-white/80 backdrop-blur-md text-[11px] text-neutral-400 font-['Quicksand']">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:items-start gap-1 text-center sm:text-left">
            <p className="font-bold text-neutral-700 text-xs tracking-wide">
              🌸 PicZo Studio
            </p>
            <p className="text-neutral-400">
              Chụp ảnh 4 ô vuông & dải dọc phong cách Hàn Quốc • Xuất file in 300 DPI
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-1.5 text-center sm:text-right">
            <p className="text-neutral-400 font-medium">
              © {new Date().getFullYear()} PicZo • Mọi quyền được bảo lưu
            </p>
            <p className="font-semibold text-neutral-600">
              Góp ý & Đề xuất ý tưởng mới:{" "}
              <a 
                href="mailto:nguyentrongban01052003@gmail.com" 
                className="text-rose-500 hover:text-rose-600 transition-colors underline underline-offset-2 decoration-rose-200 hover:decoration-rose-500"
              >
                nguyentrongban01052003@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
