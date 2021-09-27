import { expect } from "chai"

export function expectThrows(method: Function, errorMessage = ""): void {
    let error: Error | undefined
    try {
        if (typeof method === "function") {
            method()
        }
    } catch (err) {
        error = err
    }
    expect(error).to.be.an("Error")
    if (errorMessage) {
        expect(error!.message.startsWith(errorMessage)).to.be.true
    }
}

export async function expectThrowsAsync(method: Function | Promise<any>, errorMessage = ""): Promise<void> {
    let error: Error | undefined
    try {
        if (typeof method === "function") {
            await method()
        } else {
            await method
        }
    } catch (err) {
        error = err
    }
    expect(error).to.be.an("Error")
    if (errorMessage) {
        expect(error!.message).to.match(new RegExp(`^${errorMessage}`))
    }
}
