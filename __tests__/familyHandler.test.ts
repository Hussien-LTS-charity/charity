import { Request, Response } from "express";
import supertest from "supertest";
import { app } from "../src/app";
import sequelize from "../src/models/sequelize";
import Family from "../src/models/Family";
import {
    httpAddFamilyHandler,
    httpDeleteFamilyHandler,
    httpEditFamilyHandler,
    httpGetAllFamiliesHandler,
    httpGetFamilyHandler,
} from "../src/controllers/family.controller";

const request = supertest(app);

beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

afterEach(async () => {
    await Family.destroy({ where: {} });
});

describe.skip("httpAddFamilyHandler", () => {
    it("should add a new family and return a success response", async () => {
        const mockRequestBody = {
            id: 1,
            personCharge: 1,
            familyPriority: 1,
            email: "test@tesst.com",
            address: "string",
            contactNumber: "0788888888",
            houseCondition: "string",
            notes: "string",
            familyCategory: "orphans",
            members: [],
        };

        const response = await request.post("/api/family").send(mockRequestBody);

        expect(response.status).toBe(201);

        expect(response.body.message).toBe("Family added successfully");
        expect(response.body.family).toBeDefined();
    });

    it("should return 500 and an error message when an error occurs in the handler", async () => {
        const mockReq = {
            body: {},
        } as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await httpAddFamilyHandler(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);

        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to add family",
        });
    });
});

describe.skip("httpGetFamilyHandler", () => {
    it("should return a family when a valid family ID is provided", async () => {
        const mockRequestBody = {
            id: 2,
            personCharge: 1,
            familyPriority: 1,
            email: "test@tesst.com",
            address: "string",
            contactNumber: "0788888888",
            houseCondition: "string",
            notes: "string",
            familyCategory: "orphans",
            members: [],
        };

        await request.post("/api/family").send(mockRequestBody);

        const testFamilyId = mockRequestBody.id;

        const response = await request.get(`/api/family/${testFamilyId}`);

        expect(response.status).toBe(200);

        expect(response.body.family).toBeDefined();
    });

    it("should return 404 when an invalid family ID is provided", async () => {
        const response = await request.get("/api/family/22");

        expect(response.status).toBe(404);

        expect(response.body.message).toBe("Family not found");
    });

    it("should return 500 and an error message when an error occurs in the handler", async () => {
        const mockReq = {} as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await httpGetFamilyHandler(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);

        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to retrieve family",
        });
    });
});

describe.skip("httpEditFamilyHandler", () => {
    it("should update the family and return a success response", async () => {
        const testFamily = {
            id: 1,
            personCharge: 1,
            familyPriority: 1,
            email: "test3@tesst.com",
            address: "string",
            contactNumber: "07888888488",
            houseCondition: "string",
            notes: "string",
            familyCategory: "orphans",
            members: [],
        };
        await request.post("/api/family").send(testFamily);
        const mockRequestBody = {
            address: "address",
        };

        const response = await request
            .put(`/api/family/${testFamily.id}`)
            .send(mockRequestBody);

        expect(response.status).toBe(200);

        expect(response.body.message).toBe("Family updated successfully");

        const updatedFamily = await Family.findByPk(53);
        if (updatedFamily) {
            expect(response.body.family).toBeDefined();
            expect(updatedFamily.id).toBe(testFamily.id);
            expect(updatedFamily.address).toBe(mockRequestBody.address);
        }
    });

    it("should return a 404 status code when the family to update is not found", async () => {
        const mockRequestBody = {
            address: "address",
        };

        const response = await request.put("/api/family/22").send(mockRequestBody);

        expect(response.status).toBe(404);

        expect(response.body.message).toBe("Family not found");
    });

    it("should return a 500 status code and an error message when an error occurs in the handler", async () => {
        const mockReq = {} as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;


        jest.spyOn(Family, "update").mockRejectedValue(new Error("Test error"));

        await httpEditFamilyHandler(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);

        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to edit family",
        });
    });
});

describe.skip("httpDeleteFamilyHandler", () => {
    it("should delete the family and return a success response", async () => {
        const testFamily = {
            id: 1,
            personCharge: 1,
            familyPriority: 1,
            email: "test3@tesst.com",
            address: "string",
            contactNumber: "07888888488",
            houseCondition: "string",
            notes: "string",
            familyCategory: "orphans",
            members: [],
        };
        await request.post("/api/family").send(testFamily);
        const testFamilyId = testFamily.id;

        const response = await request.delete(`/api/family/${testFamilyId}`);

        expect(response.status).toBe(200);

        expect(response.body.message).toBe("Family deleted successfully");

        const deletedFamily = await Family.findByPk(testFamilyId);
        expect(deletedFamily).toBeNull();
        expect(response.body.message).toBe("Family deleted successfully");
    });

    it("should return a 404 status code when the family to delete is not found", async () => {
        const response = await request.delete("/api/family/66");

        expect(response.status).toBe(404);

        expect(response.body.message).toBe("Family not found");
    });
    //TODO: fix it not working
    // it("should return a 500 status code and an error message when an error occurs in the handler", async () => {
    //     const mockReq = {} as Request;
    //     const mockRes = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //     } as unknown as Response;

    //     jest.spyOn(Family, "destroy").mockRejectedValue(new Error("Test error"));

    //     await httpDeleteFamilyHandler(mockReq, mockRes);

    //     expect(mockRes.status).toHaveBeenCalledWith(500);

    //     expect(mockRes.json).toHaveBeenCalledWith({
    //         message: "Internal server error",
    //     });
    // });
});

// TODO: fix if put above some tests will fail
describe.skip("httpGetAllFamiliesHandler", () => {
    it("should return all Families when a valid request is provided", async () => {
        const response = await request.get(`/api/family`);
        expect(response.status).toBe(200);
        expect(response.body.count).toBeDefined();
        expect(response.body.families).toBeDefined();
        expect(Array.isArray(response.body.families)).toBe(true);
        const allFamilies = await Family.findAll();
        expect(response.body.count).toBe(allFamilies.length);
    });
    it("should return an empty response if there is no Families", async () => {
        const response = await request.get(`/api/family`);
        expect(response.status).toBe(200);
        expect(response.body.count).toBeDefined();
        expect(response.body.families).toBeDefined();
        expect(response.body.count).toEqual(0);
    });
    it("should return a 404 status code and an error message when no families are found", async () => {
        await Family.destroy({ where: {} });
        const response = await request.get("/api/families");
        expect(response.status).toBe(404);
    });
    it("should return 500 and an error message when an error occurs in the handler", async () => {
        const mockReq = {} as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        jest.spyOn(Family, "findAll").mockRejectedValue(new Error("Test error"));
        await httpGetAllFamiliesHandler(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to retrieve families",
        });
    });
});
