import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import { history, redo, undo } from "prosemirror-history";
import { baseKeymap, setBlockType, toggleMark } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { placeholder } from "prosemirror-placeholder";

// using XState
// import { useMachine } from "@xstate/react";
// import { editorMachine } from "./editorMachine";


import "./Editor.css"
import "prosemirror-view/style/prosemirror.css";


export interface EditorAPI {
    getText: () => void
    toggleBold: () => void;
    toggleItalic: () => void;
    makeH1: () => void;
    makeH2: () => void;
    undo: () => void;
    redo: () => void;
}

interface EditorProps {
  state: any;
  send: any;
}


const Editor = forwardRef<EditorAPI, EditorProps>((props, ref) => {
    // const [state, send] = useMachine(editorMachine);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);


    // ProseMirror Mounting/UnMounting
    useEffect((): (() => void) | undefined => {
        console.log('mounted')
        if (!wrapperRef.current) return;

        // Create a fresh DOM node NOT controlled by React
        const editorRoot = document.createElement("div");
        wrapperRef.current.appendChild(editorRoot);
        const pmState = EditorState.create({
            schema,
            plugins: [
                keymap({
                    "Mod-b": toggleMark(schema.marks.strong),
                    "Mod-i": toggleMark(schema.marks.em),
                    // include baseKeymap so other defaults still work
                }),
                keymap(baseKeymap),
                history(), 
                placeholder("Start typing your content"),
            ],
        });
        
        console.log(baseKeymap)
        const view = new EditorView(editorRoot, { 
            state: pmState, 
            handleDOMEvents: {
                "keydown"(_, event) {
                    console.log(event.key, event.ctrlKey)
                    return false
                },
        } });
        viewRef.current = view; 
        const text = view.state.tr.insertText(
            "", view.state.doc.content.size // insert at end for now
        );
        view.dispatch(text);

        return () => {
            console.log('unmounted')
            view.destroy();
            wrapperRef.current?.removeChild(editorRoot);
        };
    }, []);

    // Expose commands to parent
    useImperativeHandle(ref, () => ({
        getText() {
            const view = viewRef.current;
            if (!view) return "";
            return view.state.doc.textContent;
        },
        toggleBold() {
            const view = viewRef.current;
            if (view) {
                toggleMark(schema.marks.strong)(view.state, view.dispatch);
                view.focus();
            }
        },
        toggleItalic() {
            const view = viewRef.current;
            if (view) {
                toggleMark(schema.marks.em)(view.state, view.dispatch);
                view.focus();
            }
        },
        makeH1() {
            const view = viewRef.current;
            if (view && schema.nodes.heading) {
                setBlockType(schema.nodes.heading, { level: 1 })(view.state, view.dispatch);
                view.focus();
            }
        },
        makeH2() {
            const view = viewRef.current;
            if (view && schema.nodes.heading) {
                setBlockType(schema.nodes.heading, { level: 2 })(view.state, view.dispatch);
                view.focus();
            }
        },
        undo() {
            const view = viewRef.current;
            if (view) undo(view.state, view.dispatch);
        },
        redo() {
            const view = viewRef.current;
            if (view) redo(view.state, view.dispatch);
        },
    }));


    // Handle state = applying
    useEffect(() => {
        if (props.state.matches("applying") && viewRef.current) {
            console.log('applying...')
            const view = viewRef.current;
            // const tr = view.state.tr.insertText(
            // props.state.context.selectedSentence,
            // view.state.doc.content.size // insert at end for now
            // );
            // view.dispatch(tr);

            insertTextAtEndOfCurrentBlock(view, props.state.context.selectedSentence)
            props.send({type: "SUGGEST"});
            console.log('Back to Suggesting')
        }
    }, [props.state, props.send]);

    function insertTextAtEndOfCurrentBlock(view:any, textToInsert: string) {
        if (!view || !textToInsert) return;

        const { state } = view;
        const { $from } = state.selection;
        
        // 1. Get the position at the end of the current block node.
        // $from.end() returns the position immediately after the last content in the block.
        const endPosition = $from.end(); 
        
        let tr = state.tr;
        tr = tr.insertText(textToInsert, endPosition);
        
        // Move cursor to the new end position
        const newPosition = endPosition + textToInsert.length;
        tr = tr.setSelection(state.selection.constructor.near(tr.doc.resolve(newPosition)));
        
        view.dispatch(tr);
        console.log(`Appended text to end of block at position ${endPosition}.`);
    }

    // const handleContinueWriting = () => {
    //     console.log('button clicked')

    //     const view = viewRef.current;
    //     if(!view) return; 
    //     const text = view.state.doc.textContent; 
    //     // const text = "<editor text passed>"
    //     console.log('passing text: ' + text)
    //     send({type: "REQUEST_AI", text})
    // }
    // const handleCancel = () => {
    //     console.log('cancelling')
    //     send({type: "CANCEL", text: "reset text"})
    // }

    return (
        <>
            <div 
                className="editor-box"
                ref={wrapperRef}
                suppressContentEditableWarning={true}
                suppressHydrationWarning={true}
                style={{
                    minHeight: "200px",
                }}>
            </div>
            {/* <div className="buttons">
                <button onClick={state.value.toString() == 'idle' ? handleContinueWriting : handleCancel}>
                    {state.value.toString() == 'idle' ? "continue writing" : "Cancel"}
                </button>
            </div> */}
        </>
    );
})


export default Editor;