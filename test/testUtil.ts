import { expect } from "chai"

export function expectThrows(method: Function, errorMessage: string | RegExp = ""): void {
    let error: Error | undefined
    try {
        if (typeof method === "function") {
            method()
        }
    } catch (err) {
        error = err
    }
    expect(error, "No Error was thrown!").to.exist
    expect(error).to.be.an("Error")
    if (errorMessage) {
        expect(error!.message, `Error Message: ${error!.message}`).to.match(new RegExp(`^${errorMessage}`))
    }
}

export async function expectThrowsAsync(
    method: Function | Promise<any>,
    errorMessage: string | RegExp = ""
): Promise<void> {
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
    expect(error, "No Error was thrown!").to.exist
    expect(error, `'${error}' is not an error`).to.be.an("Error")
    if (errorMessage) {
        expect(error!.message, `Error Message: ${error!.message}`).to.match(new RegExp(`^${errorMessage}`))
    }
}
