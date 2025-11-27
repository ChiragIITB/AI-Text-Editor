import { assign, createMachine} from "xstate";

// 1. Define the specific event type for the CHANGE action, carrying the payload.
export type ChangeInputEvent = {
  type: "CHANGE";
  text: string
};

interface EditorContext {
  inputText: string;
}   


// 3. Define the machine with corrected types and logic
export const trialMachine = createMachine(
  {
    id: "trial",
    initial: "rest",
    context: {
        inputText: ""
    } as EditorContext,
    // Explicitly define event types for better type inference
    types: { events: {} as ChangeInputEvent },

    states: {
      rest: {
        on: {
          CHANGE: {
            target: "motion",
            actions: [
              "printState", "printContent", assign({
                inputText: "In motion"
              })
            ],
          },
        },
      },
      motion: {
        on: {
          CHANGE: {
            target: "rest",
            actions: [
              "printState", "printContent", assign({
                inputText: "In rest"
              })
            ],
          },
        },
      },
    },
  },
  {
    actions: {
      printState: ({ event }) => {
        console.log(`Current Event: ${event.type}`);
      },
      printContent: ({ event }) => {
        console.log(`Current Content: ${event.text}`);
      }
    },
  }
);