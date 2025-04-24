import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, File, Image, Timer, Trash2, UploadCloud, Video, X, XCircle } from 'lucide-react';
import { DataGrid } from '@mui/x-data-grid';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/ui/file-upload';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axios from 'axios';
import { backendurl, imgurl } from '@/server';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { createNotification } from '@/redux/action/usernotification';
import { briefdata } from '@/breif';
import { createAdminNotification } from '@/redux/action/adminNotificationActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const extractTargetCount = (targetCountString) => {
  const match = targetCountString?.match(/\d+/); // Match only digits
  return match ? parseInt(match[0], 10) : 0;
};

const Userdesignuploadcon = () => {
  const { user } = useSelector((state) => state.auth);

  

    const [isDesignPopoverOpen, setIsDesignPopoverOpen] = useState(false);
    const [isDesignDetailsPopoverOpen, setIsDesignDetailsPopoverOpen] = useState(false);
    const [selectedDesign, setSelectedDesign] = useState(null); // Store selected portfolio
    const dispatch = useDispatch()
    
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [category, setCategory] = useState(""); 
    const [briefsdata ,setBreifsdata] = useState([])
    const [selectedBrief, setSelectedBrief] = useState(null);

    const handleBriefSelect = (briefId) => {
      const selected = briefsdata.find((brief) => brief._id === briefId);
    
      if (new Date(selected.targetdate) < new Date()) {
        toast.error("This brief has expired and cannot be selected.");
        return;
      }
    
      setSelectedBrief(selected);
    };

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm();
  
  
  const [designs, setDesigns] = useState([]);

   const fetchBriefs = async () => {
       try {
                const { data } = await axios.get(`${backendurl}/brief/get-all-briefs`);
                // Filter briefs where isLive is true
                const liveBriefs = data.briefs.filter(
                  (brief) => brief.isLive && brief.visibleTo?.includes(user?._id)
                );
                setBreifsdata(liveBriefs); // Store only live briefs
              } catch (error) {
                console.error("Error fetching briefs:", error);
              } 
     };
      
     useEffect(() => {
       fetchBriefs();
     }, []);


            console.log(briefsdata,'briefsdata')

            const columns = [
              { field: 'id', headerName: 'ID', width: 100 },
              { field: 'title', headerName: 'Design Title', flex: 1, minWidth: 150 },
              { field: 'type', headerName: 'Type', width: 130 },
              {
                field: 'status',
                headerName: 'Status',
                width: 160,
                renderCell: (params) => {
                  const status = params.value;
                  let icon, bgColor, textColor, label;
              
                  if (status === 'approved') {
                    icon = <CheckCircle className="w-3.5 h-3.5 text-green-700" />;
                    bgColor = 'bg-green-100';
                    textColor = 'text-green-700';
                    label = 'Approved';
                  } else if (status === 'rejected') {
                    icon = <XCircle className="w-3.5 h-3.5 text-red-600" />;
                    bgColor = 'bg-red-100';
                    textColor = 'text-red-600';
                    label = 'Rejected';
                  } else {
                    icon = <Timer className="w-3.5 h-3.5 text-yellow-600" />;
                    bgColor = 'bg-yellow-100';
                    textColor = 'text-yellow-600';
                    label = 'Pending';
                  }
              
                  return (
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
                    >
                      {icon}
                      <span>{label}</span>
                    </div>
                  );
                }
              },
              { field: 'category', headerName: 'Category', width: 150 },
              {
                field: 'uploadedAt',
                headerName: 'Uploaded At',
                width: 160,
                valueFormatter: (params) => {
                  if (!params) return 'N/A';
                  return new Date(params).toLocaleDateString();
                },
              },
              {
                field: 'actions',
                headerName: 'Actions',
                width: 180,
                renderCell: (params) => (
                  <Button
                    variant="outline"
                    className="cursor-pointer dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700"
                    onClick={() => handledesigndetailOpenPortfolioPopover(params.row.id)}
                  >
                    View Details
                  </Button>
                ),
              },
            ];

  // Map data to match DataGrid rows with `_id` used as the unique ID
  const rows = designs.map((design, index) => ({
    id: design._id , // Use `_id` as the unique row ID, fallback to index if missing
    title: design.title,
    type: design.type,
    status: design.status,
    category: design.category,
    uploadedAt: design.createdAt   // Handle timestamp from backend
  }));



  const handleDesignOpenPopover = () => setIsDesignPopoverOpen(true);
  const handleDesignClosePopover = () => {
    setIsDesignPopoverOpen(false)
    setUploadedFiles([])
    setCategory("")
    setSelectedBrief(null)
    reset()
  };

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

  const fetchUserDesigns = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please log in to view your designs.");
        return;
      }

      if (!user || !user._id) {
        toast.error("User ID is missing. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${backendurl}/userdesign/user-design/my-designs/${user?._id}`, // Pass user.id as a URL parameter
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDesigns(response.data.designs);
    } catch (error) {
      console.error("Error fetching user designs:", error);
      // toast.error(error.response?.data?.error || "Failed to fetch designs.");
    }
  };

  console.log(designs,'desing')

  useEffect(() => {
    fetchUserDesigns();
  }, []);


const onSubmit = async (data) => {
  console.log({ ...data, uploadedFiles, category });

  const targetCount = extractTargetCount(selectedBrief?.targetcount);

  if (!selectedBrief) {
    toast.error("Please select a brief before submitting.");
    return;
  }

  if(!category) {
    toast.error("Please select a category  before submitting.");
    return;
  }

  if (uploadedFiles.length === 0) {
    toast.error("Please upload at least one image, video, or file.");
    return;
  }

  if (uploadedFiles.length > targetCount) {
    toast.error(`You can upload up to ${targetCount} files only.`);
    toast.error(`This brief requires a maximum of ${targetCount} files/designs per category.`);
    return;
  }
  

  try {
    const base64Files = await Promise.all(
      uploadedFiles.map(async (file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        content: await convertFileToBase64(file),
      }))
    );

    const designData = {
      title: data.designTitle,
      type: data.designType,
      category: category,
      files: base64Files,
      brief: selectedBrief,
    };

    console.log(designData, "designData");

    // Sending the request to the backend using Axios
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    const response = await axios.post(
      `${backendurl}/userdesign/user-design/create`, // Adjust base URL as needed
      designData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Sending token in Authorization header
        },
      }
    );

    if (response.status === 201) {
      handleDesignClosePopover(); // Close the popover after success
      fetchUserDesigns();
      dispatch(
        createNotification(
          user?._id, 
          "Design Uploaded",  // Updated Title
          "Your design was uploaded successfully! We will review your design, and once approved, you will be notified.",  // Updated Message
          "info"  // Icon or Status Indicator (unchanged)
        )
      );
      toast.success("Design uploaded successfully!");
      dispatch(
        createAdminNotification(
          user?._id,
          "New Design Uploaded",
          `${user?.name || "A user"} uploaded a new design for review.`,
          "info"
        )
      );
    }
  } catch (error) {
    console.error("Error uploading design:", error);
    toast.error(error.response?.data?.error || "Failed to upload design.");
  }
};


const handledesigndetailOpenPortfolioPopover = (id) => {
  console.log(id, "sdsjnkjugy");
  const filteredDesign = designs.find((design) => design?._id === id); // Filter design by ID
  setSelectedDesign(filteredDesign);
  setIsDesignDetailsPopoverOpen(true);
};

const handleClosePortfolioPopover = () => {
  setSelectedDesign(null);
  setIsDesignDetailsPopoverOpen(false);
};

 // Check if URL is an image or video based on extension
 const isImage = (url) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
 const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

 const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Function to update the dark mode state dynamically
    const updateDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Initial check for dark mode on mount
    updateDarkMode();

    // Create a MutationObserver to watch for changes in the `class` attribute on the `html` tag
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, {
      attributes: true, // Observe attribute changes
      attributeFilter: ['class'], // Specifically track `class` attribute changes
    });

    // Cleanup: Disconnect the observer when the component unmounts
    return () => observer.disconnect();
  }, []);

console.log(selectedDesign,'selected design')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const totalPages = Math.ceil(rows.length / itemsPerPage)
    const paginatedRows = rows.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )


  return (
    

      <div className="p-4 sm:p-6 space-y-6 ">
            {/* Header Section */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Your Design Upload</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                Upload your designs and start earning today!
                </p>
              </div>
      
              <Button onClick={handleDesignOpenPopover} variant="outline" className="cursor-pointer mt-2 sm:mt-0 dark:bg-neutral-800 dark:border-neutral-700">
                <UploadCloud className="w-5 h-5 mr-2" />
                Upload Your Design
              </Button>
            </div>

          {/* Empty State Message */}
          {!rows.length ? (
        <div className="text-center text-sm text-neutral-400 py-10">
          No designs uploaded yet. Start uploading your creations and earn with your designs!
        </div>
      ) : (
        <div className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden">
          <div className="w-full overflow-x-auto lg:overflow-x-hidden">
            <Table className="w-full table-fixed text-sm">
              <TableHeader className="bg-neutral-100 dark:bg-neutral-800">
                <TableRow>
                  <TableHead className="px-3 py-3 text-left font-semibold text-neutral-700 dark:text-neutral-300 w-[30%]">
                    Design Title
                  </TableHead>
                  <TableHead className="px-3 py-3 text-left font-semibold text-neutral-700 dark:text-neutral-300 hidden lg:table-cell w-[10%]">
                    Type
                  </TableHead>
                  <TableHead className="px-3 py-3 text-left font-semibold text-neutral-700 dark:text-neutral-300 w-[20%]">
                    Status
                  </TableHead>
                  <TableHead className="px-3 py-3 text-left font-semibold text-neutral-700 dark:text-neutral-300 hidden lg:table-cell w-[20%]">
                    Category
                  </TableHead>
                  <TableHead className="px-3 py-3 text-left font-semibold text-neutral-700 dark:text-neutral-300 hidden lg:table-cell w-[15%]">
                    Uploaded At
                  </TableHead>
                  <TableHead className="px-3 py-3 text-right font-semibold text-neutral-700 dark:text-neutral-300 w-[15%]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedRows.map((row) => {
                  let statusIcon, statusColor, statusBg, statusLabel

                  if (row.status === "approved") {
                    statusIcon = <CheckCircle className="w-4 h-4 text-green-700" />
                    statusColor = "text-green-700"
                    statusBg = "bg-green-100"
                    statusLabel = "Approved"
                  } else if (row.status === "rejected") {
                    statusIcon = <XCircle className="w-4 h-4 text-red-600" />
                    statusColor = "text-red-600"
                    statusBg = "bg-red-100"
                    statusLabel = "Rejected"
                  } else {
                    statusIcon = <Timer className="w-4 h-4 text-yellow-600" />
                    statusColor = "text-yellow-600"
                    statusBg = "bg-yellow-100"
                    statusLabel = "Pending"
                  }

                  return (
                    <TableRow key={row.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">
                      <TableCell className="px-3 py-3 font-medium text-neutral-800 dark:text-neutral-100">
                        {row.title}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-neutral-700 dark:text-neutral-300 hidden lg:table-cell">
                        {row.type || "N/A"}
                      </TableCell>
                      <TableCell className="px-3 py-3">
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusBg} ${statusColor}`}
                        >
                          {statusIcon}
                          {statusLabel}
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-3 text-neutral-700 dark:text-neutral-300 hidden lg:table-cell">
                        {row.category}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-neutral-700 dark:text-neutral-300 hidden lg:table-cell">
                        {row.uploadedAt ? new Date(row.uploadedAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-right">
                        <Button
                          variant="outline"
                          className="dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700"
                          onClick={() => handledesigndetailOpenPortfolioPopover(row.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <button
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          currentPage === i + 1
                            ? "bg-neutral-800 text-white"
                            : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        {i + 1}
                      </button>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}



            {/* Upload Form Modal */}
            {isDesignPopoverOpen && (
            <div className="fixed inset-0 bg-[#000000b7] bg-opacity-50 flex items-center justify-center z-50 min-h-screen">
            <div className="relative w-full max-w-xl p-6  bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg">
              <div className='mb-2 flex justify-between items-center'>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Upload Your Design
              </h2>
                <button onClick={handleDesignClosePopover} className="cursor-pointer text-muted-foreground">
                <X className="w-6 h-6" />
              </button>
              </div>
              
              <div className="max-h-[85vh] overflow-y-auto scrollbar-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
                  {/* Design Title */}
                  <div className="space-y-2">
                    <Label htmlFor="designTitle">Design Title</Label>
                    <Input
                      id="designTitle"
                      placeholder="Enter design title"
                      {...register("designTitle", { required: "Title is required" })}
                    />
                    {errors.designTitle && <p className="text-red-500 text-sm">{errors.designTitle.message}</p>}
                  </div>

                  {/* Design Type */}
                  <div className="space-y-2">
                    <Label htmlFor="designType">Design Type</Label>
                    <Input
                      id="designType"
                       placeholder="e.g., Sketch, CAD File, 3D Model, Hand-drawn Design"
                      {...register("designType", { required: "Design type is required" })}
                    />
                    {errors.designType && <p className="text-red-500 text-sm">{errors.designType.message}</p>}
                  </div>



                   {/* Brief Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="briefSelect">Select Brief</Label>
                    <Select onValueChange={handleBriefSelect}>
                      <SelectTrigger>
                        <span>{selectedBrief ? selectedBrief.name : "Select a Brief"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {briefsdata.map((brief) => {
                          const isExpired = new Date(brief.targetdate) < new Date();

                          return (
                            <SelectItem
                              key={brief._id}
                              value={brief._id}
                              disabled={isExpired} // Disable if expired
                              className={isExpired ? "text-gray-400 cursor-not-allowed" : ""}
                            >
                              {brief.name} {isExpired ? "(Closed)" : ""}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedBrief && (
                  <div className="mt-2 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Brief Details
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700 dark:text-neutral-300">
                      <div className="flex justify-between">
                        <span className="font-medium">Title:</span>
                        <span>{selectedBrief.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Category:</span>
                        <span>{Object.keys(selectedBrief.category || {}).join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Target Count:</span>
                        <span>{selectedBrief.targetcount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Deadline:</span>
                        <span>{selectedBrief.targetdate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Reward:</span>
                        <span>{selectedBrief.rewardPoints} points</span>
                      </div>
                    </div>
                  </div>
                  )}




                {/* Design Category (Dynamic based on Selected Brief) */}
                <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={setCategory} disabled={!selectedBrief}>
                  <SelectTrigger>
                    <span>
                      {category || (selectedBrief ? "Select Design Category" : "Select a Brief First")}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBrief?.category &&
                      Object.entries(selectedBrief.category)
                        .filter(([_, value]) => value === true)
                        .map(([key], index) => (
                          <SelectItem key={index} value={key}>
                            {key}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

                  {/* Tabs for Images/Videos/Files */}
                  <Tabs defaultValue="images">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="images">
                        <Image className="mr-1 w-5 h-5" /> Images
                      </TabsTrigger>
                      <TabsTrigger value="videos">
                        <Video className="mr-1 w-5 h-5" /> Videos
                      </TabsTrigger>
                      <TabsTrigger value="files">
                        <File className="mr-1 w-5 h-5" /> CAD Files
                      </TabsTrigger>
                    </TabsList>

                    {/* Images Upload */}
                    <TabsContent value="images">
                      <FileUpload onFilesSelected={handleFilesSelected} accept="image/*" />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {uploadedFiles
                          .filter((file) => file.type.startsWith("image/"))
                          .map((file, index) => (
                            <div key={index} className="relative">
                              <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-40 object-cover rounded-lg" />
                              <button type="button" onClick={() => removeFile(index)} className="cursor-pointer absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                      </div>
                    </TabsContent>

                    {/* Videos Upload */}
                    <TabsContent value="videos">
                      <FileUpload onFilesSelected={handleFilesSelected} accept="video/*" />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {uploadedFiles
                          .filter((file) => file.type.startsWith("video/"))
                          .map((file, index) => (
                            <div key={index} className="relative">
                              <video controls className="w-full h-40 object-cover rounded-lg">
                                <source src={URL.createObjectURL(file)} type={file.type} />
                              </video>
                              <button type="button" onClick={() => removeFile(index)} className="cursor-pointer absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                      </div>
                    </TabsContent>

                    {/* Files Upload */}
                    <TabsContent value="files">
                      <FileUpload onFilesSelected={handleFilesSelected} accept=".cad,.stl,.obj" />
                      <div className="mt-4">
                        {uploadedFiles
                          .filter((file) => !file.type.startsWith("image/") && !file.type.startsWith("video/"))
                          .map((file, index) => (
                            <div key={index} className="flex items-center gap-2 border rounded-lg p-2">
                              <File className="w-6 h-6 text-gray-500" />
                              <p className="truncate">{file.name}</p>
                              <button type="button" onClick={() => removeFile(index)} className="cursor-pointer text-red-500 ml-auto">
                                <Trash2 />
                              </button>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Submit & Cancel Buttons */}
                  <div className="flex justify-end gap-4">
                    <Button type="submit" className='cursor-pointer'>Submit Design</Button>
                    <Button
                      type="button"
                      onClick={handleDesignClosePopover}
                      variant="destructive"
                      className="cursor-pointer dark:bg-red-500 hover:dark:bg-red-400"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
            )}

            {/* design Details popover  */}

            {isDesignDetailsPopoverOpen && (
              <div className="fixed inset-0 bg-[#0000008c] flex items-center justify-center z-50 min-h-screen ">
                <div className="relative w-full max-w-5xl p-8 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-xl">

                  {/* Close Button */}
                  <button
                    onClick={handleClosePortfolioPopover}
                    className="cursor-pointer absolute top-4 right-4 text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 hover:dark:text-neutral-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {/* Scrollable Content */}
                  <div className="space-y-6 max-h-[80vh] overflow-y-auto scrollbar-hidden">
                    
                    {/* Title Section */}
                    <div className="text-center space-y-2">
                  {selectedDesign.name && (
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                      {selectedDesign.name}
                    </h3>
                  )}
                      <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-neutral-100">
                        {selectedDesign?.title}
                      </h2>

                      <div className="inline-flex gap-3 items-center justify-center text-sm font-medium">
                        <p className="px-3 py-1 border border-neutral-200 dark:border-neutral-700 rounded-full tracking-wide">
                          Type - {selectedDesign?.type}
                        </p>
                        <p className="px-3 py-1 border border-neutral-200 dark:border-neutral-700 rounded-full tracking-wide">
                          Category - {selectedDesign.category}
                        </p>
                      </div>
                    </div>

                    {/* Status Section */}
                    <div className="flex justify-center items-center gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {selectedDesign.status === "approved" ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : selectedDesign.status === "pending" ? (
                        <Timer className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="capitalize">{selectedDesign.status}</span>
                    </div>

                  

                    {/* Media Gallery Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                        Gallery
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-8">


                        {selectedDesign.files.map((file, index) => (
                          <div
                            key={index}
                            className="relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 shadow group"
                          >

                              {/* Status Ribbon */}
                              <div
                              className={`
                                absolute left-[-28px] top-[10px] w-[100px] rotate-[-45deg] text-center text-[10px] font-semibold py-[3px] z-10 shadow
                                ${file.status === 'approved' ? 'bg-green-600' : ''}
                                ${file.status === 'rejected' ? 'bg-red-600' : ''}
                                ${!file.status || file.status === 'pending' ? 'bg-yellow-500' : ''}
                              `}
                            >

                              {file.status?.toUpperCase() || 'PENDING'}
                            </div>

                            {/* Points Badge - only show if approved */}
                            {file.status === "approved" && file.points > 0 && (
                              <div className="absolute bottom-2 right-2 z-10 px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-800/40 dark:text-blue-200 text-[11px] font-semibold rounded-full shadow backdrop-blur-sm">
                                {file.points} pts
                              </div>
                            )}

                            {isImage(file.url) ? (
                              <div className="relative group">
                                <img
                                  src={`${imgurl}${file.url}`}
                                  alt={`Portfolio image ${index + 1}`}
                                  className="w-full h-64 object-cover rounded-lg group-hover:scale-105 transition-transform"
                                />
                                <Image className="absolute top-2 right-2 w-6 h-6 text-white bg-black bg-opacity-50 rounded-full p-1" />
                              </div>
                            ) : isVideo(file.url) ? (
                              <div className="relative group">
                                <video
                                  controls
                                  src={`${imgurl}${file.url}`}
                                  className="w-full h-64 object-cover rounded-lg"
                                />
                                <Video className="absolute top-2 right-2 w-6 h-6 text-white bg-black bg-opacity-50 rounded-full p-1" />
                              </div>
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
                      Uploaded on {new Date(selectedDesign.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Close Button at the Bottom */}
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="outline"
                      onClick={handleClosePortfolioPopover}
                      className="cursor-pointer"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}


          </div>
  );
};

export default Userdesignuploadcon;
