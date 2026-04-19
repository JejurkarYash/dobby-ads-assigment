import { Image } from "db";
import { Folder } from "db";
import type { Request, Response } from "express";

export const uploadImage = async (req: Request, res: Response) => {
    try {
        const { name, folderId } = req.body;
        console.log(req.body);
        console.log(req.file)
        const userId = req.userId as string;

        if (!name || !folderId) {
            return res.status(400).json({ message: 'Name and folder are required' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }


        const folder = await Folder.findOne({
            _id: folderId,
            owner: userId
        });

        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        const image = await Image.create({
            name,
            imageURL: req.file.path,
            size: req.file.size,
            folder: folderId,
            owner: userId
        });

        res.status(201).json(image);

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

export const getImages = async (req: Request, res: Response) => {
    try {
        const { folderId } = req.params;
        const userId = req.userId as string;

        if (!folderId) {
            return res.status(400).json({ message: 'Folder ID is required' });
        }

        const images = await Image.find({
            folder: folderId,
            owner: userId
        });

        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
}