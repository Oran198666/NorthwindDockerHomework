import { EmployeeModel } from "../models/employee-model";
import { dal } from "../utils/dal";
import { OkPacket } from "mysql2";

class EmployeeService {

    public async getAllEmployees(): Promise<EmployeeModel[]> {
        const sql = "SELECT id, firstName, lastName, birthDate from employees";
        const employees = await dal.execute(sql) as EmployeeModel[];
        return employees;
    }

    public async getOneEmployee(id: number): Promise<EmployeeModel> {
        const sql = "SELECT id, firstName, lastName, birthDate from employees where id = ?";
        const employees = await dal.execute(sql, [id]) as EmployeeModel[];
        return employees[0];
    }

    public async addEmployee(employee: EmployeeModel): Promise<EmployeeModel> {
        employee.validate();
        const sql = "INSERT INTO employees (firstName, lastName, birthDate) VALUES (?, ?, ?)";
        const info = await dal.execute(sql, [employee.firstName, employee.lastName, employee.birthDate]) as OkPacket;
        employee.id = info.insertId;
        return employee;
    }

    public async updateEmployee(employee: EmployeeModel): Promise<EmployeeModel | null> {
        employee.validate();
        const sql = `UPDATE employees
    SET firstName = ?, lastName = ?, birthDate = ?
    WHERE id = ?`;
        const info = await dal.execute(sql, [
            employee.firstName,
            employee.lastName,
            employee.birthDate,
            employee.id
        ]) as OkPacket;

        if (info.affectedRows === 0) {
            return null;
        }
        return employee;
    }

    public async deleteEmployee(id: number): Promise<boolean> {
        const sql = "DELETE FROM employees WHERE id = ?";
        const info = await dal.execute(sql, [id]) as OkPacket;
        return info.affectedRows > 0;
    }

}

export const employeeService = new EmployeeService();