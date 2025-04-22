import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendurl, imgurl } from "@/server";
import { Loader2, Eye, Pencil, Trash, XCircle, CheckCircle2, Folder, X, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown } from "lucide-react";
import swal from "sweetalert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";


const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [userPortfolios, setUserPortfolios] = useState([]);
  const [PortfoliodialogOpen, setPortfolioDialogOpen] = useState(false);



  const openUserPortfolioDialog = async (user) => {
    try {
      const { data } = await axios.get(`${backendurl}/admin/${user._id}/portfolio`, {
        withCredentials: true,
      });
      setSelectedUser(user);
      setUserPortfolios(data);
      setPortfolioDialogOpen(true);
      setDialogOpen(false)
    } catch (err) {
      toast.error("Portfolio not Uploaded till yet !");
      setUserPortfolios([]);
      setSelectedUser(user);
      setPortfolioDialogOpen(true);
    }
  };

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

  const handleStatusUpdate = async (userId, status) => {
    try {
      const { data } = await axios.patch(`${backendurl}/admin/update-status/${userId}`, {
        status,
      }, { withCredentials: true });
  
      toast.success(`User ${status} successfully!`);
      fetchUsers(); // Refresh list
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    }
  };

  const openUserDialog = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this User account!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const res = await axios.delete(`${backendurl}/admin/delete-user/${userId}`, {
            withCredentials: true,
          });
  
          toast.success(res.data.message || "User deleted successfully");
          fetchUsers();
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to delete user");
        }
      }
    });
  };
  
  
  
     // Check if URL is an image or video based on extension
     const isImage = (url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
     const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);
  

     const [selectedPortfolio, setSelectedPortfolio] = useState(null);
      const [isPortfolioPopoverOpen, setIsPortfolioPopoverOpen] = useState(false);

      const handleClosePortfolioPopover = () => {
        setSelectedPortfolio(null);
        setIsPortfolioPopoverOpen(false);
      };

      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 12;

      const paginatedUsers = users.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  return (
    <>
      <Card className="p-6 shadow-md bg-background mt-3">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">All Users</h1>
       
        <p className="text-muted-foreground mb-6 text-sm">
          Manage and review all registered users. You can view profiles, edit details, or remove users as needed.
        </p>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="w-full overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user._id} className="hover:bg-muted/40 transition">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                    <TableCell className="text-green-500 font-semibold">{user.points || 0}</TableCell>
                    <TableCell>
                    <span
                      className={`
                        inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full capitalize
                        ${
                          user.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : user.status === "Pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : user.status === "Declined"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }
                      `}
                    >
                      {user.status === "Approved" && <CheckCircle className="w-3.5 h-3.5" />}
                      {user.status === "Pending" && <Clock className="w-3.5 h-3.5" />}
                      {user.status === "Declined" && <XCircle className="w-3.5 h-3.5" />}
                      {user.status || "Pending"}
                    </span>
                  </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                    <div className="flex justify-end flex-wrap gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => openUserDialog(user)}
                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-700 dark:text-neutral-200 shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>

                      {/* Portfolio Button */}
                      <button
                        onClick={() => openUserPortfolioDialog(user)}
                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-700 dark:text-neutral-200 shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                      >
                        <Folder className="w-4 h-4" />
                        Portfolio
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-red-500 text-white text-sm shadow-sm hover:bg-red-600 transition dark:bg-red-600 dark:hover:bg-red-700"
                      >
                        <Trash className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}


        {users.length > 0 && (
          <div className="flex justify-end mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={`!cursor-pointer ${
                      currentPage === 1
                        ? "pointer-events-none opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  />
                </PaginationItem>

                <PaginationItem>
                  <span className="px-4 py-1 text-sm rounded-md border border-gray-300 dark:border-neutral-700">
                    Page {currentPage} of {Math.ceil(users.length / itemsPerPage)}
                  </span>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    className={`!cursor-pointer ${
                      currentPage >= Math.ceil(users.length / itemsPerPage)
                        ? "pointer-events-none opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() =>
                      currentPage < Math.ceil(users.length / itemsPerPage) &&
                      setCurrentPage(currentPage + 1)
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

      </Card>

      


      {/* Dialog for Viewing Details */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="!max-w-xl !sm:max-w-lg  max-h-[90vh] overflow-y-auto rounded-2xl p-6 dark:!bg-neutral-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">User Details</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border shadow">
                  <AvatarImage
                    src={selectedUser.avatar ? `${imgurl}${selectedUser.avatar}` : ""}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback className="text-xl font-medium bg-muted text-foreground">
                    {selectedUser.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-0.5">
                <h2 className="text-xl font-bold text-foreground">{selectedUser.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                <p className="text-xs text-muted-foreground">
                  Joined on:{" "}
                  <span className="text-foreground font-medium">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>

              </div>

              {/* Grid Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Points</p>
                <p className="text-foreground">{selectedUser.points ?? "N/A"}</p>
              </div>

              <div>
                <p className="font-medium text-muted-foreground">Availability</p>
                <p className="text-foreground">
                  {selectedUser.availability !== undefined ? (selectedUser.availability ? "Yes" : "No") : "N/A"}
                </p>
              </div>

              <div>
                <p className="font-medium text-muted-foreground">Experience</p>
                <p className="text-foreground">
                  {selectedUser.experience ? `${selectedUser.experience} years` : "N/A"}
                </p>
              </div>

              <div>
                <p className="font-medium text-muted-foreground">Employment Type</p>
                <p className="text-foreground">{selectedUser.employmentType || "N/A"}</p>
              </div>

              <div>
                <p className="font-medium text-muted-foreground">Role</p>
                <p className="text-foreground">{selectedUser.jewelryRole || "N/A"}</p>
              </div>

              <div>
                <p className="font-medium text-muted-foreground">Specialties</p>
                <p className="text-foreground">{selectedUser.specialties || "N/A"}</p>
              </div>

              <div className="md:col-span-3">
                <p className="font-medium text-muted-foreground">Skills</p>
                <p className="text-foreground line-clamp-1">{selectedUser.skills || "N/A"}</p>
              </div>

              <div>
                <p className="font-medium text-muted-foreground">Working Hours From</p>
                <p className="text-foreground">{selectedUser.workingHoursFrom || "N/A"}</p>
              </div>

              <div>
                <p className="font-medium text-muted-foreground">Working Hours To</p>
                <p className="text-foreground">{selectedUser.workingHoursTo || "N/A"}</p>
              </div>

              <div>
            <p className="font-medium text-muted-foreground mb-1">Application Status</p>
            <p
              className={`
                inline-block px-3 py-1 text-xs font-semibold rounded-full
                ${
                  selectedUser.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : selectedUser.status === "Declined"
                    ? "bg-red-100 text-red-700"
                    : "bg-[#facc15] text-white"
                }
              `}
            >
              {selectedUser.status || "Pending"}
            </p>
          </div>

            </div>



              {/* Bio */}
              <div className="bg-muted p-4 rounded-lg shadow-inner text-sm">
              <p className="font-medium text-muted-foreground mb-1">Bio</p>
              <p className="text-foreground">{selectedUser.bio?.trim() || "N/A"}</p>
              </div>


              {/* Buttons at the bottom of DialogContent */}
            <div className="flex justify-end gap-4 mt-8">
            {/* Decline Button */}
            <Button
              className="cursor-pointer bg-red-500 text-white hover:bg-red-400  transition-all duration-200 shadow rounded-lg px-5 py-2"
              onClick={() => handleStatusUpdate(selectedUser?._id, "Declined")}
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              Decline
            </Button>

            {/* Approve Button */}
            <Button
              className="cursor-pointer bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-lg rounded-lg px-5 py-2"
              onClick={() => handleStatusUpdate(selectedUser?._id, "Approved")}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              Approve
            </Button>
            </div>

            </div>
          )}


        </DialogContent>
      </Dialog>

      <Dialog open={PortfoliodialogOpen} onOpenChange={setPortfolioDialogOpen}>
        <DialogContent className="!max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 bg-white dark:bg-stone-900 scrollbar-hidden dark:border dark:border-neutral-700">
          <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-neutral-100">
                {selectedUser?.name}'s Portfolio
                </h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {selectedUser?.email}
                </p>
          </div>

          {loading ? (
            <div className="text-center text-neutral-500 font-medium py-10">
              Loading portfolios...
            </div>
          ) : userPortfolios.length === 0 ? (
            <div className="text-center text-neutral-400 font-medium py-10 text-sm">
                No portfolio uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {userPortfolios.map((portfolio) => (
                <div
                  key={portfolio._id}
                  onClick={() => {
                    setSelectedPortfolio(portfolio);
                    setIsPortfolioPopoverOpen(true);
                  }}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-md hover:shadow-xl transition-all duration-300 relative"
                >
                  {/* Media Preview */}
                  <div className="relative w-full h-60 overflow-hidden"
                   
                  >
                    {portfolio.files.length > 0 ? (
                      isImage(portfolio.files[0]?.url) ? (
                        <img
                          src={`${imgurl}${portfolio.files[0].url}`}
                          alt="Portfolio Preview"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                      ) : isVideo(portfolio.files[0]?.url) ? (
                        <div className="relative w-full h-full">
                          <video
                          controls
                            src={`${imgurl}${portfolio.files[0].url}`}
                            className="w-full h-full object-cover"
                          
                          />
                          
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-neutral-500">
                          Unsupported Format
                        </div>
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-neutral-400">
                        No file available
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-semibold text-neutral-800 dark:text-white truncate">
                      {portfolio.title}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                      {portfolio.description}
                    </p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-neutral-400">
                        Uploaded on {new Date(portfolio.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

           {/* Close Button */}
           <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={()=>{setPortfolioDialogOpen(false)}} className='cursor-pointer dark:bg-neutral-700 dark:hover:bg-neutral-600'>
                  Close
                </Button>
           </div>
        </DialogContent>
      </Dialog>

      {isPortfolioPopoverOpen && selectedPortfolio && (
        <Dialog open={isPortfolioPopoverOpen} onOpenChange={handleClosePortfolioPopover}>
          <DialogContent className="w-full !max-w-4xl p-8 bg-white dark:bg-neutral-800 max-h-[90vh] dark:border  overflow-y-auto scrollbar-hidden border border-neutral-300 dark:border-neutral-600 rounded-2xl shadow-xl">
          

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

              {/* Media Gallery */}
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

              {/* Date */}
              <p className="text-xs text-center text-muted-foreground">
                Uploaded on {new Date(selectedPortfolio.createdAt).toLocaleDateString()}
              </p>

              {/* Close Button */}
              <div className="flex justify-center">
                <Button variant="outline" onClick={handleClosePortfolioPopover} className='cursor-pointer dark:bg-neutral-700 dark:hover:bg-neutral-600'>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}


    </>
  );
};

export default AllUsers;
