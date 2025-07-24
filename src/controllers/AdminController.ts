import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenUtils";

const prisma = new PrismaClient();

export class AdminController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const admin = await prisma.admin.findUnique({
        where: { email },
      });

      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, admin.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // const token = jwt.sign(
      //   { adminId: admin.id },
      //   process.env.ADMIN_JWT_SECRET!,
      //   { expiresIn: '24h' }
      // );

      // res.json({ token });

      // Generate Tokens
      const accessToken = generateAccessToken({ adminId: admin.id });
      const refreshToken = generateRefreshToken({ adminId: admin.id });

      await prisma.adminSession.create({
        data: {
          adminId: admin.id,
          refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as 'none',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    };

    const refreshCookieOptions = {
      ...cookieOptions,
      path: '/api/admin/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

      res.json({ success: true, adminId: admin.id });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async getAllNominations(req: Request, res: Response) {
    try {
      const nominations = await prisma.nomination.findMany({
        select: {
          id: true,
          fullName: true,
          designation: true,
          organization: true,
          industry: true,
          country: true,
          email: true,
          phone: true,
          category: true,
          achievements: true,
          contributions: true,
          awards: true,
          supportingDocs: true,
          createdAt: true,
        },
      });

      res.json(nominations);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async deleteNomination(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.nomination.delete({
        where: { id: parseInt(id) },
      });

      res.json({ message: "Nomination deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async getNominationById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const nomination = await prisma.nomination.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          fullName: true,
          designation: true,
          organization: true,
          industry: true,
          country: true,
          email: true,
          phone: true,
          category: true,
          achievements: true,
          contributions: true,
          awards: true,
          supportingDocs: true,
          createdAt: true,
        },
      });

      if (!nomination) {
        return res.status(404).json({ error: "Nomination not found" });
      }

      res.json(nomination);
    } catch (error) {
      console.error("Error fetching nomination:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  async updateNomination(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        fullName,
        designation,
        organization,
        industry,
        country,
        email,
        phone,
        category,
        achievements,
        contributions,
        awards,
      } = req.body;

      const updatedNomination = await prisma.nomination.update({
        where: { id: parseInt(id) },
        data: {
          fullName,
          designation,
          organization,
          industry,
          country,
          email,
          phone,
          category,
          achievements,
          contributions,
          awards: awards || null,
        },
      });

      res.json(updatedNomination);
    } catch (error) {
      console.error("Error updating nomination:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token not found" });
      }

      const payload = verifyRefreshToken(refreshToken);

      const session = await prisma.adminSession.findUnique({
        where: {
          adminId: payload.adminId,
          refreshToken,
          expiresAt: { gt: new Date() },
        },
      });

      if (!session) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      const newAccessToken = generateAccessToken({ adminId: payload.adminId });

      const isProduction = process.env.NODE_ENV === "production";

      // Set the new access token as a cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as 'none',
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      });

      res.json({ success: true });
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (refreshToken) {
        // Delete the session
        await prisma.adminSession.deleteMany({
          where: { refreshToken }
        });
      }
      
      // Clear cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken', { path: '/api/admin/refresh' });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getAuthStatus(req: Request, res: Response) {
    // If this endpoint is reached, authentication was successful
    res.json({ authenticated: true, adminId: req.admin?.adminId });
  }
}
