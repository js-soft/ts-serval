export class ServalError extends Error {}

export class SerializationError extends ServalError {
    public type: string
    public property: string
    public reason: string
    public cause: Error | undefined

    public constructor(type: string, property: string, reason: string, cause?: Error) {
        super(`${type}.${property} :: ${reason}`)

        Object.setPrototypeOf(this, new.target.prototype)
        this.name = SerializationError.name
        this.type = type
        this.property = property
        this.reason = reason
        this.cause = cause
    }

    public toString(): string {
        if (this.cause) {
            return `${this.type}.${this.property} :: ${this.reason}\n\n${this.cause.stack}`
        }
        return `${this.type}.${this.property} :: ${this.reason}`
    }
}

export class DecoratorError extends ServalError {
    public decorator: string

    public constructor(decorator: string, message?: string) {
        super(message)

        Object.setPrototypeOf(this, new.target.prototype)
        this.name = DecoratorError.name
        this.decorator = decorator
    }

    public toString(): string {
        return `${this.decorator} :: ${this.message}`
    }
}
