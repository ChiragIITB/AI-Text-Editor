import { createMachine, assign, fromPromise } from "xstate";
import callQwen from "./aiFunction";

// IMPORTANT TO DOs

// - Change any to string - for text types and context




// only for documentation
// type EditorEvent =
//   | { type: "REQUEST_AI"; text: string }
//   | { type: "APPLY_TO_EDITOR" }
//   | { type: "RETRY" }
//   | { type: "CANCEL" };

interface EditorContext {
  inputText: string;
  aiResponse: string
  selectedSentence: string
  error?: string;
}   


const callAIService = fromPromise(async ({input}) => {
    // const ctx = input as EditorContext;
    // console.log(ctx.inputText)
    // return (ctx.inputText + ' new Text.')

    // FOR FINAL SUBMISSION
    const ctx = input as EditorContext;
    const response = await callQwen(ctx.inputText);
    return response;
});


export const editorMachine = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5SQJYBcD2AnAdCiANmAMQBKAogIoCq5AygCoD6AggJIDaADALqKgAHDLHQoMAO34gAHogDMcgEw4AbAEZFKrip2LFAFgUB2ADQgAnoj1qcauQA59AVhX3di+130Bfb2dSYuFhgAI4ArnBoKOJQxBASYHjiAG4YANaJAGZgaADGABbs3HxIIEIiURJSsgiONnJqXEYOLipG9k5yZpYIakbK+upqAJxGairDmloqvv4Q6Ng4weGR0bFgWFiLAgQAhmiZ2AC2ONl5hZy8UuWiVaU1LnI4DfpNKp0qhu3diINGOIolIoNHJ9CNDHJZuB5oEcLAwlAYLAojFiCwAArogAyAE0mAwAPJMcgAETYhNIxWuwluknuiGGzgBRn09g6XGGnI8Th+CDawwBimGansRiM7ycIp8fmhC1w8MRq1RAGEseQWKQmHRqABxHX0BhsAkAOSppRulTpoBqIqcOCMXMcrK4aicRh5FkQE2U7zBTjBBmGXHsUICi12Ah25jWxG1eoNZsENMt1UQahGyk5rNZmkloN5oLtIuFn1GGhFiicoZhiw2WywZHIDFIOMTZWTYitMnk71sfU+6iGwuGBeGdpcjO0enUE5mMrDuDr2GIypYxuV5CxbYtndTCEUwZw+mBwcUDr0QbkHp6rPsOCcbpF9kaDrcal8MvEGAgcCkC+pFS7vSvR2LYHLjH0QZig4+i8h0thDG49hjq8WghvONa4PgRAAbSe4QWBJaQU0zSOLyBhPI8+ivE4Y5qKh1ZyksoQRMiay4SmwFOFwPqfG8YzusMDQqAWHI4CROjup0-oTIxsIKkiKJQBxQHWogbhcDgz6dNokwnl0noIM4Ar2HIwb6AJww6LJGFMRGUbseaHZ3GpvQuvoAJyGKnLIfRdG8tJ9qghKHTApMwxybWmzYCpLndggXmUVeuaTE4yH9Lyt62G6wJuCe7qDB+3hAA */
        id: "editor",
        initial: "idle",

        context: {
            inputText: "",
            aiResponse: "",
            selectedSentence: "",
            error: undefined,
        } as EditorContext,

        states: {
            idle: {
                on: {
                REQUEST_AI: {
                    target: "requesting",
                    actions: ["storeInput", "stateOutput"],
                },
                },
            },
            requesting: {
                invoke: {
                id: "fetchAI",
                src: "callAIService", // refering to the actor
                input: ({context}) => context,
                onDone: {
                    target: "suggesting",
                    actions: ["storeAIResult"],
                },  
                onError: {
                    target: "error",
                    actions: assign({
                    error: (_, event: any) => event.data,
                    }),

                    reenter: true
                },
                },
            },

            suggesting: {
                on: {
                APPLY_TO_EDITOR: {
                    target: "applying",
                    actions: ["storeSelection", "stateOutput"]
                },
                CLEAR_SUGGESTION: {
                    target: "idle",
                    actions: ["clearAIResponse", "stateOutput"]
                } 
                },
            },
            applying: {
                on: {
                SUGGEST: {
                    target: "suggesting",
                    actions: ["stateOutput"]
                },
                },
            },
            error: {
                on: {
                RETRY: "requesting",
                CANCEL: "idle",
                },
            },
        },
    },
    {
        actions: {
            storeInput: assign({
                inputText: ({event}) => {
                    console.log("storing input", event.seedText)
                    return event.seedText
                },
            }),
            storeAIResult: assign({
                aiResponse: ({event}) => {
                    console.log('storing AI result: ', event.output);
                    return event.output;
                },
            }),
            stateOutput: ({context, event}) => {
                console.log("current state: ", event.type)
                console.log("context: ", context)
            },
            storeSelection: assign({
                selectedSentence: ({event}) => {
                    console.log('selected sentence: ', event.sentence)
                    return event.sentence;
                }
            }),
            clearAIResponse: assign({
                aiResponse: ""
            })
        },

        actors: {
            callAIService
        },
    }
)