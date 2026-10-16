import { Message } from "../types"

export type LlmResponse = {
    completions: {
        choices: {
            message: {
                content: string
            }   
        }[]
    },
    inputTokensConsumed: number,
    outputTokensConsumed: number
}

export class BaseLlm {
    static async chat(model: string, messages: Message): Promise<LlmResponse> {
        throw new Error("Not implemented chat function")
    }
}