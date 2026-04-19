import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import apiClient from "../../api/axios";
import { FolderCard } from "../Dashboard/FolderCard";
import { bytesToSize } from "../../utils/BytesToSize";
import { FolderIcon } from "lucide-react";



const ImageIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const XIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);





export default function Dashboard() {
  const { activeFolder, setActiveFolder, forceRefresh } = useOutletContext<any>();

  const [subfolders, setSubfolders] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUploding, setImageUploading] = useState(false);
  const [newImageName, setNewImageName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchContents();
  }, [activeFolder]);


  const fetchContents = async () => {
    setIsLoading(true);

    try {
      if (!activeFolder) {
        const res = await apiClient.get("/folder/root");
        setSubfolders(res.data.folders || []);
        setImages([]);
      } else {
        const [folderRes, imgRes] = await Promise.all([
          apiClient.get(`/folder/${activeFolder._id}`),
          apiClient.get(`/image/${activeFolder._id}`)
        ]);

        setSubfolders(folderRes.data.folders || []);
        setImages(Array.isArray(imgRes.data) ? imgRes.data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setIsCreatingFolder(true);
    try {
      const res = await apiClient.post("/folder/create", {
        name: newFolderName.trim(),
        parentId: activeFolder?._id || null
      });
      if (res.status === 201) {
        setIsFolderModalOpen(false);
        setNewFolderName("");
        fetchContents();
        forceRefresh();
      } else {
        alert("Failed to create folder");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleUploadImage = async (e: React.FormEvent) => {
    setImageUploading(true);
    e.preventDefault();
    if (!newImageName.trim() || !selectedFile || !activeFolder) return;

    const formData = new FormData();
    formData.append("name", newImageName.trim());
    formData.append("folderId", activeFolder._id);
    formData.append("image", selectedFile);

    try {
      const res = await apiClient.post("/image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.status === 201 || res.status === 200) {
        setIsImageModalOpen(false);
        setNewImageName("");
        setSelectedFile(null);
        setImageUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchContents();
      } else {
        alert("Failed to upload image");
        setImageUploading(false);
      }
    } catch (err) {
      console.error(err);
      setImageUploading(false);
    }
  };



  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <header className="h-[60px] flex items-center justify-between px-8 border-b border-[#222] flex-shrink-0 bg-[#0A0A0A]">
        <div className="flex items-center gap-2 text-[14px]">
          <span className="text-gray-500 font-medium">My Files</span>
          <span className="text-[#444]">/</span>
          <span className="text-gray-200 font-medium tracking-tight">{activeFolder ? activeFolder.name : "Root"}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFolderModalOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-[#333] bg-[#0A0A0A] text-[13px] font-medium hover:bg-[#151515] hover:border-[#444] transition-colors text-white shadow-sm cursor-pointer"
          >
            Create folder
          </button>
          <button
            disabled={!activeFolder}
            onClick={() => activeFolder && setIsImageModalOpen(true)}
            className={`px-3 py-1.5 rounded-lg border border-[#333] text-[13px] font-medium transition-colors shadow-sm ${!activeFolder ? 'opacity-50 cursor-not-allowed bg-transparent text-gray-500' : 'bg-[#fff] text-black hover:bg-[#e5e5e5] cursor-pointer'}`}
          >
            Upload image
          </button>
        </div>
      </header>

      <div className="p-8 flex flex-col gap-8 flex-1 w-full max-w-7xl mx-auto">

        {isLoading ? (
          <div className="flex items-center justify-center p-10">
            <span className="text-[#555] text-sm animate-pulse">Loading contents...</span>
          </div>
        ) : (
          <>
            {subfolders.length > 0 && (
              <section>
                <h2 className="text-[14px] font-medium text-gray-400 mb-4 tracking-tight">Folders</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {subfolders.map(folder => (
                    <FolderCard key={folder._id} folder={folder} onClick={() => setActiveFolder(folder)} />
                  ))}
                </div>
              </section>
            )}

            {images.length > 0 && (
              <section>
                <h2 className="text-[14px] font-medium text-gray-400 mb-4 tracking-tight mt-4">Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {images.map(img => (
                    <div key={img._id} className="group rounded-xl border border-[#222] bg-[#0A0A0A] overflow-hidden hover:border-[#444] transition-all cursor-pointer flex flex-col shadow-sm">
                      <div className="h-36 bg-[#111] overflow-hidden relative">
                        {img.imageURL ? (
                          <img src={img.imageURL} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><ImageIcon size={28} className="text-[#333]" /></div>
                        )}
                      </div>
                      <div className="p-3.5 border-t border-[#222] bg-[#0A0A0A] group-hover:bg-[#111]">
                        <h3 className="text-white text-[13px] font-medium truncate mb-0.5" title={img.name}>{img.name}</h3>
                        <p className="text-[11px] text-gray-500">{bytesToSize(img.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!isLoading && subfolders.length === 0 && images.length === 0 && (
              <div className="flex-1 flex items-center justify-center border border-dashed border-[#222] rounded-2xl bg-[#0A0A0A]">
                <div className="flex flex-col items-center py-16">
                  <FolderIcon size={40} className="text-[#333] mb-4" />
                  <p className="text-[#888] text-[14px] font-medium">This folder is empty</p>
                  <p className="text-[#555] text-[13px] mt-1">Create a folder or upload an image.</p>
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 selection:bg-white/30">
          <div className="bg-[#0A0A0A] border border-[#222] rounded-xl w-full max-w-[360px] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white text-[16px] font-medium tracking-tight">Create folder</h2>
              <button onClick={() => setIsFolderModalOpen(false)} className="text-[#666] hover:text-white"><XIcon size={18} /></button>
            </div>
            <form onSubmit={handleCreateFolder}>
              <label className="block text-[12px] font-medium text-[#888] mb-1.5 pl-0.5">Folder name</label>
              <input
                autoFocus
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full bg-[#000] border border-[#333] rounded-lg px-3.5 py-2.5 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-[#777] focus:ring-1 focus:ring-[#777] transition-colors mb-5"
                placeholder="e.g. Design Assets"
              />
              <button
                type="submit"
                disabled={!newFolderName.trim() || isCreatingFolder}
                className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-[#e5e5e5] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors text-[14px]"
              >
                {isCreatingFolder ? (
                  <div className="flex flex-row items-center justify-center gap-3">
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </div>
                ) : (
                  "Create"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 selection:bg-white/30">
          <div className="bg-[#0A0A0A] border border-[#222] rounded-xl w-full max-w-[360px] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white text-[16px] font-medium tracking-tight">Upload image</h2>
              <button onClick={() => setIsImageModalOpen(false)} className="text-[#666] hover:text-white"><XIcon size={18} /></button>
            </div>
            <form onSubmit={handleUploadImage}>
              <label className="block text-[12px] font-medium text-[#888] mb-1.5 pl-0.5">Image name</label>
              <input
                autoFocus
                type="text"
                value={newImageName}
                onChange={(e) => setNewImageName(e.target.value)}
                className="w-full bg-[#000] border border-[#333] rounded-lg px-3.5 py-2.5 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-[#777] focus:ring-1 focus:ring-[#777] transition-colors mb-4"
                placeholder="e.g. Hero Banner"
              />

              <label className="block text-[12px] font-medium text-[#888] mb-1.5 pl-0.5">File</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-[#888] text-[13px] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[12px] file:font-medium file:bg-[#222] file:text-white hover:file:bg-[#333] mb-5 outline-none cursor-pointer"
              />

              <button
                type="submit"
                disabled={!newImageName.trim() || !selectedFile || imageUploding}
                className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-[#e5e5e5] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors text-[14px]"
              >
                {imageUploding ? (
                  <div className=" flex flex-row items-center justify-center gap-3">
                    <svg className="animate-spin h-4 w-4 mr-2 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  "Upload File"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
