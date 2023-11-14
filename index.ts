import dotenv from "dotenv";
import Family from "./src/models/Family";
import FamilyMember from "./src/models/FamilyMember";
import MemberNeeds from "./src/models/MemberNeeds";
import HealthHistory from "./src/models/HealthHistory";
import Donor from "./src/models/Donor";
import Donation from "./src/models/Donation";
import AfterDonations from "./src/models/AfterDonations";
import DonationsRecords from "./src/models/DonationsRecords";
import { app } from "./src/app";
import sequelize from "./src/models/sequelize";

dotenv.config();

const PORT = process.env.PORT || 3033;

async function syncModels() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Models are synchronized with the database");
    app.listen(PORT, () => {
      console.log(`app is live on ${PORT} `);
    });
  } catch (error) {
    console.log("Unable to synchronize models with the database:", error);
  }
}

syncModels();
