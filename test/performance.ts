/* eslint-disable no-console */
import { schema, Serializable, serialize, validate } from "@js-soft/ts-serval"

class OldCheckEmployee {
    private _name: string

    public constructor(name: string) {
        this.name = name
    }
    public set name(value: string) {
        if (typeof value === "undefined") {
            throw new Error("Value is not defined")
        }

        if (typeof value !== "string") {
            throw new Error("Value is not a string")
        }

        if (value.length < 2) {
            throw new Error("Value is shorter than 2 characters")
        }

        if (value.length > 10) {
            throw new Error("Value is longer than 10 characters")
        }

        const regExp = new RegExp("^[\\w]+$")
        if (!regExp.test(value)) {
            throw new Error("Value contains other characters than the allowed ones.")
        }
        this._name = value
    }

    public get name(): string {
        return this._name
    }
}

interface IRole {
    role: string
}

@schema("http://schema.org", "Role")
class Role extends Serializable implements IRole {
    @serialize()
    public role: string

    public static from(value: IRole): Role {
        return super.fromT(value)
    }
}

@schema("http://schema.org", "Person")
class NewCheckEmployee extends Serializable {
    @validate({ min: 2, max: 10, allowedChars: "\\w" })
    @serialize()
    public name: string

    @serialize()
    public role: Role

    public checkRole(): string | undefined {
        return "Nope"
    }

    public static from(value: Object): NewCheckEmployee {
        return super.fromT(value)
    }
}

function measure(functionToMeasure: Function, thisArg?: any, argArray?: []): number {
    const start = new Date().getTime()
    functionToMeasure.apply(thisArg, argArray)
    const duration = new Date().getTime() - start
    return duration
}

const iterations = 1

const oldEmployees: OldCheckEmployee[] = []
const oldCreation = measure(() => {
    for (let i = 0; i < iterations; i++) {
        oldEmployees.push(new OldCheckEmployee("ba"))
    }
})
console.log(`Time to create old employees: ${oldCreation}ms`)

const newEmployees: NewCheckEmployee[] = []
const newCreation = measure(() => {
    for (let i = 0; i < iterations; i++) {
        const a = new NewCheckEmployee()
        a.name = "aaa"
        newEmployees.push(a)
    }
})
console.log(`Time to create new employees: ${newCreation}ms`)

const oldCheck = measure(() => {
    for (let i = 0; i < iterations; i++) {
        const emp = oldEmployees[i]
        emp.name = "anEmployeeName"
    }
})
console.log(`Time to check old employees: ${oldCheck}ms`)

let employee: NewCheckEmployee
const newCheck = measure(() => {
    for (let i = 0; i < iterations; i++) {
        employee = newEmployees[i]
        employee.name = "anEmployeeName"
    }
})
console.log(`Time to check new employees: ${newCheck}ms`)

const e: NewCheckEmployee = new NewCheckEmployee()
e.name = "Hossa"
e.role = Role.from({ role: "aRole" })

let serialized = e.serialize()
const parsed = JSON.parse(serialized)
const loaded: NewCheckEmployee = NewCheckEmployee.from(parsed) as any
serialized = loaded.serialize()
