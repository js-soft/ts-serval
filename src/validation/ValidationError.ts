import { ServalError } from "../errors"

export class ValidationError extends ServalError {
    public type: string
    public property: string
    public reason: string
    public override cause: Error | undefined

    public constructor(type: string, property: string, reason: string, cause?: Error) {
        super(`${type}.${property} :: ${reason}`)

        Object.setPrototypeOf(this, new.target.prototype)
        this.name = ValidationError.name
        this.type = type
        this.property = property
        this.reason = reason
        this.cause = cause
    }

    public override toString(): string {
        if (this.cause) {
            return `${this.type}.${this.property} :: ${this.reason}\n\n${this.cause.stack}`
        }
        return `${this.type}.${this.property} :: ${this.reason}`
    }
}
