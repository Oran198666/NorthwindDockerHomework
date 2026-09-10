import { describe, it } from "mocha";
import { calc } from "./calc-service";
import { expect } from "chai";

describe("CalcService", () => {

    it("should return a correct sum", () => {
        const sum = calc.getSum([1, 2, 3, 4, 5.5]);
        expect(sum).to.equal(15.5);
    });

    it("should return 0 when all values are zeros", () => {
        expect(calc.getSum([0])).to.equal(0);
    });

    it("should throw when sending empty array", () => {
        expect(() => calc.getSum([])).to.throw("array cant be empty");
    });

    it("should handle negative numbers", () => {
        expect(calc.getSum([10, -3, -2, -9])).to.equal(-4);
    });

    it("should return the value itself for a single element", () => {
        expect(calc.getSum([42])).to.equal(42);
    });

    it("should handle floating point values", () => {
        expect(calc.getSum([0.1, 0.2])).to.be.closeTo(0.3, 0.0001);
    });

    it("should throw for a null argument", () => {
        expect(() => calc.getSum(null as any)).to.throw();
    });

    it("should throw for an undefined argument", () => {
        expect(() => calc.getSum(undefined as any)).to.throw();
    });
});