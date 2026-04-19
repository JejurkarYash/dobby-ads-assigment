import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function JWTMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                error: {
                    code: "UNAUTHORIZED",
                    message: "Missing or invalid authorization token."
                }
            });
            return;
        }

        const token = authHeader.split(" ")[1] as string;

        const secret = process.env.JWT_SECRET || "jwt_secret";
        const decoded = jwt.verify(token, secret) as { userId: string; email: string };

        req.userId = decoded.userId;
        req.email = decoded.email;
        next();
    } catch (error) {
        res.status(401).json({
            error: {
                code: "UNAUTHORIZED",
                message: "Authentication failed. Token is invalid or expired."
            }
        });
        return;
    }
}