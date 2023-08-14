import supertest from "supertest";
import { app } from "../src/app";
import sequelize from "../src/models/sequelize";
import FamilyMember from "../src/models/FamilyMember";
import Family from "../src/models/Family";
import { httpAddFamilyMemberHandler } from "../src/controllers/familyMember.controller";
import { Request, Response } from 'express';

const request = supertest(app)

beforeAll(async () => {
    await sequelize.sync();
    await Family.destroy({ where: {} })
    await FamilyMember.destroy({ where: {} })
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
})

afterAll(async () => {
    await Family.destroy({ where: {} })
    await FamilyMember.destroy({ where: {} })
    await sequelize.close()
})



describe.skip("httpAddFamilyMemberHandler", () => {
    it("should add a new family and return a success response", async () => {

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
        }

        const res = await request.
            post(`/api/family-member/${mockRequestBody.FamilyId}`).send(mockRequestBody);
        expect(res.status).toEqual(201)
        expect(res.body.message).toEqual("Family Member added successfully")
        expect(res.body.FamilyMember).toBeDefined()
    })

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
        }

        const res = await request.
            post(`/api/family-member/${mockRequestBody.FamilyId}`).send(mockRequestBody);
        expect(res.status).toEqual(404)
        expect(res.body.message).toEqual("Failed to retrieve Family")
        expect(res.body.FamilyMember).toBeUndefined()
    })

    it("should return 500 and an error message when an error occurs in the handler", async () => {
        const mockReq = ({
        } as unknown) as Request;

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

})
