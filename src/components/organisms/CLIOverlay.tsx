import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, CornerDownLeft } from 'lucide-react';
import { SystemState } from '../../types';
import { CURRICULUM_NODES, PROFILE_DATA } from '../../data/curriculumData';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface CLIOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  systemState: SystemState;
  updateState: (updates: Partial<SystemState>) => void;
  onOpenContact: () => void;
  onOpenResume: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export const CLIOverlay: React.FC<CLIOverlayProps> = ({
  isOpen,
  onClose,
  systemState,
  updateState,
  onOpenContact,
  onOpenResume,
}) => {
  const { play } = useSoundEffects(systemState.soundEnabled);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'sys-init',
      output: (
        <div className="space-y-1 text-zinc-300">
          <div className="text-emerald-400 font-bold">Thales Everardo // SYSTEM ARCHITECTURE OBSERVED CLI [v2.4]</div>
          <div>Type <span className="text-cyan-300 font-semibold">&apos;help&apos;</span> to inspect available executive commands or <span className="text-cyan-300 font-semibold">&apos;cat experience.json&apos;</span>.</div>
          <div className="text-zinc-500 text-xs">Press ESC or type &apos;exit&apos; to close.</div>
        </div>
      ),
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const now = new Date().toLocaleTimeString();
    const parts = cmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let outputNode: React.ReactNode = null;

    switch (mainCmd) {
      case 'help': {
        outputNode = (
          <div className="space-y-1.5 text-zinc-300">
            <div className="text-emerald-400 font-semibold uppercase">AVAILABLE EXECUTIVE & SYSTEM COMMANDS:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div><span className="text-cyan-300 font-semibold">help</span> : Show this operational menu</div>
              <div><span className="text-cyan-300 font-semibold">status</span> : Telemetry health check & metrics</div>
              <div><span className="text-cyan-300 font-semibold">cat experience.json</span> : Read career milestones</div>
              <div><span className="text-cyan-300 font-semibold">cat skills.json</span> : View tech stack & paradigms</div>
              <div><span className="text-cyan-300 font-semibold">run purge-demo</span> : Toggle 11TB log purge demo</div>
              <div><span className="text-cyan-300 font-semibold">run latency-demo</span> : Toggle 7d ➔ 20m latency demo</div>
              <div><span className="text-cyan-300 font-semibold">run sync-demo</span> : Toggle GS1 ➔ ERP ➔ POS broker</div>
              <div><span className="text-cyan-300 font-semibold">inject-failure</span> : Trigger circuit breaker anomaly</div>
              <div><span className="text-cyan-300 font-semibold">recover</span> : Auto-heal system anomaly</div>
              <div><span className="text-cyan-300 font-semibold">mode digital | physical</span> : Switch canvas view</div>
              <div><span className="text-cyan-300 font-semibold">rps &lt;number&gt;</span> : Set traffic (100 - 100000)</div>
              <div><span className="text-cyan-300 font-semibold">theme [dark|light]</span> : Toggle visual theme</div>
              <div><span className="text-cyan-300 font-semibold">lang [pt|en|es|fr]</span> : Switch language</div>
              <div><span className="text-cyan-300 font-semibold">lens [all|arch|data|swe|db]</span> : Filter profile lens</div>
              <div><span className="text-cyan-300 font-semibold">contact</span> : Launch handshake / hire modal</div>
              <div><span className="text-cyan-300 font-semibold">download-cv</span> : Open printable ATS resume</div>
              <div><span className="text-cyan-300 font-semibold">clear</span> : Reset CLI terminal buffer</div>
              <div><span className="text-cyan-300 font-semibold">exit</span> : Close terminal</div>
            </div>
          </div>
        );
        break;
      }
      case 'status': {
        outputNode = (
          <div className="space-y-1 text-zinc-300 font-mono text-xs">
            <div className="text-emerald-400 font-semibold">SYSTEM OBSERVABILITY TELEMETRY:</div>
            <div>MODE: [{systemState.mode}]</div>
            <div>HEALTH: [{systemState.systemHealth}] {systemState.failureInjected ? '⚠️ (ANOMALY ACTIVE)' : '✅ (ALL INVARIANTS OK)'}</div>
            <div>LANGUAGE: [{systemState.language}]</div>
            <div>TRAFFIC_RPS: {systemState.rps.toLocaleString()} RPS</div>
            <div>P99_LATENCY: {systemState.isLatencyOptimized ? '20 min (-99.8% OPTIMIZED)' : '10,080 min (7 DAYS BOTTLENECK)'}</div>
            <div>STORAGE_PRESSURE: {systemState.isPurgeExecuted ? '14% (11 TB RECLAIMED)' : '99% (CRITICAL BLOAT)'}</div>
            <div>POS_BROKER: {systemState.isSyncActive ? 'STREAMING (5 STORES)' : 'ISOLATED'}</div>
          </div>
        );
        break;
      }
      case 'lang':
      case 'language': {
        if (arg === 'pt' || arg === 'portugues' || arg === 'br') {
          updateState({ language: 'PT' });
          play('click');
          outputNode = <div className="text-emerald-400 font-mono text-xs">Language: [PORTUGUÊS (PT-BR)]</div>;
        } else if (arg === 'en' || arg === 'english' || arg === 'us') {
          updateState({ language: 'EN' });
          play('click');
          outputNode = <div className="text-emerald-400 font-mono text-xs">Language: [ENGLISH (EN-US)]</div>;
        } else if (arg === 'es' || arg === 'espanol' || arg === 'spanish') {
          updateState({ language: 'ES' });
          play('click');
          outputNode = <div className="text-emerald-400 font-mono text-xs">Language: [ESPAÑOL (ES)]</div>;
        } else if (arg === 'fr' || arg === 'francais' || arg === 'french') {
          updateState({ language: 'FR' });
          play('click');
          outputNode = <div className="text-emerald-400 font-mono text-xs">Language: [FRANÇAIS (FR)]</div>;
        } else {
          outputNode = <div className="text-zinc-400 font-mono text-xs">Usage: lang pt | lang en | lang es | lang fr</div>;
        }
        break;
      }
      case 'cat': {
        if (arg === 'experience.json' || arg === 'experience') {
          outputNode = (
            <div className="space-y-3 font-mono text-xs text-zinc-300 bg-zinc-950/80 p-3 rounded border border-zinc-800">
              <div className="text-cyan-300 font-semibold">// EXPERIENCE ARCHITECTURE LOGS:</div>
              {CURRICULUM_NODES.map((n) => (
                <div key={n.id} className="border-b border-zinc-800/80 pb-2">
                  <div className="text-emerald-400 font-bold">{n.number}. {n.company} — {n.role}</div>
                  <div className="text-zinc-500">{n.period} | {n.location}</div>
                  <div className="text-zinc-200 mt-0.5">&gt; Feat: {n.engineeringFeat}</div>
                  <div className="text-cyan-400/80 mt-0.5">&gt; Impact: {n.metricHighlight}</div>
                </div>
              ))}
            </div>
          );
        } else if (arg === 'skills.json' || arg === 'skills') {
          outputNode = (
            <div className="space-y-2 font-mono text-xs text-zinc-300 bg-zinc-950/80 p-3 rounded border border-zinc-800">
              <div className="text-cyan-300 font-semibold">// TECHNICAL COMPETENCY & CORE STACK:</div>
              <div><span className="text-emerald-400 font-medium">LANGUAGES:</span> C#, Java, T-SQL, Python, JavaScript/TypeScript, Bash, Lua</div>
              <div><span className="text-emerald-400 font-medium">DATABASES:</span> MSSQL Server, Sybase, Oracle, Index Tuning, Partitioning, ACID</div>
              <div><span className="text-emerald-400 font-medium">ARCHITECTURE:</span> EDA, DDD, Microservices, REST APIs, DR/BCP, Queueing Theory</div>
              <div><span className="text-emerald-400 font-medium">SYSTEMS & OPS:</span> Linux Administration, Windows Server, Active Directory, SIP/VoIP</div>
            </div>
          );
        } else {
          outputNode = (
            <div className="text-rose-400">
              cat: {arg || 'file'}: No such file or directory. Try <span className="text-cyan-300">&apos;cat experience.json&apos;</span> or <span className="text-cyan-300">&apos;cat skills.json&apos;</span>.
            </div>
          );
        }
        break;
      }
      case 'contact': {
        onOpenContact();
        outputNode = (
          <div className="text-emerald-400 font-mono text-xs">
            ⚡ Handshake modal initialized: Email {PROFILE_DATA.email} | Phone {PROFILE_DATA.phone}
          </div>
        );
        break;
      }
      case 'download-cv':
      case 'cv':
      case 'resume': {
        onOpenResume();
        outputNode = (
          <div className="text-cyan-300 font-mono text-xs">
            📄 Raw ATS Resume opened. Ready for print or direct review.
          </div>
        );
        break;
      }
      case 'clear': {
        setHistory([]);
        setInput('');
        return;
      }
      case 'exit':
      case 'quit': {
        onClose();
        setInput('');
        return;
      }
      default: {
        outputNode = (
          <div className="text-rose-400 font-mono text-xs">
            Command not recognized: &apos;{mainCmd}&apos;. Type <span className="text-cyan-300">&apos;help&apos;</span> for documentation.
          </div>
        );
      }
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: cmd,
        output: outputNode,
        timestamp: now,
      },
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(historyIndex - 1, 0);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl h-[85vh] sm:h-130 max-h-[92vh] bg-zinc-950 border border-zinc-700/80 rounded-lg shadow-2xl flex flex-col font-mono text-xs overflow-hidden">
        <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between select-none">
          <div className="flex items-center gap-2 text-zinc-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-zinc-200">root@thaleseverardo-core:~</span>
            <span className="text-zinc-600">//</span>
            <span className="text-zinc-400 text-[11px] hidden sm:inline">ARCHITECTURAL_OBSERVABILITY_SHELL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 hidden sm:inline">[CTRL+K or ESC]</span>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400/90">
                <span className="text-zinc-500 text-[10px]">[{item.timestamp}]</span>
                <span className="text-cyan-400 font-semibold">$</span>
                <span className="text-zinc-100 font-medium">{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 flex items-center gap-2">
          <span className="text-emerald-400 font-semibold pl-1">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help', 'lang es', 'lang fr', 'cat experience.json'..."
            className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none font-mono text-xs"
            autoFocus
          />
          <button
            onClick={() => handleCommand(input)}
            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-emerald-400 transition-colors"
            title="Execute"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
