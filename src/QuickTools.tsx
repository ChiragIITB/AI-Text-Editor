

import "./QuickTools.css"

interface QuickToolsProps {
  onBold: () => void;
  onItalic: () => void;
  onH1: () => void;
  onH2: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export default function QuickTools({
        onBold,
        onItalic,
        onH1,
        onH2,
        onUndo,
        onRedo,
    }: QuickToolsProps){

    
    return(
        <div className="quick-tools-wrapper">
            {/* <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}> */}
                <button onMouseDown={(e) => { e.preventDefault(); onH1(); }}>H1</button>
                <button onMouseDown={(e) => { e.preventDefault(); onH2(); }}>H2</button>

                <button onMouseDown={(e) => { e.preventDefault(); onBold(); }}><b>B</b></button>
                <button onMouseDown={(e) => { e.preventDefault(); onItalic(); }}><i>I</i></button>

                <button onMouseDown={(e) => { e.preventDefault(); onUndo(); }}>Undo</button>
                <button onMouseDown={(e) => { e.preventDefault(); onRedo(); }}>Redo</button>
            {/* </div> */}
        </div>
    )
}