import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Trash2,
  LogOut,
  Image as ImageIcon,
  Loader2,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface ImageData {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  uploaded_at: string;
}

const AdminDashboard = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = localStorage.getItem("adminToken");

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }

    fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }
      })
      .catch(() => {
        navigate("/admin-login");
      });
  }, [token, navigate]);

  // Fetch images
  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch("/api/images");
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(f.type)
    );

    setPreviewFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => [...prev, url]);
    });
  };

  // Remove preview
  const removePreview = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload images
  const handleUpload = async () => {
    if (previewFiles.length === 0) return;
    setUploading(true);

    let successCount = 0;
    let failCount = 0;

    for (const file of previewFiles) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("/api/images/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    // Clean up previews
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewFiles([]);
    setPreviewUrls([]);
    setUploading(false);

    if (successCount > 0) {
      toast({
        title: "Upload Complete",
        description: `${successCount} image${
          successCount > 1 ? "s" : ""
        } uploaded successfully${
          failCount > 0 ? `, ${failCount} failed` : ""
        }.`,
      });
    }

    if (failCount > 0 && successCount === 0) {
      toast({
        title: "Upload Failed",
        description: "All uploads failed. Please try again.",
        variant: "destructive",
      });
    }

    fetchImages();
  };

  // Delete image
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "Image Deleted",
          description: "The image has been removed from the gallery.",
        });
        fetchImages();
      } else {
        toast({
          title: "Delete Failed",
          description: "Could not delete the image.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Server connection failed.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Image Manager</h1>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">
                {images.length} Images
              </span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Upload Section */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700/50 shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-emerald-400" />
              Upload Images
            </h2>

            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                dragActive
                  ? "border-emerald-400 bg-emerald-500/10"
                  : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/30"
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Plus
                className={`h-10 w-10 mx-auto mb-3 ${
                  dragActive ? "text-emerald-400" : "text-slate-500"
                }`}
              />
              <p className="text-slate-300 font-medium">
                Drop images here or click to browse
              </p>
              <p className="text-slate-500 text-sm mt-1">
                JPEG, PNG, GIF, WebP — Max 10MB per file
              </p>
            </div>

            {/* Preview Grid */}
            {previewUrls.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden bg-slate-700 ring-1 ring-slate-600"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePreview(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                        <p className="text-[10px] text-slate-300 truncate">
                          {previewFiles[index]?.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    {previewFiles.length} file
                    {previewFiles.length > 1 ? "s" : ""} selected
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        previewUrls.forEach((url) => URL.revokeObjectURL(url));
                        setPreviewFiles([]);
                        setPreviewUrls([]);
                      }}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      Clear All
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      size="sm"
                      className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload {previewFiles.length} Image
                          {previewFiles.length > 1 ? "s" : ""}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Images Grid */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-emerald-400" />
            Gallery Images
            <span className="ml-2 text-sm font-normal text-slate-400">
              ({images.length} total)
            </span>
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg">No images yet</p>
              <p className="text-slate-500 text-sm mt-1">
                Upload your first image above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-slate-800 ring-1 ring-slate-700 hover:ring-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
                >
                  <img
                    src={image.file_path}
                    alt={image.original_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-medium truncate mb-2">
                      {image.original_name}
                    </p>
                    <p className="text-slate-400 text-[10px] mb-3">
                      {new Date(image.uploaded_at).toLocaleDateString()}
                    </p>
                    <Button
                      onClick={() => handleDelete(image.id)}
                      disabled={deletingId === image.id}
                      size="sm"
                      className="w-full bg-red-500/80 hover:bg-red-500 text-white text-xs py-1 h-7"
                    >
                      {deletingId === image.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
