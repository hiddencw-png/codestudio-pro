import React, { useState, useEffect, useCallback } from 'react';
import {
  Code2, Palette, FileJson, RotateCcw, Box, Play,
  Settings, Download, Copy, Trash2, Zap, X,
  ChevronDown, Check, Layout, Monitor, Smartphone,
  ExternalLink, Github, Coffee
} from 'lucide-react';

// Feature: Persistent Storage Hook
function useLocalStorage(key, initialValue) {
  const prefixedKey = 'codestudio-' + key;
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue != null) return JSON.parse(jsonValue);
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value]);

  return [value, setValue];
}

export default function App() {
  // --- State: Code ---
  const [html, setHtml] = useLocalStorage('html', '<h1>Hello World</h1>\n<div class="box"></div>');
  const [css, setCss] = useLocalStorage('css', 'h1 {\n  color: #a855f7;\n  font-family: sans-serif;\n  text-align: center;\n}\n\n.box {\n  width: 100px;\n  height: 100px;\n  background: linear-gradient(45deg, #a855f7, #ec4899);\n  border-radius: 12px;\n  margin: 0 auto;\n  transition: transform 0.3s;\n}\n\n.box:hover {\n  transform: rotate(45deg) scale(1.1);\n}');
  const [js, setJs] = useLocalStorage('js', 'console.log("Ready");\n\ndocument.querySelector(".box").addEventListener("click", () => {\n  alert("Box clicked!");\n});');
  const [srcDoc, setSrcDoc] = useState('');

  // --- State: UI & Settings ---
  const [activeTab, setActiveTab] = useState('html');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [layout, setLayout] = useLocalStorage('layout', 'horizontal'); // horizontal | vertical
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 14);
  const [previewDelay, setPreviewDelay] = useLocalStorage('previewDelay', 250);
  const [isCopied, setIsCopied] = useState(false);

  // Feature: Debounced Rendering
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body { margin: 0; padding: 20px; font-family: sans-serif; }
              ${css}
            </style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
    }, previewDelay);
    return () => clearTimeout(timeout);
  }, [html, css, js, previewDelay]);

  // --- Handlers: Editor Actions ---
  const resetCode = () => {
    if (confirm('Are you sure you want to clear all code?')) {
      setHtml('');
      setCss('');
      setJs('');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleClearPane = () => {
    if (activeTab === 'html') setHtml('');
    if (activeTab === 'css') setCss('');
    if (activeTab === 'js') setJs('');
  };

  // --- Handlers: Export ---
  const downloadFile = (filename, content) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportCombinedHTML = () => {
    const combined = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeStudio Project</title>
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>${js}</script>
</body>
</html>`;
    downloadFile('index.html', combined);
  };

  // --- Helpers ---
  const getActiveValue = () => {
    if (activeTab === 'html') return html;
    if (activeTab === 'css') return css;
    if (activeTab === 'js') return js;
  };

  const setActiveValue = (val) => {
    if (activeTab === 'html') setHtml(val);
    if (activeTab === 'css') setCss(val);
    if (activeTab === 'js') setJs(val);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden selection:bg-purple-500/30">

      {/* Modals */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-purple-400" />
                <h2 className="text-xl font-bold">Settings</h2>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-400">Font Size ({fontSize}px)</label>
                <input
                  type="range" min="10" max="24" step="1"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-400">Preview Delay ({previewDelay}ms)</label>
                <input
                  type="range" min="0" max="1000" step="50"
                  value={previewDelay}
                  onChange={(e) => setPreviewDelay(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-400">Editor Layout</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLayout('horizontal')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${layout === 'horizontal' ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
                  >
                    <Layout size={18} rotate={90} />
                    <span className="text-sm font-medium">Side-by-side</span>
                  </button>
                  <button
                    onClick={() => setLayout('vertical')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${layout === 'vertical' ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
                  >
                    <Layout size={18} />
                    <span className="text-sm font-medium">Stacked</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-800/30 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 shadow-lg shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Code2 size={24} className="text-white relative left-[1px]" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tight">CodeStudio Pro</h1>
            <p className="text-xs text-zinc-400 font-medium">Rapid prototyping suite</p>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex bg-zinc-800/50 rounded-lg p-1 border border-zinc-700/50">
            <button
              onClick={() => setLayout(layout === 'horizontal' ? 'vertical' : 'horizontal')}
              className="p-1.5 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded transition-colors"
              title="Toggle Layout"
            >
              {layout === 'horizontal' ? <Layout size={18} /> : <div className="rotate-90"><Layout size={18} /></div>}
            </button>
            <div className="w-[1px] bg-zinc-700 mx-1 my-1"></div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all border border-zinc-700/50"
            >
              <Download size={16} />
              <span className="text-sm font-medium hidden sm:inline">Export</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`} />
            </button>

            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2">
                <button
                  onClick={() => { exportCombinedHTML(); setIsExportOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-zinc-300 hover:bg-purple-500/10 hover:text-purple-400 transition-colors text-left"
                >
                  <Code2 size={16} />
                  <span>Combined HTML File</span>
                </button>
                <button
                  onClick={() => {
                    downloadFile('index.html', html);
                    downloadFile('style.css', css);
                    downloadFile('script.js', js);
                    setIsExportOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-zinc-300 hover:bg-purple-500/10 hover:text-purple-400 transition-colors text-left border-t border-zinc-800"
                >
                  <Zap size={16} />
                  <span>All Source Files</span>
                </button>
                <button
                  onClick={() => {
                    const combined = `/* CSS */\n${css}\n\n/* JS */\n${js}\n\n/* HTML */\n${html}`;
                    copyToClipboard(combined);
                    setIsExportOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-zinc-300 hover:bg-purple-500/10 hover:text-purple-400 transition-colors text-left border-t border-zinc-800"
                >
                  <Copy size={16} />
                  <span>Copy Combined String</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => window.open('https://hiddencw-png.github.io/codestudio-pro/', '_blank')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-400 hover:to-fuchsia-500 text-white font-semibold transition-all shadow-lg shadow-purple-500/25"
          >
            <Play size={16} fill="currentColor" />
            <span className="hidden sm:inline">Deploy</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className={`flex flex-1 ${layout === 'horizontal' ? 'flex-col lg:flex-row' : 'flex-col'} overflow-hidden min-h-0`}>

        {/* Left Pane: Editor */}
        <section className={`flex flex-col flex-1 border-zinc-800/80 bg-[#1e1e1e] relative min-w-0 ${layout === 'horizontal' ? 'border-r' : 'border-b'}`}>

          {/* Editor Header */}
          <nav className="flex items-center justify-between bg-[#252526] border-b border-zinc-800 shrink-0">
            <div className="flex overflow-x-auto scbar-none">
              <button
                onClick={() => setActiveTab('html')}
                className={`flex items-center gap-2 px-6 py-3 border-r border-[#1e1e1e] transition-colors relative min-w-max ${activeTab === 'html' ? 'bg-[#1e1e1e] text-orange-400' : 'text-zinc-400 hover:bg-[#2d2d2d] hover:text-zinc-200'}`}
              >
                <Code2 size={16} />
                <span className="font-medium text-sm">index.html</span>
                {activeTab === 'html' && <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-400"></div>}
              </button>
              <button
                onClick={() => setActiveTab('css')}
                className={`flex items-center gap-2 px-6 py-3 border-r border-[#1e1e1e] transition-colors relative min-w-max ${activeTab === 'css' ? 'bg-[#1e1e1e] text-blue-400' : 'text-zinc-400 hover:bg-[#2d2d2d] hover:text-zinc-200'}`}
              >
                <Palette size={16} />
                <span className="font-medium text-sm">style.css</span>
                {activeTab === 'css' && <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400"></div>}
              </button>
              <button
                onClick={() => setActiveTab('js')}
                className={`flex items-center gap-2 px-6 py-3 border-r border-[#1e1e1e] transition-colors relative min-w-max ${activeTab === 'js' ? 'bg-[#1e1e1e] text-yellow-400' : 'text-zinc-400 hover:bg-[#2d2d2d] hover:text-zinc-200'}`}
              >
                <FileJson size={16} />
                <span className="font-medium text-sm">script.js</span>
                {activeTab === 'js' && <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-400"></div>}
              </button>
            </div>

            <div className="flex items-center gap-1 px-3">
              <button
                onClick={() => copyToClipboard(getActiveValue())}
                className="p-1.5 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-200 rounded transition-colors"
                title="Copy current pane"
              >
                {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
              <button
                onClick={handleClearPane}
                className="p-1.5 hover:bg-zinc-700 text-zinc-500 hover:text-red-400 rounded transition-colors"
                title="Clear current pane"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </nav>

          {/* Editor Container */}
          <div className="flex-1 relative cursor-text group overflow-hidden">
            <textarea
              value={getActiveValue()}
              onChange={(e) => setActiveValue(e.target.value)}
              spellCheck="false"
              className="absolute inset-0 w-full h-full p-6 bg-transparent text-[#d4d4d4] font-mono leading-relaxed resize-none focus:outline-none"
              style={{ tabSize: 2, fontSize: `${fontSize}px` }}
            />
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none rounded-full" />
          </div>
        </section>

        {/* Right Pane: Live Preview */}
        <section className="flex flex-col flex-1 bg-white relative">
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 border-b border-zinc-200 shrink-0 select-none">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="mx-2 flex items-center gap-2 bg-white px-3 py-1 rounded-md text-xs text-zinc-500 font-medium shadow-sm border border-zinc-200">
                <Box size={14} className="text-zinc-400" />
                <span>Live Preview</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-zinc-400">
              <div className="flex items-center gap-1.5 px-2 border-r border-zinc-300">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] uppercase font-bold tracking-widest">Active</span>
              </div>
              <button onClick={resetCode} className="p-1 hover:text-zinc-600 transition-colors" title="Full Reset">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white relative">
            <iframe
              srcDoc={srcDoc}
              title="result"
              sandbox="allow-scripts allow-modals"
              frameBorder="0"
              className="w-full h-full relative z-10"
            />
          </div>
        </section>

      </main>

      {/* Footer Info */}
      <footer className="px-4 py-1.5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Zap size={10} className="text-yellow-500" />
            <span>Last change saved to local storage</span>
          </div>
          <div className="w-[1px] h-3 bg-zinc-800"></div>
          <div>{html.length + css.length + js.length} chars total</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-help">
            <Monitor size={10} />
            UTF-8
          </span>
          <span className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer">
            <Github size={10} />
            GitHub Verified
          </span>
        </div>
      </footer>
    </div>
  );
}
