cat << 'INNER_EOF' > /tmp/tab3_content.tsx
          {/* TAB 3: LIVE THEMES */}
          {activeSubTab === "themes" && (() => {
            const previewTheme = THEMES.find(t => t.id === previewThemeId) || THEMES[0];
            const previewFont = FONTS.find(f => f.id === previewFontId) || FONTS[0];

            return (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4 pb-20"
            >
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">Live Theme Preview</h3>
                <p className="text-[10.5px] text-white/70">Test how the keyboard feels before applying.</p>
              </div>

              {/* Interactive Preview Window */}
              <div className="w-full h-48 rounded-2xl relative overflow-hidden flex flex-col justify-end p-2 border-2 border-white/20 shadow-2xl" style={{
                background: previewTheme.isCustom ? customBg : previewTheme.background
              }}>
                <div className={`w-full grid grid-cols-10 gap-1 mb-1 ${previewFont.className}`}>
                  {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(k => (
                    <button key={k} className="h-9 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm active:scale-90 transition-all backdrop-blur-md" style={{
                      backgroundColor: previewTheme.isCustom ? customKeyBg : previewTheme.keyBackground,
                      color: previewTheme.isCustom ? customText : previewTheme.keyText,
                      border: `1px solid ${previewTheme.isCustom ? customAccent + '40' : previewTheme.keyBorder || 'transparent'}`
                    }}>
                      {k}
                    </button>
                  ))}
                </div>
                <div className={`w-full grid grid-cols-9 gap-1 mb-1 px-3 ${previewFont.className}`}>
                  {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map(k => (
                    <button key={k} className="h-9 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm active:scale-90 transition-all backdrop-blur-md" style={{
                      backgroundColor: previewTheme.isCustom ? customKeyBg : previewTheme.keyBackground,
                      color: previewTheme.isCustom ? customText : previewTheme.keyText,
                      border: `1px solid ${previewTheme.isCustom ? customAccent + '40' : previewTheme.keyBorder || 'transparent'}`
                    }}>
                      {k}
                    </button>
                  ))}
                </div>
                <div className={`w-full flex justify-center gap-1 mb-1 ${previewFont.className}`}>
                  <button className="w-10 h-9 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm active:scale-90 transition-all backdrop-blur-md" style={{
                      backgroundColor: previewTheme.isCustom ? customAccent + '80' : previewTheme.accentColor,
                      color: previewTheme.isCustom ? customText : previewTheme.keyText,
                  }}>⇧</button>
                  {["Z", "X", "C", "V", "B", "N", "M"].map(k => (
                    <button key={k} className="flex-1 max-w-[9%] h-9 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm active:scale-90 transition-all backdrop-blur-md" style={{
                      backgroundColor: previewTheme.isCustom ? customKeyBg : previewTheme.keyBackground,
                      color: previewTheme.isCustom ? customText : previewTheme.keyText,
                      border: `1px solid ${previewTheme.isCustom ? customAccent + '40' : previewTheme.keyBorder || 'transparent'}`
                    }}>
                      {k}
                    </button>
                  ))}
                  <button className="w-10 h-9 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm active:scale-90 transition-all backdrop-blur-md" style={{
                      backgroundColor: previewTheme.isCustom ? customAccent + '80' : previewTheme.accentColor,
                      color: previewTheme.isCustom ? customText : previewTheme.keyText,
                  }}>⌫</button>
                </div>
                <div className={`w-full flex justify-center gap-1 ${previewFont.className}`}>
                  <button className="w-10 h-9 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm active:scale-90 transition-all backdrop-blur-md" style={{
                      backgroundColor: previewTheme.isCustom ? customKeyBg : previewTheme.keyBackground,
                      color: previewTheme.isCustom ? customText : previewTheme.keyText,
                      border: `1px solid ${previewTheme.isCustom ? customAccent + '40' : previewTheme.keyBorder || 'transparent'}`
                  }}>?123</button>
                  <button className="flex-1 h-9 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm active:scale-90 transition-all backdrop-blur-md" style={{
                      backgroundColor: previewTheme.isCustom ? customKeyBg : previewTheme.keyBackground,
                      color: previewTheme.isCustom ? customText : previewTheme.keyText,
                      border: `1px solid ${previewTheme.isCustom ? customAccent + '40' : previewTheme.keyBorder || 'transparent'}`
                  }}>SPACE</button>
                  <button className="w-14 h-9 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm active:scale-90 transition-all backdrop-blur-md" style={{
                      backgroundColor: previewTheme.isCustom ? customAccent : previewTheme.accentColor,
                      color: "#fff",
                  }}>Send</button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    if (previewTheme.isPremium && userProfile.plan === "free") {
                      onTriggerUpgrade();
                    } else if (previewFont.isPremium && userProfile.plan === "free") {
                      onTriggerUpgrade();
                    } else {
                      onSelectTheme(previewTheme);
                      onSelectFont(previewFont);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-white/20"
                >
                  Apply Theme & Font
                </button>
              </div>

              {/* Standard presets */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {THEMES.map(th => {
                  const isActive = previewThemeId === th.id;
                  const isPremiumTheme = th.isPremium;
                  return (
                    <div
                      key={th.id}
                      onClick={() => setPreviewThemeId(th.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all backdrop-blur-md shadow-sm ${isActive ? "bg-white/20 border-white/40 scale-[1.01]" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-xs font-bold text-white">{th.name}</span>
                        {isPremiumTheme && (
                          <span className="px-1.5 py-0.5 bg-white/20 text-white border border-white/30 text-[8px] font-bold rounded shadow-sm leading-none">PRO</span>
                        )}
                      </div>
                      <div className="w-full h-9 rounded bg-white/10 flex items-center justify-around px-1 overflow-hidden border border-white/5">
                        {["Q", "W", "E", "R", "T"].map((k, i) => (
                          <span key={i} className="text-[9px] px-1 py-0.5 bg-white/20 rounded text-white font-bold opacity-80">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fonts grid */}
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20 space-y-2.5 backdrop-blur-xl shadow-lg">
                <h4 className="text-xs font-bold text-white flex items-center space-x-1">
                  <BookOpen className="w-4 h-4 text-white" />
                  <span>Choose Typography Style</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS.map(fo => {
                    const isFontActive = previewFontId === fo.id;
                    const isPremiumFont = fo.isPremium;
                    return (
                      <button
                        key={fo.id}
                        onClick={() => setPreviewFontId(fo.id)}
                        className={`p-2 text-left rounded-xl text-xs font-bold border transition-all ${isFontActive ? "bg-white/20 border-white/40 text-white shadow-sm" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"}`}
                      >
                        <span className={fo.className}>{fo.name}</span>
                        {isPremiumFont && (
                          <span className="ml-1 text-[7px] bg-white/20 text-white border border-white/30 px-1 py-0.5 rounded shadow-sm uppercase tracking-wide leading-none">PRO</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
            );
          })}
INNER_EOF

# Replace from TAB 3: LIVE THEMES to TAB 4:
sed -i -e '/{\/\* TAB 3: LIVE THEMES \*\//,/{\/\* TAB 4:/!b' -e '/{\/\* TAB 4:/!d' -e '/{\/\* TAB 3: LIVE THEMES \*\//r /tmp/tab3_content.tsx' -e '/{\/\* TAB 3: LIVE THEMES \*\//d' src/components/DashboardApp.tsx
