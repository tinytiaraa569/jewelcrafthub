import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendurl, imgurl } from '@/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, EyeOff, Image, RefreshCcw, Search, Timer, UploadCloud, Video, X, XCircle } from 'lucide-react';
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
} from 'react-icons/ai';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';


const statusIcons = {
  pending: {
    label: 'Pending',
    icon: <AiOutlineClockCircle className="mr-1 text-yellow-600" />,
    color: 'bg-yellow-100 text-yellow-800',
  },
  approved: {
    label: 'Approved',
    icon: <AiOutlineCheckCircle className="mr-1 text-green-600" />,
    color: 'bg-green-100 text-green-800',
  },
  rejected: {
    label: 'Rejected',
    icon: <AiOutlineCloseCircle className="mr-1 text-red-600" />,
    color: 'bg-red-100 text-red-800',
  },
};

const Alldesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [Categories, setCategories] = useState([]);

  const [selectedDesign, setSelectedDesign] = useState(null);
      const [isDesignDetailsPopoverOpen, setIsDesignDetailsPopoverOpen] = useState(false);
  

  const fetchDesigns = async () => {
    try {
      const { data } = await axios.get(
        `${backendurl}/userdesign/user-design/all-designs`,
        { withCredentials: true }
      );
      setDesigns(data.designs);
      setFiltered(data.designs);
    } catch (error) {
      console.error('Failed to fetch designs:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/category/all-categories`);
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchDesigns();
    fetchCategories();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const result = designs.filter((item) => {
      const matchesSearch = item.title?.toLowerCase().includes(lowerSearch);
      const matchesType = filterType !== 'all' ? item.type?.toLowerCase() === filterType.toLowerCase() : true;
      const matchesCategory = filterCategory !== 'all'
        ? item.category?.toLowerCase() === filterCategory.toLowerCase()
        : true;
      const matchesStatus = filterStatus !== 'all'
        ? item.status?.toLowerCase() === filterStatus.toLowerCase()
        : true;

      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
    setFiltered(result);
  }, [search, filterType, filterCategory, filterStatus, designs]);

  const handledesigndetailOpenPortfolioPopover = (id) => {
    console.log(id, "sdsjnkjugy");
    const filteredDesign = designs.find((design) => design?._id === id); // Filter design by ID
    setSelectedDesign(filteredDesign);
    setIsDesignDetailsPopoverOpen(true);
  };
  const [matchResult, setMatchResult] = useState([]);
  const [showSimilarity, setShowSimilarity] = useState(false);

  const handleClosePortfolioPopover = () =>{
    setIsDesignDetailsPopoverOpen(false);
    setMatchResult([])
    setShowSimilarity(false)

  }

  // Check if URL is an image or video based on extension
 const isImage = (url) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
 const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

 console.log(selectedDesign,"slelected design")

//  const handleCheckSimilarity = async () => {
//   try {
//     // Filter only image files
//     const imageFiles = selectedDesign.files.filter(file => isImage(file.url));

//     // Map to actual URLs
//     const imageUrls = imageFiles.map(file => `${imgurl}${file.url}`);

//     console.log(imageUrls,"image url")

   
//   } catch (err) {
//     console.error("Error checking similarity:", err);
//   }
// };


const handleCheckSimilarity = async () => {
  setShowSimilarity(true);
  try {
    // Filter out all image files
    const imageFiles = selectedDesign.files.filter(file => isImage(file.url));

    if (imageFiles.length === 0) {
      console.warn("No image files found in selected design.");
      return;
    }

    const results = [];

    // Loop through each image file and send a request
    for (const imageFile of imageFiles) {
      const fullImageUrl = `${imgurl}${imageFile.url}`;
      console.log("🔍 Checking image:", fullImageUrl);

      const res = await fetch(`${backendurl}/userdesign/check-similarity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: fullImageUrl }),
      });

      const data = await res.json();
      console.log(data,"after chcekign ----------")
      console.log("✅ Match for:", imageFile.url, data);
      results.push({
        file: imageFile.url,
        matches: data.matches || [] // always an array
      });
    }

    // Store all match results
    setMatchResult(results); // make sure to use a plural state like: const [matchResults, setMatchResults] = useState([]);

  } catch (error) {
    console.error("❌ Error checking similarities:", error);
  }
};

const handleStatusChange = (fileIndex, status) => {
  const updatedFiles = [...selectedDesign.files];
  updatedFiles[fileIndex].status = status;
  setSelectedDesign({ ...selectedDesign, files: updatedFiles });
};

const handleUpdateStatuses = async () => {
  if (!selectedDesign) return;

  const payload = {
    updatedFiles: selectedDesign.files.map(file => ({
      url: file.url,
      status: file.status || "pending", // fallback to pending
    })),
  };

  try {
    const { data } = await axios.patch(
      `${backendurl}/userdesign/update-file-status/${selectedDesign._id}`,
      payload,
      { withCredentials: true }
    );

    toast.success("Statuses updated successfully");
     // ✅ Update selectedDesign with the new status and files
     setSelectedDesign(prev => ({
      ...prev,
      status: data.design.status,
      files: data.design.files,
      allpoints: data.design.allpoints,
    }));
    fetchDesigns(); // refresh list

  } catch (err) {
    console.error("❌ Failed to update statuses:", err);
    toast.error("Failed to update statuses");
  }
};

const handleApproveAll = () => {
  const updatedFiles = selectedDesign.files.map((file) => ({
    ...file,
    status: 'approved',
  }));

  setSelectedDesign((prev) => ({
    ...prev,
    files: updatedFiles,
  }));
};


  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">All Designs Uploaded</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload design briefs, concept sketches, or client references to streamline your workflow.
          </p>
        </div>
        
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3"
        />

        <Select onValueChange={(val) => setFilterType(val)} value={filterType}>
          <SelectTrigger className="w-full sm:w-1/4">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="cad design">CAD Design</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => setFilterCategory(val)} value={filterCategory}>
          <SelectTrigger className="w-full sm:w-1/4">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Categories.map((cat) => (
              <SelectItem key={cat._id} value={cat.categoryName}>
                {cat.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => setFilterStatus(val)} value={filterStatus}>
          <SelectTrigger className="w-full sm:w-1/4">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-neutral-800">
              <TableHead className="min-w-[200px] font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Uploaded At</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((design) => (
              <TableRow key={design._id} className="hover:bg-muted transition-all duration-200">
                <TableCell className="font-medium">{design.title}</TableCell>
                <TableCell>{design.type}</TableCell>
                <TableCell>{design.category}</TableCell>
                <TableCell>
                  <Badge
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${statusIcons[design.status]?.color}`}
                  >
                    {statusIcons[design.status]?.icon}
                    {statusIcons[design.status]?.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {new Date(design.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handledesigndetailOpenPortfolioPopover(design?._id)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm py-6 text-muted-foreground">
                  No designs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>



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
                        {selectedDesign?.selectedBrief?.name && (
                          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                            {selectedDesign?.selectedBrief?.name}
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
                            {selectedDesign?.allpoints >=0 && (
                              <>
                              -
                              </>
                            )}
                            {/* ✅ Show total points based on approved files */}
                            {selectedDesign?.allpoints >=0 && (
                               <span className=" px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300">
                                {selectedDesign.allpoints} points
                              </span>
                            )}
                          </div>
      
                          {/* Media Gallery Section */}
                          <div className="space-y-4">
                            {/* <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                              Uploaded Images
                            </h3> */}
                            <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                                    Uploaded Images
                                  </h3>
                                  <Button
                                  onClick={handleApproveAll}
                                  className="cursor-pointer text-xs px-3 py-1 bg-green-600 text-white rounded-[8px] hover:bg-green-700 transition flex items-center gap-2"
                                >
                                  <CheckCircle size={12} />
                                  Approve All
                                </Button>
                                </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              {selectedDesign.files.map((file, index) => (
                                <div
                            key={index}
                            className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg group bg-white dark:bg-neutral-900 transition-transform hover:scale-[1.01]"
                          >
                            {/* Diagonal Ribbon Badge */}
                            <div
                            className={`absolute left-[-28px] top-[10px] w-[100px] rotate-[-45deg] text-center text-[10px] font-semibold py-[3px] z-10 shadow
                              ${
                                file.status === 'approved'
                                  ? 'bg-green-500 text-white'
                                  : file.status === 'rejected'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-yellow-500 text-white'
                              }
                            `}
                          >
                            {file.status?.charAt(0).toUpperCase() + file.status?.slice(1)}
                          </div>

                        {/* Points badge */}
                        {file?.points > 0 && (
                            <div className="absolute bottom-15 right-3 z-30 px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-800 dark:text-blue-100 text-[11px] font-semibold rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105">
                              {file.points} pts
                            </div>
                          )}

                            {/* Media Preview */}
                            {isImage(file.url) ? (
                              <div className="relative">
                                <img
                                  src={`${imgurl}${file.url}`}
                                  alt={`Portfolio image ${index + 1}`}
                                  className="w-full h-64 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                                />
                                <Image className="absolute top-2 right-2 w-6 h-6 text-white bg-black bg-opacity-50 rounded-full p-1" />
                              </div>
                            ) : isVideo(file.url) ? (
                              <div className="relative">
                                <video
                                  controls
                                  src={`${imgurl}${file.url}`}
                                  className="w-full h-64 object-cover rounded-t-xl"
                                />
                                <Video className="absolute top-2 right-2 w-6 h-6 text-white bg-black bg-opacity-50 rounded-full p-1" />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-full h-64 text-neutral-500 text-sm">
                                File format not supported for preview
                              </div>
                            )}

                            {/* Approval Controls */}
                            <div className="p-4 bg-white dark:bg-neutral-800 rounded-b-xl">
                              <RadioGroup
                                defaultValue={file.status}
                                value={file.status}
                                onValueChange={(value) => handleStatusChange(index, value)}
                                className="flex items-center justify-center space-x-6"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="approved" id={`approved-${index}`} />
                                  <label htmlFor={`approved-${index}`} className="text-sm text-green-600 dark:text-green-400">
                                    Approved
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="rejected" id={`rejected-${index}`} />
                                  <label htmlFor={`rejected-${index}`} className="text-sm text-red-600 dark:text-red-400">
                                    Rejected
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>

                              ))}
                            </div>
                            
                          </div>

                          {showSimilarity && Array.isArray(matchResult) && matchResult.length > 0 && (
                            <Separator className='mt-3'/>
                          )}
                          

                          {showSimilarity && Array.isArray(matchResult) && matchResult.length > 0 && (
                          <div className="mt-8 space-y-8">
                            {matchResult.map((result, index) => (
                              <div key={index} className="mb-6 text-center">
                               <h3 className="text-md font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                                  🔍 Matches for: Image {index + 1} 
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                  ({result.file})
                                </p>
                          
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                                  {result.matches.map((match, idx) => {
                                    const cleanPath = match.match_path.replace(/\\/g, "/").replace("../backend", "");
                                    const fullUrl = `${imgurl}${cleanPath}`;
                          
                                    return (
                                      <div key={idx} className="text-center w-full max-w-xs">
                                        <div className='flex justify-center'>

                                        <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                                          <img
                                            src={fullUrl}
                                            alt="Matching design"
                                            className="w-52 h-52 object-cover rounded-lg border shadow hover:scale-105 transition-transform"
                                          />
                                        </a>
                                        </div>

                                        <p className="text-sm text-gray-500 mt-1">📏 {match.distance.toFixed(2)}</p>
                                        <p className="text-xs text-gray-400 mt-1 break-words px-2">
                                          📁 Path: {cleanPath}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                                <Separator className='mt-5'/>
                              </div>
                            ))}
                          </div>
                          )}


      
                          {/* Upload Date Section */}
                          <p className="text-xs text-center text-muted-foreground">
                            Uploaded on {new Date(selectedDesign.createdAt).toLocaleDateString()}
                          </p>
                        </div>
      
                        {/* Close Button at the Bottom */}
                        <div className="flex justify-center gap-4 mt-6">
                          <Button
                            variant="outline"
                            onClick={handleClosePortfolioPopover}
                            className="cursor-pointer"
                          >
                            Close
                          </Button>

                          {/* <Button
                            variant="default"
                            onClick={handleCheckSimilarity}
                            className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Check Similarity
                          </Button> */}

                    {!showSimilarity ? (
                      <Button
                        onClick={handleCheckSimilarity}
                        className="cursor-pointer flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-md"
                      >
                        <Search className="w-4 h-4" />
                        Check Similarity
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setShowSimilarity(false)}
                        className="cursor-pointer flex items-center gap-2 border border-blue-800 text-blue-600 hover:bg-indigo-50 transition-colors shadow-sm"
                      >
                        <EyeOff className="w-4 h-4" />
                        Hide Similarity
                      </Button>
                    )}

                    <Button
                      className="cursor-pointer flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md"
                      onClick={handleUpdateStatuses}
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Update Status
                    </Button>
                        </div>
                      </div>
                    </div>
                  )}
    </div>
  );
};

export default Alldesigns;
