import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Image, Video, File, UploadCloud, X, Trash2, MoreHorizontal, Trash, Copy, Eye } from "lucide-react";
import FileUpload from "@/components/ui/file-upload";
import axios from "axios";
import { backendurl, imgurl } from "@/server";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import swal from 'sweetalert';
import { createNotification } from "@/redux/action/usernotification";
import { useDispatch } from "react-redux";
import { createAdminNotification } from "@/redux/action/adminNotificationActions";
const UserPortfolio = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch()

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [isPortfolioPopoverOpen, setIsPortfolioPopoverOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null); // Store selected portfolio



  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  if(!user) return null 

  const fetchPortfolios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendurl}/userportfolio/portfolio/${user?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolios(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to load portfolios. Please try again.");
      console.error("Error fetching portfolios:", error);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [user?._id]);



  const handleFilesSelected = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data) => {
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one image, video, or file.");
      return;
    }
    
    const base64Files = await Promise.all(
      uploadedFiles.map(async (file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        content: await convertFileToBase64(file),
      }))
    );

    const portfolioData = {
      title: data.title,
      description: data.description,
      files: base64Files,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${backendurl}/userportfolio/portfolio/create`, portfolioData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setUploadedFiles([]);
      reset();
      setIsPopoverOpen(false);
      fetchPortfolios();
      dispatch(createNotification(user?._id, "Portfolio Uploaded", "Your portfolio was uploaded successfully!", "check"));

      toast.success("Work uploaded successfully! ");

       dispatch(
        createAdminNotification(
          user?._id,
          "New Portfolio Uploaded",
           `A new portfolio has been uploaded by ${user?.name || "a user"}. Take a moment to review it.`,
          "info"
        )
        );
    } catch (error) {
      toast.error("Failed to upload your work. Please try again. ❌"); 
      console.error("Error creating portfolio:", error.response?.data || error);
    }
  };

  const handleDeletePortfolio = async (portfolioId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this portfolio!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(`${backendurl}/userportfolio/portfolio/delete/${portfolioId}`);
          if (response.data.success) {
            fetchPortfolios();
            toast.success('Portfolio deleted successfully');
          } else {
            toast.error(response.data.message || 'Failed to delete portfolio');
          }
        } catch (error) {
          console.error('Error deleting portfolio:', error);
          toast.error('An error occurred while deleting the portfolio');
        }
      }
    });
  };

  const handleOpenPopover = () => setIsPopoverOpen(true);

  const handleClosePopover = () => {
    setIsPopoverOpen(false);  // Close the popover
    setUploadedFiles([]);     // Clear uploaded images
    reset();                  // Reset form values
  };

  const handleOpenPortfolioPopover = (id) => {
    const filteredPortfolio = portfolios.find((portfolio) => portfolio?._id === id); // Filter portfolio by ID
    setSelectedPortfolio(filteredPortfolio);
    setIsPortfolioPopoverOpen(true);
  };
  
  const handleClosePortfolioPopover = () => {
    setSelectedPortfolio(null);
    setIsPortfolioPopoverOpen(false);
  };


    // Check if URL is an image or video based on extension
    const isImage = (url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header Section */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Your Portfolio</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Showcase your work by uploading images, videos, or CAD files.
          </p>
        </div>

        <Button onClick={handleOpenPopover} variant="outline" className="cursor-pointer mt-2 sm:mt-0 dark:bg-neutral-800 dark:border-neutral-700">
          <UploadCloud className="w-5 h-5 mr-2" />
          Upload Your Work
        </Button>
      </div>

       {/* Portfolio Grid Section */}

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
        {loading ? (
          <div className="col-span-full text-center">
            <p className="text-neutral-400 text-lg font-medium">Loading portfolios...</p>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="col-span-full text-center">
            <p className="text-neutral-400 text-lg font-medium">
              No portfolios found. Start by uploading your work!
            </p>
          </div>
        ) : (
          portfolios.map((portfolio) => (
            <article
              key={portfolio._id}
              onClick={() => handleOpenPortfolioPopover(portfolio?._id)}
              className="relative cursor-pointer border rounded-lg overflow-hidden bg-background dark:bg-neutral-800 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform  dark:border-neutral-600 dark:shadow-sm dark:shadow-neutral-700"
            >
              {/* Image/Video Container */}
              <div className="relative w-full h-60 bg-muted rounded-t-lg overflow-hidden group" >
                {portfolio.files.length > 0 ? (
                  isImage(portfolio.files[0]?.url) ? (
                    <img
                      src={`${imgurl}${portfolio.files[0].url}`}
                      alt="Portfolio preview"
                      className="w-full h-full object-cover rounded-t-lg transform group-hover:scale-105 transition-transform"
                    />
                  ) : isVideo(portfolio.files[0]?.url) ? (
                    <video
                      controls
                      src={`${imgurl}${portfolio.files[0]?.url}`}
                      className="w-full h-full object-cover rounded-t-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-neutral-500 text-sm">
                      File format not supported for preview
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-neutral-500 text-sm">
                    No file available
                  </div>
                )}
              </div>

              {/* Portfolio Details */}
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-neutral-200 truncate">
                  {portfolio.title}
                </h3>
                <p className="text-sm text-justify text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed hyphens-auto">
                {portfolio.description}
              </p>

                <p className="text-xs text-muted-foreground">
                  Uploaded on {new Date(portfolio.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger 
                  className="p-3 cursor-pointer bg-background dark:bg-neutral-700 rounded-full shadow hover:bg-neutral-200 hover:dark:bg-neutral-800 focus:outline-none transition"
                  onPointerDown={(e) => e.stopPropagation()} 
                  >
                    <MoreHorizontal size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='space-y-1 ' 
                  onPointerDown={(e) => e.stopPropagation()} 
                  
                  >
                    <DropdownMenuLabel>Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex gap-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        navigator.clipboard.writeText(`${imgurl}${portfolio.files[0]?.url}`);
                        toast.success("Copied to Clipboard");
                      }}
                    >
                      <Copy aria-hidden className="w-4 h-4" /> Copy File Link
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="flex gap-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleOpenPortfolioPopover(portfolio?._id);
                      }}
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </DropdownMenuItem>

                    
                    <DropdownMenuItem
                    className="cursor-pointer flex gap-2 items-center text-destructive p-2 rounded-md transition-colors duration-200 hover:bg-red-500 dark:bg-red-400 dark:text-white hover:text-white dark:hover:bg-red-500   focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePortfolio(portfolio._id)}
                    }
                  >
                    <Trash aria-hidden className="w-4 h-4" /> 
                    <span>Delete Portfolio</span>
                  </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </article>
          ))
        )}
      </div>





      {/* Upload Form Modal */}
      {isPopoverOpen && (
        <div className="fixed inset-0 bg-[#000000b7] bg-opacity-50 flex items-center justify-center z-50 min-h-screen">
          <div className="relative w-full max-w-lg p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg">
            <button onClick={handleClosePopover} className="cursor-pointer absolute top-4 right-4 text-muted-foreground">
              <X className="w-6 h-6" />
            </button>
            <div className="max-h-[85vh] overflow-y-auto  scrollbar-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" placeholder="Enter project title" {...register("title", { required: "Title is required" })} />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea id="description" placeholder="Enter project description" {...register("description", { required: "Description is required" })} rows={3} />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <Tabs defaultValue="images">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="images"><Image className="mr-1 w-5 h-5" /> Images</TabsTrigger>
                  <TabsTrigger value="videos"><Video className="mr-1 w-5 h-5" /> Videos</TabsTrigger>
                  <TabsTrigger value="files"><File className="mr-1 w-5 h-5" /> CAD Files</TabsTrigger>
                </TabsList>

                <TabsContent value="images">
                  <FileUpload onFilesSelected={handleFilesSelected} accept="image/*" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {uploadedFiles.filter(file => file.type.startsWith("image/")).map((file, index) => (
                      <div key={index} className="relative">
                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-40 object-cover rounded-lg" />
                        <button onClick={() => removeFile(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="videos">
                  <FileUpload onFilesSelected={handleFilesSelected} accept="video/*" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {uploadedFiles.filter(file => file.type.startsWith("video/")).map((file, index) => (
                      <div key={index} className="relative">
                        <video controls className="w-full h-40 object-cover rounded-lg">
                          <source src={URL.createObjectURL(file)} type={file.type} />
                        </video>
                        <button onClick={() => removeFile(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="files">
                  <FileUpload onFilesSelected={handleFilesSelected} accept=".cad,.stl,.obj" />
                  <div className="mt-4">
                    {uploadedFiles.filter(file => !file.type.startsWith("image/") && !file.type.startsWith("video/")).map((file, index) => (
                      <div key={index} className="flex items-center gap-2 border rounded-lg p-2">
                        <File className="w-6 h-6 text-gray-500" />
                        <p className="truncate">{file.name}</p>
                        <button onClick={() => removeFile(index)} className="text-red-500 ml-auto">
                          <Trash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
               {/* File Validation Error Message */}
               {errors.files && <p className="text-red-500 text-sm mt-1">{errors.files.message}</p>}

              <div className="flex justify-end gap-4">
                <Button type="submit" className="cursor-pointer">Submit Work</Button>
                <Button type="button" onClick={handleClosePopover} variant="destructive" className='dark:bg-red-500 cursor-pointer hover:dark:bg-red-400'>Cancel</Button>
              </div>
            </form>
          </div>

          </div>
        </div>
      )}


      {/* portfolio modal */}

      {isPortfolioPopoverOpen && selectedPortfolio && (
        <div className="fixed inset-0 bg-[#0000008c] flex items-center justify-center z-50 min-h-screen">
          <div className="relative w-full max-w-4xl p-8 bg-white dark:bg-neutral-900 max-h-[90vh] overflow-y-auto  scrollbar-hidden border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-xl">
            <button
              onClick={handleClosePortfolioPopover}
              className="cursor-pointer absolute top-4 right-4 text-muted-foreground hover:text-neutral-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-8">
              {/* Title Section */}
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-neutral-100">
                  {selectedPortfolio.title}
                </h2>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {selectedPortfolio.description}
                </p>
              </div>

              {/* Media Gallery Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                  Gallery
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {selectedPortfolio.files.map((file, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 shadow"
                    >
                      {isImage(file.url) ? (
                        <img
                          src={`${imgurl}${file.url}`}
                          alt={`Portfolio image ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform"
                        />
                      ) : isVideo(file.url) ? (
                        <video
                          controls
                          src={`${imgurl}${file.url}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-64 text-neutral-500 text-sm">
                          File format not supported for preview
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>


              {/* Upload Date Section */}
              <p className="text-xs text-center text-muted-foreground">
                Uploaded on {new Date(selectedPortfolio.createdAt).toLocaleDateString()}
              </p>

              <div className="flex justify-center">
              <Button variant="outline" onClick={handleClosePortfolioPopover} className="cursor-pointer">
                Close
              </Button>
              </div>


            </div>
          </div>
        </div>
      )}





    </div>
  );
};

export default UserPortfolio;
