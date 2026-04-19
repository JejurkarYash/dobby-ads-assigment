import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { FolderNode } from "../Dashboard/FolderNode";
import { Folder } from "lucide-react"


export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [rootFolders, setRootFolders] = useState<any[]>([]);
  const [activeFolder, setActiveFolder] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("filenest_user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchRootFolders();
  }, [refreshTrigger, navigate]);

  const fetchRootFolders = async () => {
    try {
      const res = await apiClient.get("/folder/root");
      if (res.data && res.data.folders) {
        setRootFolders(res.data.folders);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("filenest_token");
    localStorage.removeItem("filenest_user");
    navigate("/login");
  };

  const forceRefresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden selection:bg-white/30">
      <aside className="w-[260px] bg-[#000] border-r border-[#222] flex flex-col flex-shrink-0">
        <div className="h-[60px] flex items-center px-5 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#222] to-[#111] border border-[#333] shadow-[0_0_10px_rgba(255,255,255,0.03)] flex items-center justify-center">
              <Folder size={14} fill="currentColor" className="text-white hover:cursor-pointer" />
            </div>
            <span className="font-medium text-[14px] text-white tracking-tight">FileNest</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-5">
          <div className="px-5 mb-3 flex items-center justify-between">
            <p className="text-[11px] font-medium tracking-wide text-[#555] uppercase">My Folders</p>
          </div>

          <div className="px-3 flex flex-col gap-1">
            <div
              onClick={() => setActiveFolder(null)}
              className={`group flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${activeFolder === null ? 'bg-[#222]' : 'hover:bg-[#111]'}`}
            >
              <div className="flex items-center gap-2">
                <Folder size={16} className={activeFolder === null ? "text-white" : "text-[#555]"} />
                <span className={`text-[13px] ${activeFolder === null ? 'text-white font-medium' : 'text-[#888]'}`}>Root</span>
              </div>
            </div>

            {rootFolders.map((folder: any) => (
              <FolderNode
                key={folder._id}
                folder={folder}
                level={0}
                activeFolder={activeFolder}
                setActiveFolder={setActiveFolder}
                refreshTrigger={refreshTrigger}
              />
            ))}
          </div>
        </div>

        <div className="h-[60px] border-t border-[#222] flex items-center justify-between px-5 bg-[#000]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-[11px] font-medium text-white shadow-inner">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="text-[13px] font-medium text-[#ccc]">{user?.name || 'User'}</span>
          </div>
          <button onClick={handleLogout} className="text-[12px] font-medium text-[#666] hover:text-white transition-colors cursor-pointer">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-[#0A0A0A]">
        <Outlet context={{ activeFolder, setActiveFolder, forceRefresh }} />
      </main>
    </div>
  );
}
