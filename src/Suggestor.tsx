
import "./Suggestor.css"

interface Suggestion{
    suggestion : String,
    onSelectSentence: (s:string) => void 
}

export default function Suggestor({suggestion, onSelectSentence} : Suggestion ){

    // let suggestion = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, maxime perspiciatis facilis aliquid similique placeat facere at deserunt molestias. Laudantium dignissimos cumque delectus porro commodi labore deleniti ex corporis cum?";

    const splitter = (sentence: String) => {
        const sentences = sentence.split(/(?<=\.)\s+/).filter(s => s.trim().length > 0)
        return sentences
    }
    let blocks = splitter(suggestion)

    const insertToEditor = (event: any) => {
        let sentence = event.target.innerText;
        event.target.classList.add('suggestion-sentence-added')
        onSelectSentence(sentence);
    }

    return(
        <div className="suggestor-wrapper">
            <div className="suggestion-containers">
                <p className="suggestion-paragraph">
                    {blocks.map((sentence, index) => {
                        return (
                            <span 
                                key={index}
                                className="suggestion-sentence"
                                onClick={insertToEditor}
                                >
                                {sentence + " "}
                            </span>
                        )
                    })}
                </p>
            </div>
        </div>
    )
}