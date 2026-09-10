import { EmployeeModel } from "../models/employee-model";
import { StatusCode } from "../models/enums";
import { employeeService } from "../services/employee-service";
import { securityMiddleware } from "../middleware/security-middleware";
import express, { Request, Response, Router, NextFunction } from "express";

class EmployeeController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/employees", securityMiddleware.verifyLoggedIn, this.getAllEmployees);
        this.router.get("/api/employees/:id", securityMiddleware.verifyLoggedIn, this.getOneEmployee);
        this.router.post("/api/employees", securityMiddleware.verifyAdmin, this.addEmployee);
        this.router.put("/api/employees/:id", securityMiddleware.verifyAdmin, this.updateEmployee);
        this.router.delete("/api/employees/:id", securityMiddleware.verifyAdmin, this.deleteEmployee);
    }

    private async getAllEmployees(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const employees = await employeeService.getAllEmployees();
            response.json(employees);
        }
        catch (err: any) {
            next(err);
        }
    }

    private async getOneEmployee(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = +request.params.id;
            const employee = await employeeService.getOneEmployee(id);

            if (!employee) {
                response.status(StatusCode.NotFound).json({ message: `Employee ${id} not found` });
                return;
            }

            response.json(employee);
        }
        catch (err: any) {
            next(err);
        }
    }

    private async addEmployee(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const employee = new EmployeeModel(request.body);
            const added = await employeeService.addEmployee(employee);
            response.status(StatusCode.Created).json(added);
        }
        catch (err: any) {
            next(err);
        }
    }

    private async updateEmployee(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const employee = new EmployeeModel(request.body);
            employee.id = +request.params.id;

            const updatedEmployee = await employeeService.updateEmployee(employee);

            if (!updatedEmployee) {
                response.status(StatusCode.NotFound).json({ message: `Employee ${employee.id} not found` });
                return;
            }

            response.json(updatedEmployee);
        }
        catch (err: any) {
            next(err);
        }
    }

    private async deleteEmployee(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = +request.params.id;
            await employeeService.deleteEmployee(id);
            response.sendStatus(StatusCode.NoContent);
        }
        catch (err: any) {
            next(err);
        }
    }
}

export const employeeController = new EmployeeController();