// using XState
import { useMachine } from "@xstate/react";
import { trialMachine } from "./trialMachine";

export default function Trial(){
    const [state, send] = useMachine(trialMachine);
    const updateState = () => {
        console.log(state.value);
        send({type: "CHANGE", text: state.value.toString()});
    }

    return (
        <>
            <p>{state.value.toString().toUpperCase()}</p>
            <p>{state.context.inputText}</p>
            <button
                onClick={updateState}
                >Change State</button>
        </>
    );
}