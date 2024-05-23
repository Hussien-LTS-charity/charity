// process.env.NODE_ENV = "test";

import { Request, Response } from "express";
import supertest from "supertest";
import { app } from "../src/app";
import sequelize from "../src/models/sequelize";
import {
  httpAddDonationHandler,
  httpGetDonationHandler,
  httpGetAllDonationsHandler,
  httpEditDonationHandler,
  httpDeleteDonationHandler,
} from "../src/controllers/donation.controller";
import Donation from "../src/models/Donation";

const request = supertest(app);

const donationMockRequestBody = {
  id: 1,
  DonorId: 1,
  donationDate: "12-02-2000",
  donationTook: {
    isMony: true,
    mony: {
      monyDonationsSource: "Bank",
      monyAmount: 23775,
    },
  },
  Properties: "",
};
const donorMockRequestBody = {
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
  donationDate: "2000-12-02",
};

beforeAll(async () => {
  await sequelize.sync();
  await Donation.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});

describe("httpAddDonationHandler", () => {
  it("should add a new Donation and return a success response", async () => {
    await request.post("/api/donor").send(donorMockRequestBody);
    const response = await request
      .post("/api/donation")
      .send(donationMockRequestBody);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Donation Added Successfully");
    expect(response.body.Donation).toBeDefined();
  });

  it("should return 500 and an error message when an error occurs in the handler", async () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await httpAddDonationHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Failed To Add Donation",
    });
  });
});

describe("httpGetDonationHandler", () => {
  it("should return a Donation when a valid donation ID is provided", async () => {
    await request.post("/api/donor").send(donorMockRequestBody);
    await request.post("/api/donation").send(donationMockRequestBody);

    const testDonationId = donationMockRequestBody.id;
    const response = await request.get(`/api/donation/${testDonationId}`);

    expect(response.status).toBe(200);
    expect(response.body.donation).toBeDefined();
  });

  it("should return 404 when an invalid donor ID is provided", async () => {
    const response = await request.get("/api/donation/22");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Donation Not Fund");
  });

  it("should return 500 and an error message when an error occurs in the handler", async () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await httpGetDonationHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);

    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Failed To Retrieve Donation",
    });
  });
});

describe("httpEditDonationHandler", () => {
  it("should update the Donation and return a success response", async () => {
    await request.post("/api/donor").send(donorMockRequestBody);

    const response = await request
      .put(`/api/donation/1`)
      .send(updatedMockRequestBody);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Donation Updated Successfully");
    const updatedDonation = await Donation.findByPk(donationMockRequestBody.id);
    if (updatedDonation) {
      expect(response.body.Donation).toBeDefined();
      expect(updatedDonation.id).toBe(donationMockRequestBody.id);
      expect(updatedDonation.donationDate).toBe(
        updatedMockRequestBody.donationDate
      );
    }
  });

  it("should return a 404 status code when the Donation to update is not found", async () => {
    await request.post("/api/donation").send(donationMockRequestBody);

    const response = await request
      .put(`/api/donation/44`)
      .send(updatedMockRequestBody);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Donation Not Found");
  });

  it("should return a 500 status code and an error message when an error occurs in the handler", async () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(Donation, "update").mockRejectedValue(new Error("Test error"));

    await httpEditDonationHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Failed To Edit Donation",
    });
  });
});

describe("httpDeleteDonationHandler", () => {
  it("should delete the Donation and return a success response", async () => {
    await request.post("/api/donor").send(donorMockRequestBody);
    await request.post("/api/donation").send(donationMockRequestBody);
    const testDonationId = donationMockRequestBody.id;

    const response = await request.delete(`/api/donation/${testDonationId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Donation Deleted Successfully");

    const deletedFamily = await Donation.findByPk(testDonationId);
    expect(deletedFamily).toBeNull();
    expect(response.body.message).toBe("Donation Deleted Successfully");
  });

  it("should return a 404 status code when the Donation to delete is not found", async () => {
    const response = await request.delete("/api/donation/66");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Donation Not Found");
  });

  it("should return a 500 status code and an error message when an error occurs in the handler", async () => {
    const mockReq = {
      params: { donorId: "123" },
    } as unknown as Partial<Request>;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(Donation, "destroy").mockRejectedValue(new Error("Test error"));

    await httpDeleteDonationHandler(mockReq as Request, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});

describe("httpGetAllDonationsHandler", () => {
  it("should return all Donations when a valid request is provided", async () => {
    const response = await request.get(`/api/donation`);

    expect(response.status).toBe(200);
    expect(response.body.count).toBeDefined();
    expect(response.body.donations).toBeDefined();
    expect(Array.isArray(response.body.donations)).toBe(true);

    const allDonation = await Donation.findAll();
    expect(response.body.count).toBe(allDonation.length);
  });

  it("should return an empty response if there is no Donations", async () => {
    const response = await request.get(`/api/donation`);

    expect(response.status).toBe(200);
    expect(response.body.count).toBeDefined();
    expect(response.body.donations).toBeDefined();
    expect(response.body.count).toEqual(0);
  });

  it("should return 500 and an error message when an error occurs in the handler", async () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(Donation, "findAll").mockRejectedValue(new Error("Test error"));

    await httpGetAllDonationsHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Failed To Retrieve Donations",
    });
  });
});
