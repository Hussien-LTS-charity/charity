import { Request, Response } from "express";
import { httpAddFamilyHandler } from "../src/controllers/family.controller";
import { jest } from "@jest/globals";

describe("httpAddFamilyHandler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  function generateRandomEmail() {
    const randomString = Math.random().toString(36).substring(7); // Generate a random string
    const domain = "example.com"; // Use your desired domain name

    return `${randomString}@${domain}`;
  }
  function generateRandomNumberId() {
    const min = 1000; // Specify the minimum value for the random ID
    const max = 9999; // Specify the maximum value for the random ID

    const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomId;
  }

  const currentDate = Date();

  // Format the date
  const formattedDate = currentDate.toString();

  const randomId = generateRandomNumberId();
  const randomEmail = generateRandomEmail();
  beforeEach(() => {
    req = {
      body: {
        id: randomId,
        personCharge: 1,
        familyPriority: 1,
        email: randomEmail,
        address: "123 Main St",
        contactNumber: "1234567890",
        houseCondition: "Good",
        notes: "Some notes",
        familyCategory: "orphans",
        createdAt: formattedDate,
        updatedAt: formattedDate,
        members: [],
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response<any, Record<string, any>>;
  });

  it("should add a new family successfully", async () => {
    await httpAddFamilyHandler(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      family: expect.objectContaining({
        family: {
          id: randomId,
          personCharge: 1,
          familyPriority: 1,
          email: randomEmail,
          address: "123 Main St",
          contactNumber: "1234567890",
          houseCondition: "Good",
          notes: "Some notes",
          familyCategory: "orphans",
          createdAt: formattedDate,
          updatedAt: formattedDate,
        },
        message: "Family added successfully",
      }),
    });
  });

  // it("should handle errors when adding a family", async () => {
  //   const error = new Error("Database connection failed");
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   jest.spyOn(console, "error").mockImplementationOnce(() => {});
  //   // Mock the req.body property
  //   req.body = {};
  //   await httpAddFamilyHandler(req as Request, res as Response);
  //   expect(console.error).toHaveBeenCalledWith("Error adding family:", error);
  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.json).toHaveBeenCalledWith({ message: "Failed to add family" });
  // });
});
