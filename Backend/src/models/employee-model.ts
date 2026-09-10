import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Employee Schema:
const EmployeeSchema = z.object({
    id: z.number().int().positive().optional(),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    birthDate: z.coerce.date()
});

// Employee Interface (I = Interface):
type IEmployeeModel = z.infer<typeof EmployeeSchema>;

// Employee Model:
export class EmployeeModel implements IEmployeeModel {

    public id: number;
    public firstName: string;
    public lastName: string;
    public birthDate: Date;

    public constructor(employee: EmployeeModel) { // Copy Constructor
        this.id = employee.id;
        this.firstName = employee.firstName;
        this.lastName = employee.lastName;
        this.birthDate = employee.birthDate;
    }

    public validate(): void {
        const result = EmployeeSchema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }

}