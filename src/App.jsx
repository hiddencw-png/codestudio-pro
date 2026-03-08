import React, { useState, useEffect } from 'react';
import { Code2, Palette, FileJson, RotateCcw, Box, Play } from 'lucide-react';

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
  const [html, setHtml] = useLocalStorage('html', '<h1>Hello World</h1>\n<div class="box"></div>');
  const [css, setCss] = useLocalStorage('css', 'h1 {\n  color: #a855f7;\n  font-family: sans-serif;\n  text-align: center;\n}\n\n.box {\n  width: 100px;\n  height: 100px;\n  background: linear-gradient(45deg, #a855f7, #ec4899);\n  border-radius: 12px;\n  margin: 0 auto;\n  transition: transform 0.3s;\n}\n\n.box:hover {\n  transform: rotate(45deg) scale(1.1);\n}');
  const [js, setJs] = useLocalStorage('js', 'console.log("Ready");\n\ndocument.querySelector(".box").addEventListener("click", () => {\n  alert("Box clicked!");\n});');
  const [srcDoc, setSrcDoc] = useState('');
  const [activeTab, setActiveTab] = useState('html');

  // Feature: Debounced Rendering (250ms)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
    }, 250);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const resetCode = () => {
    setHtml('');
    setCss('');
    setJs('');
  };

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

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 shadow-lg shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Code2 size={24} className="text-white relative left-[1px]" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tight">CodeStudio Pro</h1>
            <p className="text-xs text-zinc-400 font-medium">Next-gen rapid prototyping</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={resetCode}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all duration-200 border border-zinc-700/50 hover:border-zinc-600"
          >
            <RotateCcw size={16} className="group-hover:-rotate-180 transition-transform duration-500 ease-in-out" />
            <span className="text-sm font-medium">Reset</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:tracking-wide hover:from-violet-400 hover:to-fuchsia-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25">
            <Play size={16} fill="currentColor" />
            <span>Deploy</span>
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex flex-1 flex-col lg:flex-row overflow-hidden min-h-0 bg-zinc-950/50">

        {/* Left Pane: Editor */}
        <section className="flex flex-col flex-1 border-r border-zinc-800/80 bg-[#1e1e1e] relative min-w-0">

          {/* Editor Navigation */}
          <nav className="flex items-center bg-[#252526] border-b border-zinc-800 overflow-x-auto scbar-none shrink-0">
            <button
              onClick={() => setActiveTab('html')}
              className={`flex items-center gap-2 px-6 py-3 border-r border-[#1e1e1e] transition-colors relative min-w-max ${activeTab === 'html' ? 'bg-[#1e1e1e] text-orange-400' : 'text-zinc-400 hover:bg-[#2d2d2d] hover:text-zinc-200'}`}
            >
              <Code2 size={16} />
              <span className="font-medium text-sm tracking-wide">index.html</span>
              {activeTab === 'html' && <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-400"></div>}
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`flex items-center gap-2 px-6 py-3 border-r border-[#1e1e1e] transition-colors relative min-w-max ${activeTab === 'css' ? 'bg-[#1e1e1e] text-blue-400' : 'text-zinc-400 hover:bg-[#2d2d2d] hover:text-zinc-200'}`}
            >
              <Palette size={16} />
              <span className="font-medium text-sm tracking-wide">style.css</span>
              {activeTab === 'css' && <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400"></div>}
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`flex items-center gap-2 px-6 py-3 border-r border-[#1e1e1e] transition-colors relative min-w-max ${activeTab === 'js' ? 'bg-[#1e1e1e] text-yellow-400' : 'text-zinc-400 hover:bg-[#2d2d2d] hover:text-zinc-200'}`}
            >
              <FileJson size={16} />
              <span className="font-medium text-sm tracking-wide">script.js</span>
              {activeTab === 'js' && <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-400"></div>}
            </button>
          </nav>

          {/* Editor Textarea */}
          <div className="flex-1 relative cursor-text group">
            <textarea
              value={getActiveValue()}
              onChange={(e) => setActiveValue(e.target.value)}
              spellCheck="false"
              className="absolute inset-0 w-full h-full p-6 bg-transparent text-[#d4d4d4] font-mono text-sm sm:text-base leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-inset focus:ring-purple-500/20"
              style={{ tabSize: 2 }}
            />

            {/* Ambient Glow effect inside editor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none rounded-full" />
          </div>
        </section>

        {/* Right Pane: Live Preview */}
        <section className="flex flex-col flex-1 bg-white relative">
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 border-b border-zinc-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="mx-2 flex items-center gap-2 bg-white px-3 py-1 rounded-md text-xs text-zinc-500 font-medium shadow-sm border border-zinc-200">
                <Box size={14} className="text-zinc-400" />
                <span>localhost:3000 resulting iframe</span>
              </div>
            </div>
          </div>
          <iframe
            srcDoc={srcDoc}
            title="result"
            sandbox="allow-scripts allow-modals"
            frameBorder="0"
            className="flex-1 w-full bg-white relative z-10"
          />
        </section>

      </main>
    </div>
  );
}
