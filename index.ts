import app from "./src/app";
import dotenv from "dotenv";
import Family from "./src/models/Family";
import FamilyMember from "./src/models/FamilyMember";
import MemberNeeds from "./src/models/MemberNeeds";
import HealthHistory from "./src/models/HealthHistory";
// import NeedType from "./src/models/NeedType";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function syncModels() {
  try {
    await Family.sync({ force: true });
    await FamilyMember.sync({ force: true });
    await MemberNeeds.sync({ force: true });
    await HealthHistory.sync({ force: true });

    // Sync other models if available
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
