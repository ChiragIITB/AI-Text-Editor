import { useRef, } from 'react';
import './App.css'
import Editor, { type EditorAPI } from './Editor'
import QuickTools from './QuickTools';
import Suggestor from './Suggestor';
import { editorMachine } from './editorMachine';
import { useMachine } from '@xstate/react';
// import Trial from './trial';

function App() {
  const [state, send] = useMachine(editorMachine)
  const editorRef = useRef<EditorAPI>(null);


  const handleContinueWriting = () => {
    console.log('button clicked')

    // const view = viewRef.current;
    // if (!view) return;
    // const text = view.state.doc.textContent;
    // const text = "<editor text passed>"
    // console.log('passing text: ' + text)
    const seedText = editorRef.current?.getText()
    console.log(seedText)
    send({ type: "REQUEST_AI", seedText })
  }
  const handleClearSuggestion = () => {
    console.log('cancelling')
    send({ type: "CLEAR_SUGGESTION"})
  }

  function findFunction(state: any){
    return state.value.toString() == 'idle' ? handleContinueWriting : handleClearSuggestion
  }

  return (
    <div className='app-wrapper'>
      <div className='app-header'>
        <h1>ai-ditor</h1>
      </div>
      <div className='textbox-wrapper'>

        <QuickTools 
          onBold={() => editorRef.current?.toggleBold()}
          onItalic={() => editorRef.current?.toggleItalic()}
          onH1={() => editorRef.current?.makeH1()}
          onH2={() => editorRef.current?.makeH2()}
          onUndo={() => editorRef.current?.undo()}
          onRedo={() => editorRef.current?.redo()}/>
        
        <Editor state= {state} send={send} ref ={editorRef} />
        <div></div>

        <div className="buttons">
          <button onClick={findFunction(state)}>
            {state.value.toString() == 'idle' ? "continue writing" : "Clear Suggestion"}
          </button>
        </div>

        <Suggestor 
          suggestion={state.context.aiResponse} 
          onSelectSentence={(s) => send({ type: "APPLY_TO_EDITOR", sentence: s })}/>

      </div>
    </div>
  )
}

export default App
