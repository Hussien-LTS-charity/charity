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

dotenv.config();

const PORT = process.env.PORT || 3000;

async function syncModels() {
  try {
    // Sync other models if available
    await Family.sync({ alter: true });
    await FamilyMember.sync({ alter: true });
    await MemberNeeds.sync({ alter: true });
    await HealthHistory.sync({ alter: true });
    await Donor.sync({ alter: true });
    await Donation.sync({ alter: true });
    await AfterDonations.sync({ alter: true });
    await DonationsRecords.sync({ alter: true });
    console.log("Models are synchronized with the database");
    // Start your server or perform other operations here
    app.listen(PORT, () => {
      console.log(`app is live on ${PORT} `);
    });
  } catch (error) {
    console.error("Unable to synchronize models with the database:", error);
  }
}

syncModels();
