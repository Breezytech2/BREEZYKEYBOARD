import React, { memo } from "react";
import { ChevronUp, Delete } from "lucide-react";

interface KeyButtonProps {
  keyVal: string;
  kIdx: number;
  rIdx: number;
  isShiftActive: boolean;
  isSymbolsActive: boolean;
  isPressed: boolean;
  isBubbleAnim: boolean;
  isScaleAnim: boolean;
  isFadeAnim: boolean;
  isGlowAnim: boolean;
  glowClass: string;
  glowStyle: React.CSSProperties;
  kbKeySpacing: number;
  kbKeyRadius: number;
  kbLabelSize: number;
  accHighContrast: boolean;
  onPointerDown: (key: string) => void;
  onPointerUp: () => void;
  onClick: (key: string) => void;
  setKeyRef: (key: string, el: HTMLButtonElement | null) => void;
  rowLength: number;
}

export const KeyButton = memo(({
  keyVal,
  kIdx,
  rIdx,
  isShiftActive,
  isSymbolsActive,
  isPressed,
  isBubbleAnim,
  isScaleAnim,
  isFadeAnim,
  isGlowAnim,
  glowClass,
  glowStyle,
  kbKeySpacing,
  kbKeyRadius,
  kbLabelSize,
  accHighContrast,
  onPointerDown,
  onPointerUp,
  onClick,
  setKeyRef,
  rowLength
}: KeyButtonProps) => {
  // Base sizes and margins
  let sizeClass = "flex-1 h-11";
  const lowerKey = keyVal.toLowerCase();
  const isBottomRowEnlargedLetter = ["z", "x", "c", "v", "b", "n", "m"].includes(lowerKey);

  if (isBottomRowEnlargedLetter) {
    sizeClass = `flex-[1.5] h-[50px] ${isShiftActive ? "font-black text-base" : ""}`;
  } else if (keyVal === "Shift") {
    sizeClass = `w-[48px] h-[50px] ${isShiftActive ? "font-black" : ""}`;
  } else if (keyVal === "Backspace") {
    sizeClass = "w-[48px] h-[50px]";
  }

  const customStyle: React.CSSProperties = {
    ...glowStyle,
    marginLeft: `${kbKeySpacing / 2}px`,
    marginRight: `${kbKeySpacing / 2}px`,
    marginTop: `${kbKeySpacing / 2}px`,
    marginBottom: `${kbKeySpacing / 2}px`,
    borderRadius: `${kbKeyRadius}px`,
  };

  if (accHighContrast) {
    customStyle.borderWidth = "2.5px";
    customStyle.borderColor = "#ffffff";
    customStyle.boxShadow = "0 0 0 1.5px #000000";
  }

  if (isPressed) {
    if (isScaleAnim) {
      customStyle.transform = "scale(0.88)";
    } else if (isFadeAnim) {
      customStyle.opacity = 0.5;
    } else if (isGlowAnim) {
      customStyle.filter = (customStyle.filter || "") + " brightness(1.6)";
      customStyle.boxShadow = "0 0 16px 4px rgba(255,255,255,0.8)";
    }
  }

  const btnClass = `mechanical-keycap ${glowClass} ${sizeClass} flex items-center justify-center transition-all focus:outline-none relative select-none`;

  return (
    <>
      {/* Bubble Keypress Magnified Popup Preview */}
      {isPressed && isBubbleAnim && (
        <div 
          className="absolute bottom-[115%] left-1/2 -translate-x-1/2 z-[110] bg-slate-900/95 backdrop-blur-xl border border-white/30 px-3.5 py-2.5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center pointer-events-none"
          style={{ minWidth: "48px" }}
        >
          <span className="text-white font-black text-xl uppercase">
            {keyVal === "Shift" ? "⇧" : keyVal === "Backspace" ? "⌫" : keyVal}
          </span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-900/95" />
        </div>
      )}

      <button
        ref={(el) => setKeyRef(keyVal, el)}
        onPointerDown={() => onPointerDown(keyVal)}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={(e) => {
          e.stopPropagation();
          onClick(keyVal);
        }}
        className={btnClass}
        style={customStyle}
        title={keyVal}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="mechanical-switch-stem" />
          <div className="mechanical-keycap-glass-highlight" />
          <div className="mechanical-keycap-frosted-edges" />
        </div>

        <span 
          className="keycap-text text-white font-bold tracking-wide"
          style={{ fontSize: `${kbLabelSize}px` }}
        >
          {keyVal === "Shift" ? (
            <ChevronUp className={`w-4.5 h-4.5 ${isShiftActive ? "stroke-[3px]" : ""}`} />
          ) : keyVal === "Backspace" ? (
            <Delete className="w-4.5 h-4.5" />
          ) : (
            isShiftActive && !isSymbolsActive ? keyVal.toUpperCase() : keyVal
          )}
        </span>
      </button>
    </>
  );
});

KeyButton.displayName = "KeyButton";
