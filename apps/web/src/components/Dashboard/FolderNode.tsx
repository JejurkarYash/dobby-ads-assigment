import { useState, useEffect } from "react";
import apiClient from "../../api/axios"
import { Folder, FolderOpen } from "lucide-react";

export const FolderNode = ({ folder, level, activeFolder, setActiveFolder, refreshTrigger }: any) => {
    const [expanded, setExpanded] = useState(false);
    const [subfolders, setSubfolders] = useState<any[]>([]);

    const fetchSubfolders = async () => {
        try {
            const res = await apiClient.get(`/folder/${folder._id}`);
            if (res.data && res.data.folders) setSubfolders(res.data.folders);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (expanded) fetchSubfolders();
    }, [expanded, refreshTrigger]);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    return (
        <div>
            <div
                onClick={() => setActiveFolder(folder)}
                className={`group flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${activeFolder?._id === folder._id ? 'bg-[#222]' : 'hover:bg-[#111]'}`}
                style={{ marginLeft: `${level * 12}px` }}
            >
                <div className="flex items-center gap-2">
                    <button onClick={handleToggle} className="text-[#555] hover:text-white transition-colors hover:cursor-pointer">
                        {expanded ? <FolderOpen size={16} /> : <Folder size={16} />}
                    </button>
                    <span className={`text-[13px] ${activeFolder?._id === folder._id ? 'text-white font-medium' : 'text-[#888]'}`}>{folder.name}</span>
                </div>
            </div>
            {expanded && (
                <div className="mt-1 flex flex-col gap-1">
                    {subfolders.map((sub: any) => (
                        <FolderNode key={sub._id} folder={sub} level={level + 1} activeFolder={activeFolder} setActiveFolder={setActiveFolder} refreshTrigger={refreshTrigger} />
                    ))}
                </div>
            )}
        </div>
    );
};