import React, { useState } from 'react';
import { DownloadCloud, Smartphone, X, Check, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  language: 'PT' | 'EN';
  theme: 'dark' | 'light';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language, theme }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, don't show prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold transition-all shadow-sm ${
          theme === 'dark'
            ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-400 hover:text-emerald-300'
            : 'bg-white hover:bg-slate-100 border border-slate-300 text-emerald-700 hover:text-emerald-800 shadow-sm'
        }`}
        title={language === 'PT' ? 'Instalar Aplicativo (PWA)' : 'Install App (PWA)'}
      >
        <DownloadCloud className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {language === 'PT' ? 'INSTALAR APP' : 'INSTALL APP'}
        </span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold transition-all ${
            theme === 'dark'
              ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-400'
              : 'bg-white hover:bg-slate-100 border border-slate-300 text-emerald-700 shadow-sm'
          }`}
          title={language === 'PT' ? 'Instalar no iOS' : 'Install on iOS'}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {language === 'PT' ? 'INSTALAR NO IPHONE' : 'INSTALL ON IOS'}
          </span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div
              className={`w-full max-w-sm rounded-xl p-5 shadow-2xl border ${
                theme === 'dark'
                  ? 'bg-zinc-950 border-zinc-700 text-zinc-100'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 dark:border-zinc-800">
                <h3 className="font-mono text-sm font-bold flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  {language === 'PT' ? 'Instalar no iPhone / iPad' : 'Install on iPhone / iPad'}
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 font-sans text-xs text-zinc-300 dark:text-zinc-300">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <Share className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    {language === 'PT' ? (
                      <span>
                        1. Toque no botão de <strong>Compartilhar</strong> na barra do Safari (ícone de quadrado com seta para cima).
                      </span>
                    ) : (
                      <span>
                        1. Tap the <strong>Share</strong> button in the Safari toolbar.
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <PlusSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    {language === 'PT' ? (
                      <span>
                        2. Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.
                      </span>
                    ) : (
                      <span>
                        2. Scroll down and select <strong>Add to Home Screen</strong>.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-md bg-emerald-600 py-2 text-xs font-mono font-bold text-white hover:bg-emerald-500 transition-colors"
              >
                {language === 'PT' ? 'ENTENDI' : 'GOT IT'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback button on supported desktop/browsers if prompted
  return (
    <button
      onClick={() => {
        window.alert(
          language === 'PT'
            ? 'Para instalar este portfólio PWA no seu dispositivo, use o menu do navegador (ícone de instalar na barra de URL ou "Adicionar à Tela Inicial").'
            : 'To install this PWA on your device, check the install icon in your browser URL bar or select "Add to Home Screen".'
        );
      }}
      className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold transition-all ${
        theme === 'dark'
          ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-emerald-400'
          : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-emerald-700 shadow-sm'
      }`}
      title={language === 'PT' ? 'Disponível como PWA Offline' : 'Available as Offline PWA'}
    >
      <DownloadCloud className="w-3.5 h-3.5 text-emerald-400" />
      <span>PWA READY</span>
    </button>
  );
};
