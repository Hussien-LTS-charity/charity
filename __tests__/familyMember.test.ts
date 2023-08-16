import supertest from "supertest";
import { app } from "../src/app";
import sequelize from "../src/models/sequelize";
import FamilyMember from "../src/models/FamilyMember";
import Family from "../src/models/Family";
import {
    httpAddFamilyMemberHandler,
    httpEditFamilyMemberHandler,
    httpGetSpecificFamilyMemberHandler,
} from "../src/controllers/familyMember.controller";
import { Request, Response } from "express";

const request = supertest(app);

beforeAll(async () => {
    await sequelize.sync();
    await Family.destroy({ where: {} });
    await FamilyMember.destroy({ where: {} });

});

afterAll(async () => {
    await Family.destroy({ where: {} });
    await FamilyMember.destroy({ where: {} });
    await sequelize.close();
});

describe.skip("httpAddFamilyMemberHandler", () => {
    it("should add a new family Member and return a success response", async () => {
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
            id: 1,
            FamilyId: 1,
            firstName: "firstName",
            lastName: "lastName",
            gender: "male",
            maritalStatus: "Single",
            address: "address",
            email: "test@tesst.com",
            dateOfBirth: "12-02-2000",
            phoneNumber: "0788888888",
            isWorking: true,
            isPersonCharge: false,
            proficient: "proficient",
            totalIncome: 1000,
            educationLevel: 1,
        };

        const res = await request
            .post(`/api/family-member/${mockRequestBody.FamilyId}`)
            .send(mockRequestBody);
        expect(res.status).toEqual(201);
        expect(res.body.message).toEqual("Family Member added successfully");
        expect(res.body.FamilyMember).toBeDefined();
    });

    it("should return 404 and an error message if the provided family ID is invalid", async () => {
        const mockRequestBody = {
            id: 1,
            FamilyId: 22,
            firstName: "firstName",
            lastName: "lastName",
            gender: "male",
            maritalStatus: "Single",
            address: "address",
            email: "test@tesst.com",
            dateOfBirth: "12-02-2000",
            phoneNumber: "0788888888",
            isWorking: true,
            isPersonCharge: false,
            proficient: "proficient",
            totalIncome: 1000,
            educationLevel: 1,
        };

        const res = await request
            .post(`/api/family-member/${mockRequestBody.FamilyId}`)
            .send(mockRequestBody);
        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual("Failed to retrieve Family");
        expect(res.body.FamilyMember).toBeUndefined();
    });

    it("should return 500 and an error message when an error occurs in the handler", async () => {
        const mockReq = {} as unknown as Request;

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await httpAddFamilyMemberHandler(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);

        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to add Family Member",
        });
    });
});

describe.skip("httpGetAllFamiliesMemberHandler", () => {

    it("should return all Families Members when a valid request is provided", async () => {
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

        const firstMockRequestBody = {
            id: 1,
            FamilyId: 1,
            firstName: "firstName",
            lastName: "lastName",
            gender: "male",
            maritalStatus: "Single",
            address: "address",
            email: "test@tesst.com",
            dateOfBirth: "12-02-2000",
            phoneNumber: "0788888888",
            isWorking: true,
            isPersonCharge: false,
            proficient: "proficient",
            totalIncome: 1000,
            educationLevel: 1,
        };

        const secondMockRequestBody = {
            id: 1,
            FamilyId: 1,
            firstName: "firstName",
            lastName: "lastName",
            gender: "male",
            maritalStatus: "Single",
            address: "address",
            email: "test@tesst.com",
            dateOfBirth: "12-02-2000",
            phoneNumber: "0788888888",
            isWorking: true,
            isPersonCharge: false,
            proficient: "proficient",
            totalIncome: 1000,
            educationLevel: 1,
        };

        const requests = [
            request.post(`/api/family-member/${firstMockRequestBody.FamilyId}`).send(firstMockRequestBody),
            request.post(`/api/family-member/${secondMockRequestBody.FamilyId}`).send(secondMockRequestBody),
        ];
        await Promise.all(requests);
        const response = await request.get(`/api/family-member/${firstMockRequestBody.FamilyId}`)
        expect(response.status).toBe(200);
        expect(response.body.count).toBeDefined();
        expect(response.body.familyMembers).toBeDefined();
        expect(Array.isArray(response.body.familyMembers)).toBe(true);
        const allFamilies = await Family.findAll();
        expect(response.body.count).toBe(allFamilies.length);
    });

    it("should return an empty response if there is no Families Members", async () => {
        await FamilyMember.destroy({ where: {} });
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
        };
        await request.post("/api/family").send(testFamily);


        const response = await request.get(`/api/family-member/${testFamily.id}}`);
        expect(response.status).toBe(404);
        expect(response.body.count).toBeDefined();
        expect(response.body.familyMembers).toBeUndefined();
        expect(response.body.count).toEqual(0);
        expect(response.body.message).toBe("There is no family members");
    });

    //TODO: complete it
    // it("should return a 404 status code and an error message when no families are found", async () => {
    //     await Family.destroy({ where: {} });
    //     const response = await request.get("/api/families");
    //     expect(response.status).toBe(404);
    // });

    // it("should return 500 and an error message when an error occurs in the handler", async () => {
    //     const mockReq = {} as Request;
    //     const mockRes = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //     } as unknown as Response;
    //     jest.spyOn(Family, "findAll").mockRejectedValue(new Error("Test error"));
    //     await httpGetAllFamiliesHandler(mockReq, mockRes);
    //     expect(mockRes.status).toHaveBeenCalledWith(500);
    //     expect(mockRes.json).toHaveBeenCalledWith({
    //         message: "Failed to retrieve families",
    //     });
    // });
});


describe.skip("httpGetFamilyMemberHandler", () => {
    it("should return a family members when a valid family ID and family Member Id are provided", async () => {
        const mockRequestBody = {
            id: 1,
            FamilyId: 1,
            firstName: "firstName",
            lastName: "lastName",
            gender: "male",
            maritalStatus: "Single",
            address: "address",
            email: "test@tesst.com",
            dateOfBirth: "12-02-2000",
            phoneNumber: "0788888888",
            isWorking: true,
            isPersonCharge: false,
            proficient: "proficient",
            totalIncome: 1000,
            educationLevel: 1,
        };

        await request
            .post(`/api/family-member/${mockRequestBody.FamilyId}`)
            .send(mockRequestBody);

        const testFamilyId = mockRequestBody.id;

        const response = await request.get(`/api/family-member/${testFamilyId}`);

        expect(response.status).toBe(200);

        expect(response.body.familyMembers).toBeDefined();
    });

    it("should return 404 when an invalid family ID is provided", async () => {
        const response = await request.get("/api/family-member/22/33");

        expect(response.status).toBe(404);

        expect(response.body.message).toBe("family member not found");
    });

    it("should return 500 and an error message when an error occurs in the handler", async () => {
        const mockReq = {} as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await httpGetSpecificFamilyMemberHandler(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);

        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to retrieve family member",
        });
    });
});

describe.skip("httpEditFamilyMemberHandler", () => {
    it("should update the family member and return a success response", async () => {
        const testFamilyMember = {
            id: 1,
            FamilyId: 1,
            firstName: "firstName",
            lastName: "lastName",
            gender: "male",
            maritalStatus: "Single",
            address: "address",
            email: "test@tesst.com",
            dateOfBirth: "12-02-2000",
            phoneNumber: "0788888888",
            isWorking: true,
            isPersonCharge: false,
            proficient: "proficient",
            totalIncome: 1000,
            educationLevel: 1,
        };

        await request.post(`/api/family-member/${testFamilyMember.id}`).send(testFamilyMember);
        const mockRequestBody = {
            address: "updated address",
        };
        const response = await request
            .put(`/api/family-member/${testFamilyMember.FamilyId}/${testFamilyMember.id}`)
            .send(mockRequestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Family member updated successfully");
        expect(response.body.familyMember).toBeDefined();
        const updatedFamily = await FamilyMember.findOne({
            where: {
                id: testFamilyMember.id,
                FamilyId: testFamilyMember.FamilyId
            }
        });
        if (updatedFamily) {
            expect(response.body.familyMember).toBeDefined();
            expect(updatedFamily.id).toBe(testFamilyMember.id);
            expect(updatedFamily.address).toBe(mockRequestBody.address);
        }
    });

    it("should return a 404 status code when the family member to update is not found", async () => {

        const testFamilyMember = {
            id: 1,
            FamilyId: 1,
            firstName: "firstName",
            lastName: "lastName",
            gender: "male",
            maritalStatus: "Single",
            address: "address",
            email: "test@tesst.com",
            dateOfBirth: "12-02-2000",
            phoneNumber: "0788888888",
            isWorking: true,
            isPersonCharge: false,
            proficient: "proficient",
            totalIncome: 1000,
            educationLevel: 1,
        };
        const mockRequestBody = {
            address: "updated address",
        };

        const response = await request
            .put(`/api/family-member/${testFamilyMember.FamilyId}/22`)
            .send(mockRequestBody);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Family member not found");
        const updatedFamily = await FamilyMember.findOne({
            where: {
                id: testFamilyMember.id,
                FamilyId: testFamilyMember.FamilyId
            }
        });
        if (updatedFamily) {
            expect(response.body.familyMember).toBeUndefined();
        }
    });

    it("should return a 500 status code and an error message when an error occurs in the handler", async () => {
        const mockReq = {} as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        jest.spyOn(Family, "update").mockRejectedValue(new Error("Test error"));

        await httpEditFamilyMemberHandler(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);

        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to edit family member",
        });
    });
});
