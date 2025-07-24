import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import awardRoutes from "./routes/awards";
import adminRoutes from "./routes/adminRoutes";
import sponsorRoutes from "./routes/sponsorRoutes";
import participantRoutes from "./routes/participantRoutes";
import path from "path";
import { createServer } from "http";
import { setupSocket } from "./config/socket";
import cookieParser from "cookie-parser";
import rsvpRoutes from "./routes/rsvpRoutes";
import { startReminderScheduler } from "./services/schedularService";
import ejs from "ejs";
import fs from "fs";
import { generatePDFWithPDFShift } from "./utils/pdfShift";
import directoryRoutes from "./routes/directoryRoutes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
const io = setupSocket(httpServer);

// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production'
//     ? ["http://award.delhicombatacademy.com/"] // Replace with your actual frontend domain
//     : ['http://localhost:5173'],
//   credentials: true,
// };

const corsOptions = {
  origin: ["https://ibiea.com", "http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/awards", awardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.use("/api/directory", directoryRoutes);

// Basic health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/template-preview", async (req, res) => {
  const templatePath = path.join(__dirname, "./templates/booking-template.ejs");
  const html = await ejs.renderFile(templatePath, { data: req.body });
  res.send(html);
})

app.post("/api/generate-booking-pdf", async (req, res) => {
  try {
    const bookingData = req.body;

    const templatePath = path.join(__dirname, "./templates/booking-template.ejs");

    // Get absolute paths for images
    const publicPath = path.join(__dirname, "../public");
    const ibieaLogoPath = path.join(publicPath, "assets/ibiea-logo.jpg");
    const traveonLogoPath = path.join(publicPath, "assets/traveon.png");
    const signPath = path.join(publicPath, "assets/sign.png");

    // Convert images to base64
    const ibieaLogoBase64 = fs.readFileSync(ibieaLogoPath, { encoding: 'base64' });
    const traveonLogoBase64 = fs.readFileSync(traveonLogoPath, { encoding: 'base64' });
    const signBase64 = fs.readFileSync(signPath, { encoding: 'base64' });

    const templateData = {
      ...bookingData,
      images: {
        ibieaLogo: `data:image/jpeg;base64,${ibieaLogoBase64}`,
        traveonLogo: `data:image/png;base64,${traveonLogoBase64}`,
        sign: `data:image/png;base64,${signBase64}`
      }
    };

    const html = await ejs.renderFile(templatePath, { data: templateData });

    const pdfBuffer = await generatePDFWithPDFShift({source:html});

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=booking.pdf",
      "Content-Length": pdfBuffer.length,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    });
    res.send(pdfBuffer);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to generate PDF", details: err.message });
  }
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err : {},
    });
  }
);

// Start reminder scheduler
// startReminderScheduler();

export { io };

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
