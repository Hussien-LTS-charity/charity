//TODO: failed successfully
import supertest from "supertest";
import { app } from "../src/app";
import sequelize from "../src/models/sequelize";
import FamilyMember from "../src/models/FamilyMember";
import Family from "../src/models/Family";
import { Request, Response } from "express";
import HealthHistory from "../src/models/HealthHistory";
import {
  httpAddHealthHistoryHandler,
  httpDeleteHealthHistoryHandler,
  httpEditHealthHistoryHandler,
  httpGetAllHealthHistoryHandler,
  httpGetSpecificHealthHistoryHandler,
} from "../src/controllers/healthHistory.controller";

const request = supertest(app);

const mockRequestFamilyBody = {
  id: 1,
  houseCondition: "string",
  notes: "string",
  familyCategory: "Orphans",
  members: [
    {
      id: 1,
      FamilyId: 1,
      firstName: "DDDDD",
      lastName: "DDDDD",
      gender: "Male",
      maritalStatus: "Single",
      address: "DDDDDDDDDDDDDDDDDDD",
      email: "DDDDD@DDsdwDDD.gmail",
      dateOfBirth: "12/12/2022",
      phoneNumber: "3243424322",
      isWorking: true,
      isPersonCharge: false,
      proficient: "dddddddddd",
      totalIncome: 3444,
      educationLevel: "ddddddd",
    },
    {
      id: 2,
      FamilyId: 1,
      firstName: "DDDDD",
      lastName: "DDDDD",
      gender: "Male",
      maritalStatus: "Single",
      address: "DDDDDDDDDDDDDDDDDDD",
      email: "ertgvcf@DDsdwDDD.gmail",
      dateOfBirth: "12/12/2022",
      phoneNumber: "3243424322",
      isWorking: true,
      isPersonCharge: true,
      proficient: "dddddddddd",
      totalIncome: 3444,
      educationLevel: "ddddddd",
    },
  ],
};

const firstMockRequestHealthHistoryBody = {
  disease: {
    diseaseName: "disease Name 1",
    medicineName: "medicine Name 1",
  },
};

const secondMockRequestHealthHistoryBody = {
  disease: {
    diseaseName: "diseaseName2",
    medicineName: "medicineName2",
  },
};

const updatedMockRequestBody = {
  diseaseName: "updated disease Name1",
};

beforeAll(async () => {
  await sequelize.sync();
  await Family.destroy({ where: {} });
  await FamilyMember.destroy({ where: {} });
  await HealthHistory.destroy({ where: {} });
});

afterAll(async () => {
  await Family.destroy({ where: {} });
  await FamilyMember.destroy({ where: {} });
  await HealthHistory.destroy({ where: {} });
  await sequelize.close();
});

describe("httpAddHealthHistoryHandler", () => {
  it("should add a new Health History and return a success response", async () => {
    await request.post("/api/family").send(mockRequestFamilyBody);

    const res = await request
      .post(
        `/api/health-history/${mockRequestFamilyBody.id}/${mockRequestFamilyBody.members[0].id}`
      )
      .send(firstMockRequestHealthHistoryBody);

    expect(res.status).toEqual(201);
    expect(res.body.message).toEqual("Health History added successfully");
    expect(res.body.healthHistory).toBeDefined();
  });

  it("should return 500 and an error message when an error occurs in the handler", async () => {
    const mockReq = {} as unknown as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await httpAddHealthHistoryHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Failed to add Health History",
    });
  });

  it("should return 404 and an error message if the provided family ID is invalid", async () => {
    const res = await request.post(
      `/api/health-history/1245/${mockRequestFamilyBody.members[0].id}`
    );

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual("Failed to retrieve family");
    expect(res.body.healthHistory).toBeUndefined();
  });

  it("should return 404 and an error message if the provided family Member ID is invalid", async () => {
    await Family.destroy({ where: {} });
    await request.post("/api/family").send(mockRequestFamilyBody);

    const res = await request.post(
      `/api/health-history/${mockRequestFamilyBody.id}/1356`
    );

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual("Failed to retrieve family Member");
    expect(res.body.healthHistory).toBeUndefined();
  });
});

describe("httpGetSpecificHealthHistoryHandler", () => {
  it("should return a Health History when a valid family ID and family Member Id are provided", async () => {
    await request.post("/api/family").send(mockRequestFamilyBody);
    // await request
    //   .post(`/api/family-member/${mockRequestFamilyMemberBody.FamilyId}`)
    //   .send(mockRequestFamilyMemberBody);
    await request
      .post(
        `/api/health-history/${mockRequestFamilyBody.id}/${mockRequestFamilyBody.members[0].id}`
      )
      .send(firstMockRequestHealthHistoryBody);

    const response = await request.get(
      `/api/health-history/${mockRequestFamilyBody.id}/${mockRequestFamilyBody.members[0].id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.healthHistory).toBeDefined();
  });

  it("should return 500 and an error message when an error occurs in the handler", async () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await httpGetSpecificHealthHistoryHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Failed to retrieve health history",
    });
  });

  it("should return 404 and an error message if the provided family ID is invalid", async () => {
    const res = await request.get(
      `/api/health-history/1234567/${mockRequestFamilyBody.members[0].id}`
    );

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual("Failed to retrieve family");
    expect(res.body.healthHistory).toBeUndefined();
  });

  it("should return 404 and an error message if the provided family Member ID is invalid", async () => {
    // await Family.destroy({ where: {} });
    // await FamilyMember.destroy({ where: {} });
    // await HealthHistory.destroy({ where: {} });
    await request.post("/api/family").send(mockRequestFamilyBody);
    const res = await request.get(
      `/api/health-history/${mockRequestFamilyBody.id}/9876545`
    );

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual("Failed to retrieve family member");
    expect(res.body.healthHistory).toBeUndefined();
  });
});

describe("httpEditHealthHistoryHandler", () => {
  it("should update the Health History and return a success response", async () => {
    await request.post("/api/family").send(mockRequestFamilyBody);
    // await request
    //   .post(`/api/family-member/${mockRequestFamilyMemberBody.FamilyId}`)
    //   .send(mockRequestFamilyMemberBody);
    const newHealthHistory = await request
      .post(
        `/api/health-history/${mockRequestFamilyBody.id}/${mockRequestFamilyBody.members[0].id}`
      )
      .send(firstMockRequestHealthHistoryBody);

    const response = await request
      .put(
        `/api/health-history/${mockRequestFamilyBody.id}/${mockRequestFamilyBody.members[0].id}/${newHealthHistory.body.healthHistory.id}`
      )
      .send(updatedMockRequestBody);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("health history updated successfully");

    const updatedHealthHistory = await HealthHistory.findOne({
      where: {
        id: newHealthHistory.body.healthHistory.id,
        FamilyId: mockRequestFamilyBody.id,
        familyMemberId: mockRequestFamilyBody.members[0].id,
      },
    });
    if (updatedHealthHistory) {
      expect(updatedHealthHistory.disease.diseaseName).toBe(
        updatedMockRequestBody.diseaseName
      );
      expect(updatedHealthHistory.id).toBe(
        newHealthHistory.body.healthHistory.id
      );
    }
    const updatedFamilyMember = await request.get(
      `/api/family-member/${mockRequestFamilyBody.id}/${mockRequestFamilyBody.members[0].id}`
    );

    if (updatedFamilyMember) {
      expect(updatedFamilyMember.body.familyMember).toBeDefined();
      expect(updatedFamilyMember.body.familyMember.id).toBe(
        mockRequestFamilyBody.members[0].id
      );
      expect(updatedFamilyMember.body.familyMember.FamilyId).toBe(
        mockRequestFamilyBody.id
      );
    }
  });

  it("should return a 404 status code if invalid family ID provided", async () => {
    const response = await request
      .put(`/api/health-history/658/${mockRequestFamilyBody.members[0].id}/123`)
      .send(updatedMockRequestBody);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Failed to retrieve family");
  });

  it("should return a 404 status code if invalid family member ID provided", async () => {
    const response = await request
      .put(`/api/health-history/${mockRequestFamilyBody.id}/11112/76532`)
      .send(updatedMockRequestBody);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Failed to retrieve family member");
  });

  it("should return a 404 status code if invalid member needs ID provided", async () => {
    const response = await request
      .put(
        `/api/health-history/${mockRequestFamilyBody.id}/${mockRequestFamilyBody.members[0].id}/11112`
      )
      .send(updatedMockRequestBody);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "family member health history not found"
    );
  });

  it("should return a 500 status code and an error message when an error occurs in the handler", async () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(HealthHistory, "update")
      .mockRejectedValue(new Error("Test error"));

    await httpEditHealthHistoryHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Failed to edit health history",
    });
  });
});

describe("httpDeleteHealthHistoryHandler", () => {
  it("should delete the Health History and return a success response", async () => {
    await request.post("/api/family").send(mockRequestFamilyBody);

    const newHealthHistory = await request
      .post(
        `/api/health-history/${mockRequestFamilyBody.id}/${mockRequestFamilyBody.members[0].id}`
      )
      .send(firstMockRequestHealthHistoryBody);
    const response = await request.delete(
      `/api/health-history/${mockRequestFamilyBody.id}/${mockRequestFamilyBody.members[0].id}/${newHealthHistory.body.healthHistory.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("health history deleted successfully");

    const deletedFamily = await HealthHistory.findByPk(
      `${newHealthHistory.body.healthHistory.id}`
    );
    expect(deletedFamily).toBeNull();
  });

  it("should return a 404 status code when an invalid family ID, member ID or need ID are provided", async () => {
    await Family.destroy({ where: {} });
    const firstResponse = await request.delete(
      `/api/health-history/12345/${mockRequestFamilyBody.members[0].id}/123456`
    );

    expect(firstResponse.status).toBe(404);
    expect(firstResponse.body.message).toBe("health history not found");

    await FamilyMember.destroy({ where: {} });
    await request.post("/api/family").send(mockRequestFamilyBody);
    const secondResponse = await request.delete(
      `/api/health-history/${mockRequestFamilyBody.id}/12345/2345`
    );

    expect(secondResponse.status).toBe(404);
    expect(secondResponse.body.message).toBe("health history not found");

    await HealthHistory.destroy({ where: {} });
    const thirdResponse = await request.delete(
      `/api/health-history/${mockRequestFamilyBody.id}/${mockRequestFamilyBody.members[0].id}/12345`
    );
    expect(thirdResponse.status).toBe(404);
    expect(thirdResponse.body.message).toBe("health history not found");
  });
  // TODO: FIX IT
  // it("should return a 500 status code and an error message when an error occurs in the handler", async () => {
  //     const mockReq = {
  //         params: { familyId: "123", familyMemberId: "123", memberNeedId: "123" },
  //     } as unknown as Partial<Request>;
  //     const mockRes = {
  //         status: jest.fn().mockReturnThis(),
  //         json: jest.fn(),
  //     } as unknown as Response;

  //     jest.spyOn(HealthHistory, "destroy").mockRejectedValue(new Error("Test error"));

  //     await httpDeleteHealthHistoryHandler(mockReq as Request, mockRes);

  //     expect(mockRes.status).toHaveBeenCalledWith(500);
  //     expect(mockRes.json).toHaveBeenCalledWith({
  //         message: "Internal server error",
  //     });
  // });
});

describe("httpGetAllMembersNeedsHandler", () => {
  it("should return all Member Needs when a valid family ID is provided", async () => {
    await request.post("/api/family").send(mockRequestFamilyBody);

    const requests = [
      await request
        .post(
          `/api/health-history/${mockRequestFamilyBody.id}/${mockRequestFamilyBody.members[0].id}`
        )
        .send(firstMockRequestHealthHistoryBody),
      await request
        .post(
          `/api/health-history/${mockRequestFamilyBody.id}/${mockRequestFamilyBody.members[0].id}`
        )
        .send(secondMockRequestHealthHistoryBody),
    ];
    await Promise.all(requests);

    const response = await request.get(
      `/api/health-history/${mockRequestFamilyBody.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.count).toBeDefined();
    expect(response.body.familyMembersHealthHistory).toBeDefined();
    expect(
      Array.isArray(response.body.familyMembersHealthHistory[0].healthHistory)
    ).toBe(true);
  });

  it("should return 500 and an error message when an error occurs in the handler", async () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await httpGetAllHealthHistoryHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Failed to retrieve health history",
    });
  });

  it("should return 404 and an error message if the provided family ID is invalid", async () => {
    await Family.destroy({ where: {} });
    const res = await request.get(
      `/api/health-history/${mockRequestFamilyBody.id}`
    );

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual("Failed to retrieve family");
    expect(res.body.familyMemberNeeds).toBeUndefined();
  });
});
