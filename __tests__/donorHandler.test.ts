import { Request, Response } from "express";
import supertest from "supertest";
import { app } from "../src/app";
import sequelize from "../src/models/sequelize";
import {
  httpAddDonorHandler,
  httpDeleteDonorHandler,
  httpEditDonorHandler,
  httpGetAllDonorsHandler,
  httpGetDonorHandler,
} from "../src/controllers/donor.controller";
import Donor from "../src/models/Donor";

const request = supertest(app);

const mockRequestBody = {
  id: 1,
  idCopy: "idCopy",
  nationalNumber: 123456,
  firstName: "firstName",
  lastName: "lastName",
  gender: "Male",
  email: "test@test.com",
  bankAccountNumber: 1234567,
  address: "address",
  phoneNumber: "1234567890",
  dateOfBirth: "12-02-2000",
  donorCategory: "Committed",
};

const updatedMockRequestBody = {
  address: "updated address",
};

beforeAll(async () => {
  await sequelize.sync();
  await Donor.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});

describe("httpAddDonorHandler", () => {
  it("should add a new donor and return a success response", async () => {
    const response = await request.post("/api/donor").send(mockRequestBody);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Donor added successfully");
    expect(response.body.Donor).toBeDefined();
  });

  it("should return 500 and an error message when an error occurs in the handler", async () => {
    const mockReq = {} as Request;
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

describe("httpEditDonorHandler", () => {
  it("should update the donor and return a success response", async () => {
    await request.post("/api/donor").send(mockRequestBody);

    const response = await request
      .put(`/api/donor/1`)
      .send(updatedMockRequestBody);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Donor updated successfully");
    const updatedDonor = await Donor.findByPk(mockRequestBody.id);
    if (updatedDonor) {
      expect(response.body.donor).toBeDefined();
      expect(updatedDonor.id).toBe(mockRequestBody.id);
      expect(updatedDonor.address).toBe(updatedMockRequestBody.address);
    }
  });

  it("should return a 200 status code when the family to update is not found", async () => {
    await request.post("/api/donor").send(mockRequestBody);

    const response = await request
      .put(`/api/donor/44`)
      .send(updatedMockRequestBody);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("There are No Records Were Updated");
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

describe("httpDeleteDonorHandler", () => {
  it("should delete the Donor and return a success response", async () => {
    await request.post("/api/donor").send(mockRequestBody);
    const testDonorId = mockRequestBody.id;

    const response = await request.delete(`/api/donor/${testDonorId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Donor deleted successfully");

    const deletedFamily = await Donor.findByPk(testDonorId);
    expect(deletedFamily).toBeNull();
    expect(response.body.message).toBe("Donor deleted successfully");
  });

  it("should return a 404 status code when the donor to delete is not found", async () => {
    const response = await request.delete("/api/donor/66");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Donor not found");
  });

  it("should return a 500 status code and an error message when an error occurs in the handler", async () => {
    const mockReq = {
      params: { donorId: "123" },
    } as unknown as Partial<Request>;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(Donor, "destroy").mockRejectedValue(new Error("Test error"));

    await httpDeleteDonorHandler(mockReq as Request, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal server error",
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
