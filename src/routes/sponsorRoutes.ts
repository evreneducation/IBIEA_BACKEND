import express from "express";
import {
  createSponsorApplication,
  getApprovedSponsors,
  getAllSponsors,
} from "../controllers/sponsorController";

const router = express.Router();

router.post("/", createSponsorApplication);
router.get("/", getApprovedSponsors);
router.get("/all", getAllSponsors);

export default router;
