import path from "path"
import { describe, it, before } from "mocha";
import { expect } from "chai";
import { dal } from "../utils/dal";
import supertest from "supertest";
import { app } from "../app";
import { ProductModel } from "../models/product-model";
import { StatusCode } from "../models/enums";

describe("ProductController", () => {

    let token: string;

    before(async () => {
        await app.configure();
        const credentials = { email: "orgy@gmail.com", password: "Orgy1986!" };
        const response = await supertest(app.server).post("/api/login").send(credentials);
        token = response.body;
    });

    it("should return product array", async () => {
        const response = await supertest(app.server).get("/api/products");
        const products = response.body as ProductModel[];
        expect(products.length).to.be.greaterThanOrEqual(1);
        expect(products[0]).to.not.be.empty;
    });

    it("should return one product", async () => {
        const response = await supertest(app.server).get("/api/products/1");
        const product = response.body as ProductModel;
        expect(product).to.not.be.empty;
        expect(product).to.contain.keys("id", "name", "price", "stock");
        
    });

    it("should add a product without an image", async () => {
        const product = { name: "Pizza", price: 100, stock: 200 };
        const response = await supertest(app.server)
            .post("/api/products")
            .auth(token, { type: "bearer" })
            .send(product);
        const dbProduct = response.body as ProductModel;
        expect(dbProduct).to.not.be.empty;
        expect(dbProduct).to.contain.keys("id", "name", "price", "stock");
    });

    it("should add a product with an image", async () => {
        const imagePath = path.join(__dirname, "..", "assets", "tests", "pizza.jpg");
        const product = { name: "Pizza", price: 100, stock: 200 };
        const response = await supertest(app.server)
            .post("/api/products")
            .auth(token, { type: "bearer" })
            .field("name", product.name)
            .field("price", product.price)
            .field("stock", product.stock)
            .attach("image", imagePath);
        const dbProduct = response.body as ProductModel;
        expect(dbProduct).to.not.be.empty;
        expect(dbProduct).to.contain.keys("id", "name", "price", "stock");
    });

    it("should return 404 for an unknown route", async () => {
        const response = await supertest(app.server).get("/api/.");
        expect(response.status).to.equal(StatusCode.NotFound);
    });

    it("should return 404 for on resource not found", async () => {
        const response = await supertest(app.server).get("/api/products/999999");
        expect(response.status).to.equal(StatusCode.NotFound);
    });

    after(async () => {
        await dal.execute("delete from products where name = 'Pizza'");
    });

});