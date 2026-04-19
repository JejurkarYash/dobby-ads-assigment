import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "db";
import bcrypt from "bcrypt";




export async function signup(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({
                error: {
                    code: "INVALID_INPUT",
                    message: "Please provide name, email, and password."
                }
            })
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                error: {
                    code: "USER_ALREADY_EXISTS",
                    message: "User already exists with this email."
                }
            });
            return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export async function signin(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                error: {
                    code: "INVALID_INPUT",
                    message: "Please provide email and password."
                }
            });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({
                error: {
                    code: "INVALID_CREDENTIALS",
                    message: "Invalid email or password."
                }
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                error: {
                    code: "INVALID_CREDENTIALS",
                    message: "Invalid email or password."
                }
            });
            return;
        }

        const secret = process.env.JWT_SECRET || "jwt_secret";
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            secret,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Sign in successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}