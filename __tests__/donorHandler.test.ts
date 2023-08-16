import { Request, Response } from "express";
import supertest from "supertest";
import { app } from "../src/app";
import sequelize from "../src/models/sequelize";
// import Family from "../src/models/Family";
import { httpAddDonorHandler, httpEditDonorHandler, httpGetAllDonorsHandler, httpGetDonorHandler } from "../src/controllers/donor.controller";
import Donor from "../src/models/Donor";

const request = supertest(app);
const mockRequestBody = {
    id: 1,
    idCopy: "idCopy",
    nationalNumber: 123456,
    firstName: "firstName",
    lastName: "lastName",
    gender: "male",
    email: "test@test.com",
    bankAccountNumber: 1234567,
    address: "address",
    phoneNumber: "1234567890",
    dateOfBirth: "12-02-2000",
    donorCategory: "Committed",
};
beforeAll(async () => {
    await sequelize.sync();
    await Donor.destroy({ where: {} });
});

beforeEach(async () => {
    await Donor.destroy({ where: {} });
});

afterEach(async () => {
    await Donor.destroy({ where: {} });
});

describe("httpAddDonorHandler", () => {
    it("should add a new donor and return a success response", async () => {
        const response = await request.post("/api/donor").send(mockRequestBody);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Donor added successfully");
        expect(response.body.Donor).toBeDefined();
    });

    it("should return 500 and an error message when an error occurs in the handler", async () => {
        const mockReq = {
            // body: {},
        } as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await httpAddDonorHandler(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to add Donor",
        });
    });
});

describe("httpGetDonorHandler", () => {
    it("should return a Donor when a valid donor ID is provided", async () => {

        await request.post("/api/donor").send(mockRequestBody);

        const testDonorId = mockRequestBody.id;

        const response = await request.get(`/api/donor/${testDonorId}`);

        expect(response.status).toBe(200);
        expect(response.body.donor).toBeDefined();
    });

    it("should return 404 when an invalid donor ID is provided", async () => {
        const response = await request.get("/api/donor/22");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Donor not found");
    });

    it("should return 500 and an error message when an error occurs in the handler", async () => {
        const mockReq = {} as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await httpGetDonorHandler(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);

        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to retrieve Donor",
        });
    });
});

describe("httpGetAllDonorsHandler", () => {
    it("should return all Donors when a valid request is provided", async () => {
        const response = await request.get(`/api/donor`);
        expect(response.status).toBe(200);
        expect(response.body.count).toBeDefined();
        expect(response.body.donors).toBeDefined();
        expect(Array.isArray(response.body.donors)).toBe(true);
        const allDonors = await Donor.findAll();
        expect(response.body.count).toBe(allDonors.length);
    });

    it("should return an empty response if there is no Donors", async () => {
        const response = await request.get(`/api/donor`);
        expect(response.status).toBe(200);
        expect(response.body.count).toBeDefined();
        expect(response.body.donors).toBeDefined();
        expect(response.body.count).toEqual(0);
    });


    it("should return 500 and an error message when an error occurs in the handler", async () => {
        const mockReq = {} as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        jest.spyOn(Donor, "findAll").mockRejectedValue(new Error("Test error"));
        await httpGetAllDonorsHandler(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to retrieve Donors",
        });
    });
});

describe("httpEditFamilyHandler", () => {
    it("should update the donor and return a success response", async () => {

        await request.post("/api/donor").send(mockRequestBody);

        const updatedMockRequestBody = {
            address: "updated address",
        };

        console.log("===============", mockRequestBody.id);
        const response = await request
            .put(`/api/donor/1`)
            .send(updatedMockRequestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Donor updated successfully");
        // const parseDDonorId = parseInt(mockRequestBody.id, 10)
        const updatedDonor = await Donor.findByPk(mockRequestBody.id);
        if (updatedDonor) {
            expect(response.body.family).toBeDefined();
            expect(updatedDonor.id).toBe(mockRequestBody.id);
            expect(updatedDonor.address).toBe(updatedMockRequestBody.address);
        }
    });

    it("should return a 404 status code when the family to update is not found", async () => {
        await request.post("/api/donor").send(mockRequestBody);
        const updatedMockRequestBody = {
            address: "updated address",
        };

        const response = await request
            .put(`/api/donor/44`)
            .send(updatedMockRequestBody);

        expect(response.status).toBe(404);

        expect(response.body.message).toBe("Donor not found");
    });

    it("should return a 500 status code and an error message when an error occurs in the handler", async () => {
        const mockReq = {} as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;


        jest.spyOn(Donor, "update").mockRejectedValue(new Error("Test error"));

        await httpEditDonorHandler(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);

        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to edit Donor",
        });
    });
});

// describe("httpDeleteFamilyHandler", () => {
//     it("should delete the family and return a success response", async () => {
//         const testFamily = {
//             id: 1,
//             personCharge: 1,
//             familyPriority: 1,
//             email: "test3@tesst.com",
//             address: "string",
//             contactNumber: "07888888488",
//             houseCondition: "string",
//             notes: "string",
//             familyCategory: "orphans",
//             members: [],
//         };
//         await request.post("/api/family").send(testFamily);
//         const testFamilyId = testFamily.id;

//         const response = await request.delete(`/api/family/${testFamilyId}`);

//         expect(response.status).toBe(200);

//         expect(response.body.message).toBe("Family deleted successfully");

//         const deletedFamily = await Family.findByPk(testFamilyId);
//         expect(deletedFamily).toBeNull();
//         expect(response.body.message).toBe("Family deleted successfully");
//     });

//     it("should return a 404 status code when the family to delete is not found", async () => {
//         const response = await request.delete("/api/family/66");

//         expect(response.status).toBe(404);

//         expect(response.body.message).toBe("Family not found");
//     });
//     //TODO: fix it not working
//     // it("should return a 500 status code and an error message when an error occurs in the handler", async () => {
//     //     const mockReq = {} as Request;
//     //     const mockRes = {
//     //         status: jest.fn().mockReturnThis(),
//     //         json: jest.fn(),
//     //     } as unknown as Response;

//     //     jest.spyOn(Family, "destroy").mockRejectedValue(new Error("Test error"));

//     //     await httpDeleteFamilyHandler(mockReq, mockRes);

//     //     expect(mockRes.status).toHaveBeenCalledWith(500);

//     //     expect(mockRes.json).toHaveBeenCalledWith({
//     //         message: "Internal server error",
//     //     });
//     // });
// });


