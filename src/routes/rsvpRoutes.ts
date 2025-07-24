import express from "express";
import {
  createRSVP,
  updateRSVP,
  getAllRSVPs,
  getRSVPsByStatus,
  deleteRSVP,
} from "../controllers/rsvpController";

const router = express.Router();

// RSVP routes
router.post("/", createRSVP);
router.put("/:id", updateRSVP);
router.get("/", getAllRSVPs);
router.get("/status/:status", getRSVPsByStatus);
router.delete("/:id", deleteRSVP);

export default router;