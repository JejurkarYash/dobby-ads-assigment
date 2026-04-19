import { Folder } from "db";
import type { Request, Response } from "express";
import { getFileSizeById } from "./utils/getFileSizeById.js";

export async function createFolder(req: Request, res: Response) {
    try {
        const { name, parentId } = req.body;
        const userId = req.userId as string;

        if (!name) {
            res.status(400).json({
                error: {
                    code: "INVALID_INPUT",
                    message: "Folder name is required."
                }
            });
            return;
        }

        const existingFolder = await Folder.findOne({
            name: name,
            parent: parentId || null,
            owner: userId
        })

        if (existingFolder) {
            res.status(400).json({
                error: {
                    code: "FOLDER_ALREADY_EXISTS",
                    message: "Folder already exists."
                }
            });
            return;
        }

        // creating new folder
        const folder = await Folder.create({
            name: name,
            parent: parentId || null,
            owner: userId
        });

        res.status(201).json({
            message: "Folder created successfully",
            folder
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export async function getRootFolders(req: Request, res: Response) {
    try {
        const userId = req.userId as string;

        const folders = await Folder.find({ parent: null, owner: userId });

        if (!folders) {
            return res.json({
                message: "No folders found"
            })
        }

        res.status(200).json({
            message: "Root folders fetched successfully",
            folders
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export async function getSubFolders(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = req.userId as string;

        const folders = await Folder.find({ parent: id as string, owner: userId });

        if (!folders) {
            return res.json({
                message: "No subfolders found"
            })
        }
        res.status(200).json({
            message: "Subfolders fetched successfully",
            folders
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export async function getFolderSize(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = req.userId as string;



        const sizeInByte = await getFileSizeById(id as string, userId);

        res.status(200).json({
            message: "Folder size calculated successfully",
            folderId: id,
            sizeInByte
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}