import supertest from "supertest";
import { app } from "../src/app";
import sequelize from "../src/models/sequelize";
import FamilyMember from "../src/models/FamilyMember";
import Family from "../src/models/Family";
import { Request, Response } from 'express';
import { httpAddMemberNeedsHandler, httpGetSpecificMemberNeedsHandler } from "../src/controllers/memberNeeds.controller";

const request = supertest(app)
const familyMember = {
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

beforeAll(async () => {
    await sequelize.sync();
    await Family.destroy({ where: {} })
    await FamilyMember.destroy({ where: {} })


})

afterAll(async () => {
    await Family.destroy({ where: {} })
    await FamilyMember.destroy({ where: {} })
    await sequelize.close()
})


describe.skip("httpAddMemberNeedsHandler", () => {
    it("should add a new Member Needs and return a success response", async () => {
        await request.post("/api/family").send(testFamily);
        await request
            .post(`/api/family-member/${familyMember.FamilyId}`)
            .send(familyMember);

        const mockRequestBody = {
            id: 1,
            needName: "needName",
            MemberPriority: 1
        }

        const res = await request.
            post(`/api/member-needs/${familyMember.FamilyId}/${familyMember.id}`)
            .send(mockRequestBody);
        expect(res.status).toEqual(201)
        expect(res.body.message).toEqual("Member Need added successfully")
        expect(res.body.memberNeeds).toBeDefined()
    })

    it("should return 500 and an error message when an error occurs in the handler", async () => {
        const mockReq = ({
        } as unknown) as Request;

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await httpAddMemberNeedsHandler(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);

        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to add Member Needs",

        });
    });

    it("should return 404 and an error message if the provided family ID is invalid", async () => {
        await Family.destroy({ where: {} })

        const res = await request.
            post(`/api/member-needs/${familyMember.FamilyId}/${familyMember.id}`);
        expect(res.status).toEqual(404)
        expect(res.body.message).toEqual("Failed to retrieve Family")
        expect(res.body.FamilyMember).toBeUndefined()
    })

    it("should return 404 and an error message if the provided family Member ID is invalid", async () => {
        await Family.destroy({ where: {} })
        await request.post("/api/family").send(testFamily);
        const res = await request.
            post(`/api/member-needs/${familyMember.FamilyId}/${familyMember.id}`);
        expect(res.status).toEqual(404)
        expect(res.body.message).toEqual("Failed to retrieve family Member")
        expect(res.body.FamilyMember).toBeUndefined()
    })
})


describe.skip("httpGetSpecificMemberNeedsHandler", () => {

    it("should return a Member Needs when a valid family ID and family Member Id are provided", async () => {
        await request.post("/api/family").send(testFamily);
        await request
            .post(`/api/family-member/${familyMember.FamilyId}`)
            .send(familyMember);

        const mockRequestBody = {
            id: 1,
            needName: "needName",
            MemberPriority: 1
        }

        await request.
            post(`/api/member-needs/${familyMember.FamilyId}/${familyMember.id}`)
            .send(mockRequestBody);

        const response = await request
            .get(`/api/member-needs/${familyMember.FamilyId}/${familyMember.id}`);

        expect(response.status).toBe(200);
        expect(response.body.memberNeeds).toBeDefined();
    });

    it("should return 500 and an error message when an error occurs in the handler", async () => {
        const mockReq = {} as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await httpGetSpecificMemberNeedsHandler(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);

        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to retrieve member Needs",
        });
    });

    it("should return 404 and an error message if the provided family ID is invalid", async () => {
        await Family.destroy({ where: {} })

        const res = await request.
            post(`/api/member-needs/${familyMember.FamilyId}/${familyMember.id}`);
        expect(res.status).toEqual(404)
        expect(res.body.message).toEqual("Failed to retrieve Family")
        expect(res.body.FamilyMember).toBeUndefined()
    })

    it("should return 404 and an error message if the provided family Member ID is invalid", async () => {
        await FamilyMember.destroy({ where: {} })
        await request.post("/api/family").send(testFamily);
        const res = await request.
            post(`/api/member-needs/${familyMember.FamilyId}/${familyMember.id}`);
        expect(res.status).toEqual(404)
        expect(res.body.message).toEqual("Failed to retrieve family Member")
        expect(res.body.FamilyMember).toBeUndefined()
    })
});


describe.skip("httpGetAllMembersNeedsHandler", () => {

    it("should return all Member Needs when a valid family ID is provided", async () => {
        await request.post("/api/family").send(testFamily);
        await request
            .post(`/api/family-member/${familyMember.FamilyId}`)
            .send(familyMember);

        const mockRequestBodyOne = {
            id: 1,
            needName: "needName",
            MemberPriority: 1
        }

        const mockRequestBodyTwo = {
            id: 2,
            needName: "needName2",
            MemberPriority: 2
        }

        const requests = [
            await request
                .post(`/api/member-needs/${familyMember.FamilyId}/${familyMember.id}`)
                .send(mockRequestBodyOne),
            await request
                .post(`/api/member-needs/${familyMember.FamilyId}/${familyMember.id}`)
                .send(mockRequestBodyTwo),
        ];
        await Promise.all(requests);

        const response = await request
            .get(`/api/member-needs/${familyMember.FamilyId}`);

        expect(response.status).toBe(200);
        expect(response.body.count).toBeDefined();
        expect(response.body.familyMembersNeeds).toBeDefined();
        expect(Array.isArray(response.body.familyMembersNeeds)).toBe(true);
        // const allFamilies = await Family.findAll();
        expect(response.body.count).toBe(response.body.familyMembersNeeds.length);
    });

    it("should return 500 and an error message when an error occurs in the handler", async () => {
        const mockReq = {} as Request;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await httpGetSpecificMemberNeedsHandler(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);

        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to retrieve member Needs",
        });
    });

    it("should return 404 and an error message if the provided family ID is invalid", async () => {
        await Family.destroy({ where: {} })

        const res = await request.
            post(`/api/member-needs/${familyMember.FamilyId}/${familyMember.id}`);
        expect(res.status).toEqual(404)
        expect(res.body.message).toEqual("Failed to retrieve Family")
        expect(res.body.FamilyMember).toBeUndefined()
    })

    it("should return 404 and an error message if the provided family Member ID is invalid", async () => {
        await FamilyMember.destroy({ where: {} })
        await request.post("/api/family").send(testFamily);
        const res = await request.
            post(`/api/member-needs/${familyMember.FamilyId}/${familyMember.id}`);
        expect(res.status).toEqual(404)
        expect(res.body.message).toEqual("Failed to retrieve family Member")
        expect(res.body.FamilyMember).toBeUndefined()
    })
});

