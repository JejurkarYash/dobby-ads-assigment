import { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { FolderIcon } from "lucide-react";
import { bytesToSize } from "../../utils/BytesToSize";

export const FolderCard = ({ folder, onClick }: { folder: any, onClick?: () => void }) => {
    const [size, setSize] = useState<number | null>(null);

    useEffect(() => {
        const fetchSize = async () => {
            try {
                const res = await apiClient.get(`/folder/${folder._id}/size`);
                if (res.status === 200) {
                    setSize(res.data.sizeInByte);
                }
            } catch (err) {
                console.error("Failed to fetch folder size:", err);
            }
        };
        fetchSize();
    }, [folder._id]);

    return (
        <div onClick={onClick} className="group rounded-xl border border-[#222] bg-[#0A0A0A] p-4 hover:border-[#444] hover:bg-[#111] transition-all cursor-pointer flex flex-col">
            <div className="mb-6 h-10 w-10 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center">
                <FolderIcon size={20} fill="currentColor" className="text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <div>
                <h3 className="text-white text-[14px] font-medium mb-0.5 tracking-tight">{folder.name}</h3>
                <p className="text-[12px] text-gray-500">{size !== null ? bytesToSize(size) : "Calculating..."}</p>
            </div>
        </div>
    );
};