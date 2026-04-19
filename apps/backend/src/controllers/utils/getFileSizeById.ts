import { Image } from "db";
import { Folder } from "db";

export const getFileSizeById = async (folderId: string, ownerId: string): Promise<number> => {

    const images = await Image.find({ folder: folderId, owner: ownerId });
    const imagesSize = images.reduce((sum, img) => sum + img.size, 0);

    const subFolders = await Folder.find({ parent: folderId, owner: ownerId });

    let subFoldersSize = 0;
    for (const sub of subFolders) {
        subFoldersSize += await getFileSizeById(sub._id.toString(), ownerId);
    }

    return imagesSize + subFoldersSize;
}
