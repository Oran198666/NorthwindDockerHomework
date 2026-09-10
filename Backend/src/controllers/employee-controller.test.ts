import { describe, it, before } from "mocha";
import { expect } from "chai";
import { employeeController } from "./employee-controller";
import supertest from "supertest";
import { dal } from "../utils/dal";
import { app } from "../app";
import { EmployeeModel } from "../models/employee-model";
import { StatusCode } from "../models/enums";


describe("employeeController", () => {

    it("singleton exist", () => {
        expect(employeeController).to.exist;
    });

    it("should not return employees array", async () => {
        const response = await supertest(app.server).get("/api/employees");
        const employees = response.body as EmployeeModel[];
        expect(response.status).to.equal(StatusCode.Unauthorized);
    });

    let token: string;
    let newEmployeeId: number;
    const adminEmployee = { email: "orgy@gmail.com", password: "Orgy1986!" };

    before(async () => {
        await app.configure();
        const response = await supertest(app.server).post("/api/login").send(adminEmployee);
        token = response.body;
    });

    it("should return employees array", async () => {
        const response = await supertest(app.server).get("/api/employees").auth(token, { type: "bearer" })
        const employees = response.body as EmployeeModel[];
        expect(employees.length).to.be.greaterThanOrEqual(5);
        expect(employees[0]).to.not.be.empty;
    });

    it("Should return 1 employee", async () => {
        const response = await supertest(app.server).get("/api/employees/4").auth(token, { type: "bearer" });
        const employee = response.body as EmployeeModel;
        expect(employee).to.not.be.empty;
        expect(employee).to.contain.keys("id", "firstName", "lastName", "birthDate");
    });

    it("Should add a new employee without an image", async () => {
        const employee = { firstName: "gomik", lastName: "pedik", birthDate: "1990-05-15" };
        const response = await supertest(app.server)
            .post("/api/employees")
            .auth(token, { type: "bearer" })
            .send(employee);
        const dbEmployee = response.body as EmployeeModel;
        newEmployeeId = dbEmployee.id;
        expect(dbEmployee).to.not.be.empty;
        expect(dbEmployee).to.contain.keys("id", "firstName", "lastName", "birthDate");
    });

    it("Should update existing employee without an image", async () => {
        const response = await supertest(app.server)
            .put(`/api/employees/${newEmployeeId}`)
            .auth(token, { type: "bearer" })
            .send({ firstName: "gomik1", lastName: "pedik1", birthDate: "1991-05-15" });
        const dbEmployee = response.body as EmployeeModel;
        newEmployeeId = dbEmployee.id;
        expect(dbEmployee).to.not.be.empty;
        expect(dbEmployee).to.contain.keys("id", "firstName", "lastName", "birthDate");
    });

    it("should return 404 for an unknown route", async () => {
        const response = await supertest(app.server).get("/api/.*").auth(token, { type: "bearer" });
        expect(response.status).to.equal(StatusCode.NotFound);
    });

    it("should return 404 for on resource not found", async () => {
        const response = await supertest(app.server).get("/api/employees/999999").auth(token, { type: "bearer" });
        expect(response.status).to.equal(StatusCode.NotFound);
    });

    
    it("should delete the added employee", async () => {
        const response = await supertest(app.server)
            .delete(`/api/employees/${newEmployeeId}`)
            .auth(token, { type: "bearer" });
        expect(response.status).to.equal(StatusCode.NoContent);
    });

});