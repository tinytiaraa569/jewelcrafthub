import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import FileUpload from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { backendurl, imgurl } from '@/server';
import axios from 'axios';
import {Image , File, Trash2, UploadCloud, Video, X, MoreVertical, Tag } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from "react-hook-form";
import { toast } from 'sonner';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import swal from "sweetalert";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { FaEye, FaTrash } from 'react-icons/fa6';
import { FaEdit } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { sendNotificationToRole, sendNotificationToUsers } from '@/redux/action/usernotification';
import { useSelector } from 'react-redux';
import { createAdminNotification } from '@/redux/action/adminNotificationActions';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RiCheckboxCircleFill, RiCloseCircleFill, RiLockUnlockLine, RiSave3Line } from 'react-icons/ri';
import { MdOutlineLockPerson } from "react-icons/md";

const AdminBriefs = () => {
  const { adminUser } = useSelector((state) => state.adminAuth);
    
    const { register, handleSubmit, formState: { errors }, reset ,setValue , control } = useForm();
    const [editBriefData, setEditBriefData] = useState(null);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [briefs, setBriefs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const [selectedBrief, setSelectedBrief] = useState(null); 
    const dispatch = useDispatch()


    const [visiblePopoverOpen, setVisiblePopoverOpen] = useState(false);
    const [currentBriefId, setCurrentBriefId] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleToUsers, setVisibleToUsers] = useState({}); // Map briefId => [userId]

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${backendurl}/admin/all-users`, {
          withCredentials: true,
        });
        setUsers(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      fetchUsers();
    }, []);

    const handleOpenVisibleToPopover = async (briefId) => {
      try {
        setCurrentBriefId(briefId);
        setVisiblePopoverOpen(true);
        setLoading(true);
    
        // Fetch the specific brief to get its visibleTo list
        const { data } = await axios.get(`${backendurl}/brief/briefs-visible/${briefId}`, {
          withCredentials: true,
        });
    
        const brief = data?.brief;
        if (brief) {
          setVisibleToUsers((prev) => ({
            ...prev,
            [briefId]: brief.visibleTo?.map((user) => user._id) || [],
          }));
        }
      } catch (error) {
        console.error("Failed to fetch brief details:", error);
        toast.error("Failed to fetch brief details.");
      } finally {
        setLoading(false);
      }
    };

    const toggleUserVisibility = (userId) => {
      setVisibleToUsers(prev => {
        const currentUsers = prev[currentBriefId] || [];
        const updated = currentUsers.includes(userId)
          ? currentUsers.filter(id => id !== userId)
          : [...currentUsers, userId];
        return { ...prev, [currentBriefId]: updated };
      });
    };
    

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const res = await axios.get(`${backendurl}/category/all-categories`)
          setCategories(res.data.categories || [])
        } catch (err) {
          toast.error('Failed to fetch categories')
        }
      }

      fetchCategories();
    }, []);
    console.log(categories,'categories')
    
    const handleOpenPopover = () => setIsPopoverOpen(true);

    const handleClosePopover = () => {
        setIsPopoverOpen(false);  // Close the popover
        setUploadedFiles([]);     // Clear uploaded images
        reset();  
        setEditBriefData(null);                // Reset form values
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      const handleFilesSelected = (files) => {
        setUploadedFiles((prev) => [...prev, ...files]);
      };
    
      const removeFile = (index) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
      };

      const handleStatusChange = (value) => {
        console.log("Selected status:", value); // You can use this to trigger any custom logic when the value changes
        setValue("statusmap", value); // This ensures react-hook-form keeps the value in sync
      };

      const fetchBriefs = async () => {
        try {
          const { data } = await axios.get(`${backendurl}/brief/get-all-briefs`, {
            withCredentials: true,
          });
          setBriefs(data.briefs);
        } catch (error) {
          console.error("Error fetching briefs:", error);
        } 
      };

      useEffect(() => {
        fetchBriefs();
      }, []);

      const onSubmit = async (data) => {
        try {
          if (uploadedFiles.length === 0 && !editBriefData) {
            toast.error("Please upload at least one image, video, or file.");
            return;
          }
      
          const base64Files = await Promise.all(
            uploadedFiles.map(async (file) => {
              const isLocalFile = typeof Blob !== "undefined" && file instanceof Blob;
              
              if (isLocalFile) {
                return {
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  content: await convertFileToBase64(file),
                };
              } else {
                // Already uploaded file, just keep the existing structure
                return file;
              }
            })
          );
      
          const updatedCategory = {};
          categories.forEach((cat) => {
            const shortform = cat.categoryShortform;
            const fullCategory = cat.categoryName;
            updatedCategory[fullCategory] = !!data.category?.[shortform];
          });
      
          const payload = {
            name: data.name,
            title: data.title,
            instruction: data.instruction,
            targetdate: data.targetdate,
            targetcount: data.targetcount,
            rewardPoints: data.rewardPoints,
            statusmap: data.statusmap,
            styling: data.styling,
            dimension: data.dimension,
            pearlsize: data.pearlsize,
            diamondweightrange: data.diamondweightrange,
            diamondshapes: data.diamondshapes,
            colorstonerange: data.colorstonerange,
            colorstoneshape: data.colorstoneshape,
            category: updatedCategory,
            files: base64Files,
          };
      
          if (editBriefData) {
            console.log(payload, 'editing data');
            await axios.put(`${backendurl}/brief/brief-edit/${editBriefData._id}`, payload, {
              withCredentials: true,
            });
            toast.success("Brief updated successfully!");
          } else {
            await axios.post(`${backendurl}/brief/brief/create`, payload, {
              withCredentials: true,
            });
            toast.success("Brief created successfully!");
           
            dispatch(
              createAdminNotification(
                adminUser?._id,
                "Brief Uploaded",
                `(${adminUser?.name || adminUser?.email ||"A user"}) ${adminUser?.role} has uploaded a new project brief.`,
                "check"
              )
            )
          }
      
          handleClosePopover();
          fetchBriefs();
        } catch (error) {
          console.error("Error submitting brief:", error);
          toast.error("Failed to submit brief. Please try again.");
        }
      };
      
      

      const handleToggleLive = async (id, isLive) => {
        try {
          // Update the 'isLive' field
          await axios.put(`${backendurl}/brief/toggle-brief-live/${id}`, { isLive: !isLive }, { withCredentials: true });
          fetchBriefs();  // Re-fetch the list of briefs after update
      
          // Show success toast message with correct status
          if (!isLive) {
            toast.success("Brief is now live!");  // If isLive was false, it is now set to true
          } else {
            toast.success("Brief is no longer live!");  // If isLive was true, it is now set to false
          }
        } catch (err) {
          console.error("Failed to toggle live status", err);
          
          // Show error toast message
          toast.error("Failed to update live status. Please try again.");
        }
      };
      
      
    
      const handleDelete = async (id) => {
        swal({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this brief!",
          icon: "warning",
          buttons: ["Cancel", "Delete"],
          dangerMode: true,
        }).then(async (willDelete) => {
          if (willDelete) {
            try {
              await axios.delete(`${backendurl}/brief/brief-delete/${id}`, { withCredentials: true });
              fetchBriefs();
              toast.success("Brief has been deleted!")
             
            } catch (err) {
              console.error("Failed to delete brief", err);
              toast.error("Failed to delete the brief")
              
            }
          }
        });
      };


      const handleViewDetails = (brief) => {
        setSelectedBrief(brief); // Set the selected brief for modal
        setIsModalOpen(true); // Open the modal
      };
    
      const columns = [
        {
          accessorKey: "name",
          header: "Name",
          cell: info => info.getValue(),
        },
        {
          accessorKey: "title",
          header: "Title",
          cell: info => info.getValue(),
        },
        {
          accessorKey: "targetdate",
          header: "Target Date",
          cell: info => {
            const targetDate = new Date(info.getValue());
            const currentDate = new Date();
            
            // Check if the target date has passed
            if (targetDate < currentDate) {
              return <span className="text-red-500">Closed</span>;
            }
            
            // Otherwise, display the target date in the local date format
            return targetDate.toLocaleDateString();
          },
        },
        {
          accessorKey: "isLive",
          header: "Live",
          cell: ({ row }) => (
            <Switch
              checked={row.original.isLive}
              onCheckedChange={() => handleToggleLive(row.original._id, row.original.isLive)}
            />
          ),
        },
        {
          header: "Actions",
          id: "actions",
          cell: ({ row }) => (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='dark:bg-neutral-900 dark:border dark:border-neutral-700'>

            <DropdownMenuItem 
            onClick={() => handleOpenVisibleToPopover(row.original._id)}
            className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <MdOutlineLockPerson className="mr-2 text-neutral-500 hover:text-neutral-700 w-5 h-5" />
            Manage Visibility
          </DropdownMenuItem>


              {/* View Details */}
              <DropdownMenuItem 
                onClick={() => handleViewDetails(row.original)} 
                className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <FaEye className="mr-2 text-blue-500 hover:text-blue-700" />
                View Details
              </DropdownMenuItem>
          
              {/* Edit */}
              <DropdownMenuItem 
                onClick={() => handleEdit(row.original)} 
                className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <FaEdit className="mr-2 text-neutral-500 hover:text-neutral-700" />
                Edit
              </DropdownMenuItem>
          
              {/* Delete */}
              <DropdownMenuItem 
                onClick={() => handleDelete(row.original._id)} 
                className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <FaTrash className="mr-2 text-red-500 hover:text-red-700" />
                <span className="text-red-500 hover:text-red-700">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          ),
        },
      ];
    
      const table = useReactTable({
        data: briefs,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
          pagination: {
            pageSize: 12,
          },
        },
      });



      const handleEdit = (brief) => {
        console.log(brief,"brief ")
        setEditBriefData(brief);
        setIsPopoverOpen(true);
      
        // Pre-fill form fields
        setValue("name", brief.name || "");
        setValue("title", brief.title || "");
        setValue("instruction", brief.instruction || "");
        setValue("targetdate", brief.targetdate?.slice(0, 10) || ""); // format for input type="date"
        setValue("targetcount", brief.targetcount || "");
        setValue("rewardPoints", brief.rewardPoints || "");
        setValue("statusmap", brief.statusmap || "");
        setValue("styling", brief.styling || "");
        setValue("dimension", brief.dimension || "");
        setValue("pearlsize", brief.pearlsize || "");
        setValue("diamondweightrange", brief.diamondweightrange || "");
        setValue("diamondshapes", brief.diamondshapes || "");
        setValue("colorstonerange", brief.colorstonerange || "");
        setValue("colorstoneshape", brief.colorstoneshape || "");
      
        // Pre-check categories
        if (brief.category) {
          Object.keys(brief.category).forEach((fullCatName) => {
            const shortform = categories.find((cat) => cat.categoryName === fullCatName)?.categoryShortform;
            if (shortform) {
              setValue(`category.${shortform}`, brief.category[fullCatName]);
            }
          });
        }
      
        // Refill uploaded files if needed (optional, assuming you can decode them)
        setUploadedFiles(brief.files || []);
      };
      const isImage = (url) => {
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
        return validExtensions.some((ext) => url.toLowerCase().endsWith(ext));
      };
       const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);
       console.log(selectedBrief,"selected brief")

       const handleUpdateVisibleUsers = async () => {
        try {
          const response = await axios.put(
            `${backendurl}/brief/briefs/${currentBriefId}/visible-users`,
            {
              visibleTo: visibleToUsers[currentBriefId] || [],
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
      
          toast.success("Brief Visibility for Users updated successfully");
          // dispatch(
          //   sendNotificationToRole(
          //     "Approved",
          //     "New Project Brief!",
          //     "A new brief has been uploaded. Check it out!",
          //     "info"
          //   )
          // );
          dispatch(
            sendNotificationToUsers(
              visibleToUsers[currentBriefId],
              "New Project Brief!",
              "A new brief has been uploaded. Check it out!",
              "info"
            )
          );
          setVisiblePopoverOpen(false);
        } catch (err) {
          console.error(err);
          toast.error("Failed to update users");
        }
      };
      const approveAllUsers = () => {
        // Get all approved users
        const approvedUsers = users.filter((user) => user.status === "Approved");
      
        // Update the visibleToUsers state for the current brief with all approved users
        setVisibleToUsers((prev) => ({
          ...prev,
          [currentBriefId]: approvedUsers.map((user) => user._id),
        }));
      };

       console.log(users,'users')

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header Section */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Sketch Brief Upload</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload design briefs, concept sketches, or client references to streamline your workflow.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleOpenPopover}
          className="cursor-pointer mt-2 sm:mt-0 dark:bg-neutral-800 dark:border-neutral-700"
        >
          <UploadCloud className="w-5 h-5 mr-2" />
          Upload Sketch Brief
        </Button>
      </div>



      <div className="w-full p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl shadow-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>




      {isPopoverOpen && (
        <div className="fixed inset-0 bg-[#000000b7] bg-opacity-50 flex items-center justify-center z-50 min-h-screen">
          <div className="relative w-full max-w-3xl p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg">
            <h1>Breif Infromation</h1>
            <button onClick={handleClosePopover} className="cursor-pointer absolute top-4 right-4 text-muted-foreground">
              <X className="w-6 h-6" />
            </button>
            <div className="max-h-[85vh] overflow-y-auto scrollbar-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Project Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                id="title"
                placeholder="Enter project title (eg. Fancy Shape)"
                className="text-sm"  // Make placeholder text smaller
                {...register("title", { required: "Project title is required" })}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Project Name */}
            <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                id="name"
                placeholder="Enter project name eg.(FNCYSHP2504-02)"
                className="text-sm"  // Make placeholder text smaller
                {...register("name", { required: "Project name is required" })}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            </div>

            {/* Category Checkbox */}
            <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-wrap items-center gap-4">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center space-x-2 cursor-pointer">
                <label htmlFor={cat.categoryShortform} className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name={`category.${cat.categoryShortform}`}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        id={cat.categoryShortform}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <span>{cat.categoryName}</span>
                </label>
              </div>
            ))}

            </div>
          </div>
              {/* Styling */} 
            <div className="space-y-2">
            <Label htmlFor="styling">Styling</Label>
            <Textarea
                id="styling"
                placeholder="Enter styling details"
                {...register("styling", { required: "Styling is required" })}
                rows={3}
            />
            {errors.styling && <p className="text-red-500 text-sm mt-1">{errors.styling.message}</p>}
            </div>

            {/* Dimension */}
            <div className="space-y-2">
            <Label htmlFor="dimension">Dimension</Label>
            <Input
                id="dimension"
                placeholder="Enter dimension"
                {...register("dimension", { required: "Dimension is required" })}
            />
            {errors.dimension && <p className="text-red-500 text-sm mt-1">{errors.dimension.message}</p>}
            </div>

            {/* Target Count */}
            <div className="space-y-2">
            <Label htmlFor="targetcount">Target Count</Label>
            <Input
                id="targetcount"
                placeholder="Enter target count"
                {...register("targetcount", { required: "Target count is required" })}
            />
            {errors.targetcount && <p className="text-red-500 text-sm mt-1">{errors.targetcount.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Target Date (Date Picker) */}
            <div className="space-y-2">
            <Label htmlFor="targetdate">Target Date</Label>
            <input
                type="date"
                id="targetdate"
                {...register("targetdate", { required: "Target date is required" })}
                className="w-full border rounded-md p-2"
            />
            {errors.targetdate && <p className="text-red-500 text-sm mt-1">{errors.targetdate.message}</p>}
            </div>

              {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="statusmap">Select Status</Label>

              <Controller
                name="statusmap"
                control={control}
                rules={{ required: "Please select a status" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full border rounded-md p-2">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.statusmap && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.statusmap.message}
                </p>
              )}
            </div>

            </div>

            {/* Diamond Shapes */}
            <div className="space-y-2">
            <Label htmlFor="diamondshapes">Diamond Shapes & Sizes</Label>
            <Textarea
                id="diamondshapes"
                placeholder="Enter diamond shapes & Sizes"
                {...register("diamondshapes", { required: "Diamond shapes are required" })}
                rows={2} // Optional: Adjust the number of rows for the textarea height
            />
            {errors.diamondshapes && <p className="text-red-500 text-sm mt-1">{errors.diamondshapes.message}</p>}
            </div>

             {/* Diamond Weight Range */}
            <div className="space-y-2">
            <Label htmlFor="diamondweightrange">Diamond Weight Range</Label>
            <Input
                id="diamondweightrange"
                placeholder="Enter diamond weight range"
                {...register("diamondweightrange", { required: "Diamond weight range is required" })}
            />
            {errors.diamondweightrange && <p className="text-red-500 text-sm mt-1">{errors.diamondweightrange.message}</p>}
            </div>

            {/* Color Stone Shape */}
            <div className="space-y-2">
            <Label htmlFor="colorstoneshape">Color Stone Shape</Label>
            <Textarea
                id="colorstoneshape"
                placeholder="Enter color stone shape & Sizes"
                {...register("colorstoneshape", { required: "Color stone shape is required" })}
                rows={2} // Sets the number of rows (height) to 2 lines
            />
            {errors.colorstoneshape && <p className="text-red-500 text-sm mt-1">{errors.colorstoneshape.message}</p>}
            </div>

              {/* Color Stone Range */}
            <div className="space-y-2">
                <Label htmlFor="colorstonerange">Color Stone Range</Label>
                <Input
                    id="colorstonerange"
                    placeholder="Enter color stone weight range "
                    {...register("colorstonerange", { required: "Color stone range is required" })}
                />
                {errors.colorstonerange && <p className="text-red-500 text-sm mt-1">{errors.colorstonerange.message}</p>}
            </div>


            {/* Pearl Size */}
            <div className="space-y-2">
            <Label htmlFor="pearlsize">Pearl Size</Label>
            <Input
                id="pearlsize"
                placeholder="Enter pearl size"
                {...register("pearlsize", { required: "Pearl size is required" })}
            />
            {errors.pearlsize && <p className="text-red-500 text-sm mt-1">{errors.pearlsize.message}</p>}
            </div>

            {/* Rewards points */}
            <div className="space-y-2">
            <Label htmlFor="rewardPoints">Reward Points</Label>
            <Input
                id="rewardPoints"
                type="text" // Ensures only numbers can be entered
                placeholder="Enter reward points"
                {...register("rewardPoints")} // No validation needed here
            />
            </div>

            {/* Instructions */}
            <div className="space-y-2">
            <Label htmlFor="instruction">Instruction</Label>
            <Textarea
                id="instruction"
                placeholder="Enter instructions"
                {...register("instruction")}
                rows={2}
            />
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
                <Label>Upload Files</Label>
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

                {/* Images Tab */}
                <TabsContent value="images">
                    <FileUpload onFilesSelected={handleFilesSelected} accept="image/*" />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                    {uploadedFiles
                      .filter(
                        (file) =>
                          file?.type?.startsWith("image/") || file?.url?.match(/\.(jpeg|jpg|png|webp)$/)
                      )
                      .map((file, index) => {
                        const isLocalFile = typeof Blob !== "undefined" && file instanceof Blob;

                        return (
                          <div key={index} className="relative">
                            <img
                              src={isLocalFile ? URL.createObjectURL(file) : `${imgurl}${file.url}`}
                              alt={file.name || `image-${index}`}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}

                    </div>
                </TabsContent>

                {/* Videos Tab */}
                <TabsContent value="videos">
                  <FileUpload onFilesSelected={handleFilesSelected} accept="video/*" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {uploadedFiles
                      .filter((file) => file?.type?.startsWith("video/") || file?.url?.match(/\.(mp4|mov|webm)$/))
                      .map((file, index) => {
                        const isLocalFile = typeof Blob !== "undefined" && file instanceof Blob;
                        const videoSrc = isLocalFile ? URL.createObjectURL(file) : `${imgurl}${file.url}`;

                        return (
                          <div key={index} className="relative">
                            <video controls className="w-full h-40 object-cover rounded-lg">
                              <source src={videoSrc} type={file.type || "video/mp4"} />
                            </video>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </TabsContent>


                {/* CAD Files Tab */}
                <TabsContent value="files">
                  <FileUpload onFilesSelected={handleFilesSelected} accept=".cad,.stl,.obj" />
                  <div className="mt-4">
                    {uploadedFiles
                      .filter((file) => {
                        const isImage = file?.type?.startsWith("image/");
                        const isVideo = file?.type?.startsWith("video/");
                        return !isImage && !isVideo;
                      })
                      .map((file, index) => {
                        const isLocalFile = typeof Blob !== "undefined" && file instanceof Blob;
                        const filename = isLocalFile ? file.name : file.url?.split("/").pop();

                        return (
                          <div key={index} className="flex items-center gap-2 border rounded-lg p-2">
                            <File className="w-6 h-6 text-gray-500" />
                            <p className="truncate">{filename}</p>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 ml-auto"
                            >
                              <Trash2 />
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </TabsContent>

                </Tabs>
            </div>


        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end gap-4 sm:col-span-2">
          <Button type="submit" className="cursor-pointer">Submit</Button>
          <Button
            type="button"
            onClick={handleClosePopover}
            variant="destructive"
            className="dark:bg-red-500 cursor-pointer hover:dark:bg-red-400"
          >
            Cancel
          </Button>
        </div>

      </form>
          </div>

          </div>
        </div>
      )}




    {isModalOpen && selectedBrief && (
      <div className="fixed inset-0 bg-[#000000be] bg-opacity-30 flex items-center justify-center z-50 min-h-screen">
        <div className="relative w-full max-w-4xl p-6 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="cursor-pointer absolute top-4 right-4 text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 hover:dark:text-neutral-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Scrollable Content */}
          <div className="max-h-[80vh] overflow-y-auto space-y-5 scrollbar-hidden">
            
            {/* Title Section */}
            <h3 className="text-center text-lg font-semibold text-neutral-900 dark:text-white">
              Concept Brief - {selectedBrief.title}
            </h3>
            <h2 className="text-xl text-center font-extrabold tracking-tight text-slate-900 dark:text-neutral-100">
              {selectedBrief?.name}
            </h2>

            {/* Categories Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Categories</h4>
              <div className="flex flex-wrap gap-4">
                {Object.entries(selectedBrief.category)
                  .filter(([key, value]) => value) // Filter out categories with false values
                  .map(([categoryKey], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 px-4 bg-neutral-100 border border-neutral-200 dark:bg-neutral-700 dark:border-neutral-700 rounded-xl shadow-md hover:scale-105 transition-all cursor-pointer hover:bg-blue-100 dark:hover:bg-neutral-600"
                    >
                      <Tag className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                      <span className="ml-2 text-xs font-medium text-neutral-700 dark:text-neutral-200">
                        {categoryKey}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Reference Images Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Reference Images</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedBrief?.files?.map((file, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 shadow group"
                  >
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

            {/* Styling Section */}
            {selectedBrief?.styling && (
              <div className="flex items-center justify-start gap-4 border-t border-neutral-300 dark:border-neutral-700 pt-6 mt-6">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Styling</h4>
                <p className="text-neutral-700 dark:text-neutral-300 text-xs leading-relaxed">
                  {selectedBrief?.styling}
                </p>
              </div>
            )}

            {/* Dimension Section */}
            {selectedBrief?.dimension && (
              <div className="flex items-center justify-start gap-4 border-t border-neutral-300 dark:border-neutral-700 pt-6 mt-6">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Dimension</h4>
                <p className="text-neutral-700 dark:text-neutral-300 text-xs leading-relaxed">
                  {selectedBrief?.dimension}
                </p>
              </div>
            )}

            {/* Target Count & Date Section */}
            <div className="border-t border-neutral-300 dark:border-neutral-700 pt-4">
              {selectedBrief?.targetcount && (
                <div className="flex items-center justify-start gap-3 py-1.5">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Target Count</h4>
                  <p className="text-neutral-700 dark:text-neutral-300 text-xs">{selectedBrief?.targetcount}</p>
                </div>
              )}

              {selectedBrief?.targetdate && (
                <div className="flex items-center justify-start gap-3 py-1.5">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Target Date</h4>
                  <p className="text-neutral-700 dark:text-neutral-300 text-xs">{selectedBrief?.targetdate}</p>
                </div>
              )}
            </div>

            {/* Diamond Details */}
            <div className="space-y-4 border-t border-neutral-300 dark:border-neutral-700 pt-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Diamond Details</h4>
              {selectedBrief?.diamondshapes && (
                <div className="flex items-center justify-start gap-3 ">
                  <strong className="text-sm text-neutral-700 dark:text-neutral-300">Diamond Shapes & Sizes:</strong>
                  <p className="text-neutral-700 dark:text-neutral-300 text-xs">{selectedBrief.diamondshapes}</p>
                </div>
              )}
              {selectedBrief?.diamondweightrange && (
                <div className="flex items-center justify-start gap-3 ">
                  <strong className="text-sm text-neutral-700 dark:text-neutral-300">Diamond Weight Range:</strong>
                  <p className="text-neutral-700 dark:text-neutral-300 text-xs">{selectedBrief.diamondweightrange}</p>
                </div>
              )}
            </div>

            {/* Color Stone Details */}
            <div className="space-y-4 border-t border-neutral-300 dark:border-neutral-700 pt-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Color Stone Details</h4>
              {selectedBrief?.colorstoneshape && (
                <div className="flex items-center justify-start gap-3">
                  <strong className="text-sm  text-neutral-700 dark:text-neutral-300">Color Stone Shapes & Sizes:</strong>
                  <p className="text-neutral-700 dark:text-neutral-300 text-xs">{selectedBrief.colorstoneshape}</p>
                </div>
              )}
              {selectedBrief?.colorstonerange && (
                <div className="flex items-center justify-start gap-3">
                  <strong className="text-sm  text-neutral-700 dark:text-neutral-300">Color Stone Weight Range:</strong>
                  <p className="text-neutral-700 dark:text-neutral-300 text-xs">{selectedBrief.colorstonerange}</p>
                </div>
              )}
            </div>

            {/* Pearl Size, Status Map, Instructions, and Reward Points */}
            <div className="space-y-4 mt-6 border-t border-neutral-300 dark:border-neutral-700 mb-5">
              <div className="flex items-center justify-start gap-3 py-3">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Pearl Size:</h4>
                <p className="text-neutral-700 dark:text-neutral-300 text-xs">{selectedBrief.pearlsize}</p>
              </div>
              <div className="flex items-center justify-start gap-3 py-1.5 border-t border-neutral-300 dark:border-neutral-700">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Status Map:</h4>
                <p className="text-neutral-700 dark:text-neutral-300 text-xs">{selectedBrief.statusmap}</p>
              </div>
              <div className="flex items-center justify-start gap-3 py-1.5 border-t border-neutral-300 dark:border-neutral-700">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Reward Points:</h4>
                <p className="text-neutral-700 dark:text-neutral-300 text-xs">{selectedBrief.rewardPoints}</p>
              </div>
              <div className="flex items-center justify-start gap-3 py-1.5 border-t border-neutral-300 dark:border-neutral-700 ">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">Instruction:</h4>
                <p className="text-neutral-700 dark:text-neutral-300 text-xs">{selectedBrief.instruction}</p>
              </div>
              
            </div>
          </div>

          <div className='mt-4 flex justify-end'>
          <Button className='cursor-pointer' onClick={()=>{setIsModalOpen(false)}}>Cancel</Button>

          </div>

        </div>
      </div>
    )}


    {visiblePopoverOpen && (
      <div className="fixed inset-0 bg-[#000000be] backdrop-blur-sm flex items-center justify-center z-50 min-h-screen">
        <div className="relative w-full max-w-4xl p-6 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Brief Information - Visible To
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                If you turn this on, the user will be able to see this brief and submit accordingly.
              </p>
            </div>

            <button
              onClick={() => setVisiblePopoverOpen(false)}
              className="cursor-pointer text-muted-foreground hover:text-neutral-600 dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Select All Button */}
          <div className='flex justify-end mb-4'>
            <Button
              onClick={approveAllUsers}
              className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition flex items-center"
            >
              <RiCheckboxCircleFill className="" />
              Select All
            </Button>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-700 mb-6">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading users...</div>
            ) : users.filter(user => user.status === "Approved").length === 0 ? (
              <div className="text-sm text-muted-foreground">No approved users found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {users
                  .filter(user => user.status === "Approved")
                  .map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={`${imgurl}${user.avatar}`} />
                          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Credit: {user?.points || 0}</p>
                        </div>
                      </div>
                      <Switch
                        checked={visibleToUsers[currentBriefId]?.includes(user._id)}
                        onCheckedChange={() => toggleUserVisibility(user._id)}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Footer - Action Buttons */}
          <div className="flex justify-end space-x-3">
            
            <button
              onClick={() => setVisiblePopoverOpen(false)}
              className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-600 transition flex items-center"
            >
              <RiCloseCircleFill className="mr-2" />
              Cancel
            </button>
            <button
              onClick={handleUpdateVisibleUsers}
              className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition flex items-center"
            >
              <RiSave3Line className="mr-2" />
              Update Users
            </button>
          </div>
        </div>
      </div>
    )}

  
    </div>
  )
}

export default AdminBriefs
