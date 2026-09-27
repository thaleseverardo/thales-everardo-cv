import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
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
  const [confirmingRevoke, setConfirmingRevoke] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  if (!isOpen) return null;

  const handleRevoke = async () => {
    setIsPurging(true);
    try {
      const ok = await revokeAccessAndPurgeUserData(user);
      if (ok) {
        alert(
          language === 'PT'
            ? 'Registros de sessão e credenciais expurgados definitivamente da base de dados.'
            : 'Session records and credentials permanently erased from the database.'
        );
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
        className={`w-full max-w-lg rounded-3xl shadow-2xl border flex flex-col max-h-[88vh] overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-zinc-950 border-zinc-800 text-zinc-100 shadow-black/90'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/40'
        }`}
      >
        {/* CABEÇALHO EDITORIAL SÓBRIO (PADRÃO STRIPE / APPLE / LINEAR) */}
        <div
          className={`px-6 py-5 border-b flex items-center justify-between shrink-0 ${
            theme === 'dark' ? 'border-zinc-800/80 bg-zinc-900/40' : 'border-slate-100 bg-slate-50/50'
          }`}
        >
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100 font-sans">
              {language === 'PT'
                ? 'Governança de Dados e Privacidade'
                : language === 'ES'
                ? 'Gobernanza de Datos y Privacidad'
                : language === 'FR'
                ? 'Gouvernance des Données et Confidentialité'
                : 'Data Governance & Privacy Policy'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans mt-0.5">
              LGPD (Lei 13.709/2018) & GDPR Compliance • Minimal Data Ingestion
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTEÚDO JURÍDICO EXECUTIVO */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans leading-relaxed text-slate-600 dark:text-zinc-300">
          {/* DECLARAÇÃO DE RESPONSABILIDADE FORMAL */}
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            {language === 'PT'
              ? 'Este portfólio de arquitetura é mantido por Thales Everardo Albuquerque Reis (São Paulo, Brasil). O tratamento de dados pessoais neste ambiente é estritamente pautado pelos princípios de necessidade, transparência e segurança estabelecidos na legislação vigente.'
              : language === 'ES'
              ? 'Este portafolio de arquitectura es gestionado por Thales Everardo Albuquerque Reis (São Paulo, Brasil). El tratamiento de datos personales en este entorno se rige estrictamente por los principios de necesidad, transparencia y seguridad.'
              : language === 'FR'
              ? 'Ce portfolio d’architecture est géré par Thales Everardo Albuquerque Reis (São Paulo, Brésil). Le traitement des données personnelles dans cet environnement respecte scrupuleusement les principes de nécessité, de transparence et de sécurité.'
              : 'This architectural portfolio is maintained by Thales Everardo Albuquerque Reis (São Paulo, Brazil). Personal data processing adheres strictly to necessity, transparency, and data minimization standards under international law.'}
          </p>

          <div className="space-y-3.5 border-t border-slate-100 dark:border-zinc-800/80 pt-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100 text-xs mb-1">
                {language === 'PT'
                  ? '1. Dados Coletados e Autenticação Federada'
                  : language === 'ES'
                  ? '1. Datos Recopilados y Autenticación'
                  : language === 'FR'
                  ? '1. Données Collectées et Authentification'
                  : '1. Collected Data & Federated Authentication'}
              </h3>
              <p className="opacity-85">
                {language === 'PT'
                  ? 'A navegação em todo o sistema é 100% aberta e anônima. Apenas ao solicitar acesso à Linha Direta de Contato (WhatsApp e e-mail pessoal), recebemos via OAuth (Google ou GitHub) exclusivamente: nome, endereço de e-mail e identificador de autenticação. Nenhuma senha de usuário é solicitada, processada ou armazenada neste sistema.'
                  : language === 'ES'
                  ? 'La navegación por todo el sistema es 100% abierta y anónima. Solo al solicitar acceso a la Línea Directa de Contacto, recibimos mediante OAuth (Google o GitHub) exclusivamente: nombre, correo electrónico e identificador de autenticación. No se almacena ninguna contraseña.'
                  : language === 'FR'
                  ? 'La navigation sur l’ensemble du système est 100% libre et anonyme. Uniquement lors de l’accès à la Ligne Directe, nous recevons via OAuth (Google ou GitHub) exclusivement: nom, adresse e-mail et identifiant d’authentification. Aucun mot de passe n’est stocké.'
                  : 'Browsing across the portfolio is 100% open and anonymous. Only upon requesting Direct Contact Line access do we receive via OAuth (Google or GitHub) strictly: full name, email address, and auth token. No user password is ever processed or stored.'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100 text-xs mb-1">
                {language === 'PT'
                  ? '2. Finalidade Legítima & Proteção Contra Automação'
                  : language === 'ES'
                  ? '2. Finalidad Legítima y Protección'
                  : language === 'FR'
                  ? '2. Finalité Légitime & Protection'
                  : '2. Legitimate Purpose & Anti-Bot Protection'}
              </h3>
              <p className="opacity-85">
                {language === 'PT'
                  ? 'A coleta ocorre unicamente para verificar a identidade de recrutadores, clientes e líderes técnicos, protegendo as informações de contato do profissional contra raspagem massiva por web scrapers e bots de spam. Base legal: Consentimento Expresso e Legítimo Interesse (Art. 7º, incisos I e IX da LGPD).'
                  : language === 'ES'
                  ? 'La recopilación tiene como único fin verificar la identidad de reclutadores y líderes técnicos, protegiendo los datos de contacto frente a scrapers y bots automatizados. Base legal: Consentimiento Expreso e Interés Legítimo.'
                  : language === 'FR'
                  ? 'La collecte a pour seul objectif de vérifier l’identité des recruteurs et leaders techniques, protégeant ainsi les coordonnées contre les scrapers et robots automatisés. Base légale: Consentement Exprès et Intérêt Légitime.'
                  : 'Collection serves solely to verify recruiter and engineering leadership identity, mitigating automated contact scraping and spam bots. Legal grounds: Explicit Consent and Legitimate Interest under Art. 6(1) GDPR / Art. 7 LGPD.'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100 text-xs mb-1">
                {language === 'PT'
                  ? '3. Não Compartilhamento e Ausência de Rastreamento Comercial'
                  : language === 'ES'
                  ? '3. No Divulgación y Cero Rastreo'
                  : language === 'FR'
                  ? '3. Non-Partage et Zéro Pistage'
                  : '3. Zero Third-Party Sharing & Commercial Tracking'}
              </h3>
              <p className="opacity-85">
                {language === 'PT'
                  ? 'Seus dados jamais serão vendidos, transferidos ou compartilhados com terceiros, corretores de dados ou plataformas de publicidade. Não utilizamos cookies de rastreamento comportamental nem enviamos comunicações de marketing não solicitadas.'
                  : language === 'ES'
                  ? 'Sus datos nunca serán vendidos, transferidos ni compartidos con terceros o plataformas publicitarias. No utilizamos cookies de rastreo comercial ni enviamos spam.'
                  : language === 'FR'
                  ? 'Vos données ne seront jamais vendues, cédées ou partagées avec des tiers ou des régies publicitaires. Nous n’utilisons aucun cookie de ciblage commercial.'
                  : 'Your data is never sold, leased, or shared with third-party brokers or ad networks. We employ zero behavioral ad cookies and send zero unsolicited marketing communications.'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100 text-xs mb-1">
                {language === 'PT'
                  ? '4. Direitos do Titular & Exclusão Sob Demanda (Art. 18 LGPD)'
                  : language === 'ES'
                  ? '4. Derechos del Titular y Supresión (Art. 18 LGPD / RGPD)'
                  : language === 'FR'
                  ? '4. Droits de l’Utilisateur et Droit à l’Oubli (RGPD)'
                  : '4. Data Subject Rights & Instant Erasure (GDPR Art. 17)'}
              </h3>
              <p className="opacity-85">
                {language === 'PT'
                  ? 'Em estrita conformidade com o Artigo 18 da LGPD e Artigo 17 do GDPR (Direito ao Esquecimento), qualquer usuário autenticado pode a qualquer momento revogar sua sessão e expurgar definitivamente todos os registros associados com um único clique abaixo.'
                  : language === 'ES'
                  ? 'En cumplimiento del Artículo 18 de la LGPD y Artículo 17 del RGPD (Derecho al Olvido), cualquier usuario autenticado puede revocar su sesión y eliminar permanentemente cualquier registro con un solo clic a continuación.'
                  : language === 'FR'
                  ? 'Conformément à l’Article 17 du RGPD (Droit à l’Oubli), tout utilisateur authentifié peut révoquer sa session et effacer définitivement ses enregistrements en un seul clic ci-dessous.'
                  : 'In strict compliance with GDPR Article 17 (Right to Erasure) and LGPD Article 18, any authenticated visitor may revoke their session and permanently purge all associated authentication records with a single click below.'}
              </p>
            </div>
          </div>

          {/* BOTÃO DE EXPURGO DE DADOS SOB DEMANDA (LGPD ART. 18) */}
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
                        ? language === 'PT'
                          ? 'Excluindo da base...'
                          : 'Erasing...'
                        : language === 'PT'
                        ? 'Sim, excluir e revogar'
                        : 'Yes, delete & revoke'}
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
                  className="w-full py-2.5 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t(language, 'auth.revokeData')}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* RODAPÉ SÓBRIO E INSTITUCIONAL (SEM SELOS FALSOS OU BADGES MONOESPAÇADOS) */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between shrink-0 ${
            theme === 'dark' ? 'border-zinc-800/80 bg-zinc-900/40' : 'border-slate-100 bg-slate-50/50'
          }`}
        >
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans">
            {language === 'PT'
              ? 'Art. 18 LGPD & Art. 17 GDPR Assegurados'
              : 'LGPD & GDPR Privacy Standards'}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-100 active:scale-95"
          >
            {language === 'PT' ? 'Fechar' : language === 'ES' ? 'Cerrar' : language === 'FR' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
