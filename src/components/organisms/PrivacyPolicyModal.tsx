import React from 'react';
import { X, ShieldCheck, Lock, UserCheck, Trash2 } from 'lucide-react';
import { AppLanguage, AppTheme } from '../../types';
import { t } from '../../i18n/translations';
import { useAuth } from '../../hooks/useAuth';
import { revokeAccessAndPurgeUserData } from '../../services/firebaseAuth';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  theme: AppTheme;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
}) => {
  const { user } = useAuth();
  const [confirmingRevoke, setConfirmingRevoke] = React.useState(false);
  const [isPurging, setIsPurging] = React.useState(false);
  if (!isOpen) return null;

  const handleRevoke = async () => {
    setIsPurging(true);
    try {
      const ok = await revokeAccessAndPurgeUserData(user);
      if (ok) {
        alert(language === 'PT' 
          ? 'Conta e registros de sessão excluídos definitivamente com sucesso da base de dados.' 
          : 'Account and session records permanently erased from database.');
      }
    } finally {
      setIsPurging(false);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-lg rounded-3xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-zinc-950 border-zinc-800 text-zinc-100 shadow-black/80'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/40'
        }`}
      >
        {/* CABEÇALHO */}
        <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
          theme === 'dark' ? 'border-zinc-800 bg-zinc-900/60' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">
                {t(language, 'auth.privacyPolicyTitle')}
              </h2>
              <div className="text-[10px] font-mono opacity-60">LGPD (Lei 13.709/2018) & GDPR Compliance</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans leading-relaxed text-slate-700 dark:text-zinc-300">
          <div className="p-3 rounded-xl border dark:bg-zinc-900/40 dark:border-zinc-800 bg-slate-50 border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>{t(language, 'auth.privacyController')}</span>
            </div>
            <div className="text-[11px] opacity-75">São Paulo, SP — Brasil · Contato: email@gmail.com</div>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-xs">1. Dados Pessoais Coletados via OAuth</h3>
            <p className="opacity-80">
              Ao optar por entrar via Google ou GitHub, coletamos estritamente: <strong>nome completo, endereço de e-mail corporativo/pessoal, foto de perfil pública</strong> e o identificador único da conta (UID). Nenhuma senha é criada ou armazenada neste portal.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-xs">2. Finalidade e Base Legal (Art. 7º e 9º da LGPD)</h3>
            <p className="opacity-80">
              A coleta tem como finalidade exclusiva verificar a identidade do visitante para liberar acesso à <strong>Linha Direta de Contato</strong> (WhatsApp e e-mail pessoal), mitigando a raspagem indiscriminada de dados por robôs. A base legal aplicada é o <em>Consentimento Expresso</em> do titular e o <em>Legítimo Interesse</em> na segurança das comunicações.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-xs">3. Não Compartilhamento e Antispam</h3>
            <p className="opacity-80">
              Seus dados <strong>nunca serão vendidos, alugados ou compartilhados</strong> com terceiros. Não enviamos newsletters, e-mails de marketing nem mensagens não solicitadas.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-xs">4. Direitos do Titular & Exclusão (Art. 18 da LGPD)</h3>
            <p className="opacity-80">
              Você tem direito à confirmação de tratamento, acesso e exclusão imediata dos seus dados. A qualquer momento, você pode revogar sua sessão no portal.
            </p>
          </div>

          {user && (
            <div className="pt-2">
              {confirmingRevoke ? (
                <div className="p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 space-y-2.5 animate-in fade-in duration-150">
                  <div className="font-semibold text-xs text-rose-600 dark:text-rose-400">
                    {language === 'PT'
                      ? 'Confirmar exclusão definitiva dos seus dados de sessão (Art. 18 LGPD)?'
                      : 'Confirm permanent erasure of your session data (GDPR/LGPD)?'}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isPurging}
                      onClick={handleRevoke}
                      className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      {isPurging 
                        ? (language === 'PT' ? 'Excluindo da base...' : 'Erasing...') 
                        : (language === 'PT' ? 'Sim, excluir e revogar' : 'Yes, delete & revoke')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingRevoke(false)}
                      className="py-2 px-3.5 rounded-xl border dark:border-zinc-700 border-slate-300 dark:bg-zinc-800 bg-white font-medium text-xs transition-colors cursor-pointer active:scale-95"
                    >
                      {language === 'PT' ? 'Cancelar' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingRevoke(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t(language, 'auth.revokeData')}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* RODAPÉ */}
        <div className={`px-6 py-3.5 border-t flex items-center justify-between shrink-0 text-xs ${
          theme === 'dark' ? 'border-zinc-800 bg-zinc-900/60' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-1.5 text-[11px] opacity-60 font-mono">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span>Conformidade Ativa</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            {t(language, 'inspector.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
