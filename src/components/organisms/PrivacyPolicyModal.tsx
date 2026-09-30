import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
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
            : language === 'ES'
            ? 'Registros de sesión y credenciales purgados definitivamente de la base de datos.'
            : language === 'FR'
            ? 'Enregistrements de session et identifiants définitivement purgés de la base de données.'
            : 'Session records and credentials permanently erased from the database.'
        );
        onClose();
      } else {
        alert(
          language === 'PT'
            ? 'Não foi possível concluir o expurgo de dados. Por favor, confirme a autenticação e tente novamente.'
            : language === 'ES'
            ? 'No fue posible completar la purga de datos. Vuelva a autenticarse e inténtelo de nuevo.'
            : language === 'FR'
            ? 'Impossible de finaliser la purge des données. Veuillez vous réauthentifier et réessayer.'
            : 'Unable to complete data purge. Please re-authenticate and try again.'
        );
      }
    } catch {
      alert(
        language === 'PT'
          ? 'Erro de comunicação ao solicitar exclusão. Tente novamente.'
          : language === 'ES'
          ? 'Error de comunicación al solicitar la eliminación. Inténtelo de nuevo.'
          : language === 'FR'
          ? 'Erreur de communication lors de la demande de suppression. Veuillez réessayer.'
          : 'Communication error during purge request. Please try again.'
      );
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/80 md:backdrop-blur-xs font-sans animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full h-dvh md:h-auto md:max-h-[90vh] md:max-w-lg rounded-none md:rounded-2xl border-0 md:border flex flex-col overflow-hidden transition-all shadow-2xl ${
          theme === 'dark'
            ? 'bg-zinc-950 md:border-zinc-800 text-zinc-100 shadow-black/80'
            : 'bg-white md:border-zinc-200 text-zinc-900 shadow-zinc-300/40'
        }`}
      >
        {/* CABEÇALHO (COM SUPORTE A SAFE AREA NO MOBILE) */}
        <div
          className={`px-5 md:px-6 pt-[max(1.125rem,env(safe-area-inset-top,0px))] pb-4 md:py-4 border-b flex items-start justify-between gap-3 shrink-0 ${
            theme === 'dark' ? 'border-zinc-800/80 bg-zinc-900/40' : 'border-zinc-100 bg-zinc-50/50'
          }`}
        >
          <div className="min-w-0 pr-2">
            <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug">
              {language === 'PT'
                ? 'Governança de Dados e Privacidade'
                : language === 'ES'
                ? 'Gobernanza de Datos y Privacidad'
                : language === 'FR'
                ? 'Gouvernance des Données et Confidentialité'
                : 'Data Governance & Privacy Policy'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-0.5 leading-normal">
              LGPD (Lei 13.709/2018) & GDPR Compliance • Minimal Data Ingestion
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 mt-0.5"
            aria-label={t(language, 'auth.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTEÚDO SCROLLÁVEL */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans leading-relaxed text-zinc-600 dark:text-zinc-300 flex-1">
          {/* DECLARAÇÃO DE RESPONSABILIDADE FORMAL EM CARD EDITORIAL */}
          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed font-sans ${
              theme === 'dark'
                ? 'bg-zinc-900/50 border-zinc-800/70 text-zinc-300'
                : 'bg-zinc-50 border-zinc-200/80 text-zinc-600'
            }`}
          >
            {language === 'PT'
              ? 'Este portfólio de arquitetura é mantido por Thales Everardo Albuquerque Reis (São Paulo, Brasil). O tratamento de dados pessoais neste ambiente é estritamente pautado pelos princípios de necessidade, transparência e segurança estabelecidos na legislação vigente.'
              : language === 'ES'
              ? 'Este portafolio de arquitectura es gestionado por Thales Everardo Albuquerque Reis (São Paulo, Brasil). El tratamiento de datos personales en este entorno se rige estrictamente por los principios de necesidad, transparencia y seguridad.'
              : language === 'FR'
              ? 'Ce portfolio d’architecture est géré par Thales Everardo Albuquerque Reis (São Paulo, Brésil). Le traitement des données personnelles dans cet environnement respecte scrupuleusement les principes de nécessité, de transparence et de sécurité.'
              : 'This architectural portfolio is maintained by Thales Everardo Albuquerque Reis (São Paulo, Brazil). Personal data processing adheres strictly to necessity, transparency, and data minimization standards under international law.'}
          </div>

          {/* CLÁUSULAS JURÍDICAS */}
          <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
            <div>
              <h3 className="font-semibold text-[13px] text-zinc-900 dark:text-zinc-100 mb-1 leading-snug">
                {language === 'PT'
                  ? '1. Dados Coletados e Autenticação Federada'
                  : language === 'ES'
                  ? '1. Datos Recopilados y Autenticación'
                  : language === 'FR'
                  ? '1. Données Collectées et Authentification'
                  : '1. Collected Data & Federated Authentication'}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
              <h3 className="font-semibold text-[13px] text-zinc-900 dark:text-zinc-100 mb-1 leading-snug">
                {language === 'PT'
                  ? '2. Finalidade Legítima & Proteção Contra Automação'
                  : language === 'ES'
                  ? '2. Finalidad Legítima y Protección'
                  : language === 'FR'
                  ? '2. Finalité Légitime & Protection'
                  : '2. Legitimate Purpose & Anti-Bot Protection'}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
              <h3 className="font-semibold text-[13px] text-zinc-900 dark:text-zinc-100 mb-1 leading-snug">
                {language === 'PT'
                  ? '3. Não Compartilhamento e Ausência de Rastreamento Comercial'
                  : language === 'ES'
                  ? '3. No Divulgación y Cero Rastreo'
                  : language === 'FR'
                  ? '3. Non-Partage et Zéro Pistage'
                  : '3. Zero Third-Party Sharing & Commercial Tracking'}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
              <h3 className="font-semibold text-[13px] text-zinc-900 dark:text-zinc-100 mb-1 leading-snug">
                {language === 'PT'
                  ? '4. Direitos do Titular & Exclusão Sob Demanda (Art. 18 LGPD)'
                  : language === 'ES'
                  ? '4. Derechos del Titular y Supresión (Art. 18 LGPD / RGPD)'
                  : language === 'FR'
                  ? '4. Droits de l’Utilisateur et Droit à l’Oubli (RGPD)'
                  : '4. Data Subject Rights & Instant Erasure (GDPR Art. 17)'}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
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

          {/* BOTÃO E ALERTA DE EXPURGO COM AVISO DE AÇÃO IRREVERSÍVEL */}
          {user && (
            <div className="pt-2">
              {confirmingRevoke ? (
                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-rose-600 dark:text-rose-400 leading-snug">
                        {language === 'PT'
                          ? 'Confirmar exclusão definitiva dos seus dados?'
                          : language === 'ES'
                          ? '¿Confirmar eliminación definitiva de sus datos?'
                          : language === 'FR'
                          ? 'Confirmer la suppression définitive de vos données ?'
                          : 'Confirm permanent erasure of your data?'}
                      </div>
                      <p className="text-[11px] text-rose-700/90 dark:text-rose-300/90 leading-relaxed font-sans">
                        {language === 'PT'
                          ? 'Atenção: essa ação é definitiva e não poderá ser desfeita. Todos os registros de autenticação e acesso serão permanentemente expurgados da base.'
                          : language === 'ES'
                          ? 'Atención: esta acción es definitiva y no se puede deshacer. Todos los registros de autenticación y acceso se eliminarán de forma permanente.'
                          : language === 'FR'
                          ? 'Attention : cette action est irréversible et ne peut pas être annulée. Tous les enregistrements d’accès et d’authentification seront définitivement purgés.'
                          : 'Warning: this action is permanent and cannot be undone. All access and authentication records will be permanently purged from the database.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isPurging}
                      onClick={handleRevoke}
                      className="flex-1 h-8.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer active:scale-95 disabled:opacity-50 shadow-xs"
                    >
                      {isPurging
                        ? language === 'PT'
                          ? 'Excluindo da base...'
                          : language === 'ES'
                          ? 'Eliminando...'
                          : language === 'FR'
                          ? 'Suppression...'
                          : 'Erasing...'
                        : language === 'PT'
                        ? 'Sim, excluir definitivamente'
                        : language === 'ES'
                        ? 'Sí, eliminar definitivamente'
                        : language === 'FR'
                        ? 'Oui, supprimer définitivement'
                        : 'Yes, permanently delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingRevoke(false)}
                      className="h-8.5 px-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium text-xs hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer active:scale-95"
                    >
                      {language === 'PT' ? 'Cancelar' : language === 'ES' ? 'Cancelar' : language === 'FR' ? 'Annuler' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingRevoke(true)}
                  className="w-full h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-rose-500/10 hover:border-rose-500/30 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t(language, 'auth.revokeData')}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* RODAPÉ (COM SUPORTE A SAFE AREA NO MOBILE) */}
        <div
          className={`px-5 sm:px-6 pt-3.5 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:py-3.5 border-t flex items-center justify-between gap-3 shrink-0 ${
            theme === 'dark' ? 'border-zinc-800/80 bg-zinc-900/30' : 'border-zinc-100 bg-zinc-50/50'
          }`}
        >
          <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-sans truncate">
            {language === 'PT'
              ? 'Art. 18 LGPD & Art. 17 GDPR Assegurados'
              : 'LGPD & GDPR Privacy Standards'}
          </div>

          <button
            onClick={onClose}
            className="h-8.5 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-semibold font-sans transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
          >
            {language === 'PT' ? 'Fechar' : language === 'ES' ? 'Cerrar' : language === 'FR' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
