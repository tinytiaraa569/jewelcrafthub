import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Upload, Edit, Trash, ShieldCheck, Mail } from "lucide-react";
import { backendurl, imgurl } from "@/server";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchAdminProfile } from "@/redux/slices/adminAuthSlice";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import swal from "sweetalert";


const AdminProfile = () => {
  const { adminUser, isAuthenticated } = useSelector((state) => state.adminAuth);
  const [selectedFile, setSelectedFile] = useState(null);

  const [allAdmins, setAllAdmins] = useState([]); // Store all admins
  const [editAdmin, setEditAdmin] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch()

  const form = useForm({
    defaultValues: {
      name: adminUser?.name || "",
      email: adminUser?.email || "",
      role: adminUser?.role || "Super Admin",
    },
  });

  const fetchAllAdmins = async () => {
    try {
      const response = await axios.get(`${backendurl}/admin/all-admins`, { withCredentials: true });
      setAllAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admin users.");
    }
  };


  useEffect(() => {
    if (adminUser) {
      form.reset({
        name: adminUser.name || "",
        email: adminUser.email || "",
        role: adminUser.role || "Super Admin",
      });

      // If user is superadmin, fetch all admins
      if (adminUser.role === "superadmin") {
        fetchAllAdmins();
      }
    }
  }, [adminUser, form]);

  console.log(allAdmins ,'alladmins---')
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data)  => {
    try {
      // Append the selected file directly to the data object if it exists
      if (selectedFile) {
        data.profileImage = await convertToBase64(selectedFile); // Convert image to Base64
      }  
      // Axios config (JSON request)
      const config = {
        headers: {
          "Content-Type": "application/json", // Send JSON instead of multipart/form-data
        },
      };
  
      // Send data object directly to the backend
      const response = await axios.put(
        `${backendurl}/admin/update-admin-profile`,
        data, // No FormData; data sent as JSON
        config
      );
      dispatch(fetchAdminProfile())
     toast.success("Profile updated successfully!"); // Success toast
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      toast.error("Failed to update profile. Please try again."); // Error toast
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    const words = name.split(" ");
    return words.length > 1 ? `${words[0][0]}${words[1][0]}` : name.substring(0, 2);
  };

  const handleUpdateAdmin = async () => {
    try {
      await axios.put(
        `${backendurl}/admin/update-admin/${editAdmin?._id}`,
        editAdmin,
        { withCredentials: true }
      );
      toast.success("Admin updated successfully");
      setEditAdmin(null);
      fetchAllAdmins();
    } catch (err) {
      toast.error("Failed to update admin");
    }
  };


  const handleDeleteAdmin = (adminId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this admin account!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`${backendurl}/admin/delete-admin/${adminId}`, {
            withCredentials: true,
          });
  
          toast.success("Admin deleted successfully");
          fetchAllAdmins(); // Refresh list
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete admin");
        }
      } else {
        toast.info("Admin deletion cancelled");
      }
    });
  };

  if (!isAuthenticated) {
    return <p className="text-center text-red-500">Unauthorized Access. Please log in.</p>;
  }

  return (
    <div className="container mx-auto max-w-full px-4 py-6 font-poppins">
      <Card className="shadow-sm border rounded-[15px] overflow-hidden border-neutral-300 dark:border-neutral-700">
        <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
          <CardTitle className="text-2xl font-bold flex items-center gap-3 text-gray-800 dark:text-neutral-100">
            <User className="w-6 h-6 text-primary dark:text-primary-light" />
            Admin Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="px-8 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Admin Information Section */}
              <section className="border rounded-lg p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-100">Admin Information</h2>
                <div className="flex flex-col justify-center items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border border-muted dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center shadow-sm">
                      {selectedFile ? (
                        <img src={URL.createObjectURL(selectedFile)} alt="Profile" className="w-full h-full object-cover" />
                      ) : adminUser?.avatar ? (
                        <img src={`${imgurl}${adminUser.avatar}`} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-muted-foreground dark:text-neutral-500 w-12 h-12" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 cursor-pointer p-2 bg-primary text-white dark:bg-neutral-700 dark:text-neutral-200 rounded-full">
                      <Upload className="w-4 h-4" />
                      <input type="file" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-neutral-400">Click to update your profile picture</p>
                </div>

                <div className="space-y-2.5">


                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input type="text" readOnly {...field} className="bg-gray-100 dark:bg-neutral-800 cursor-not-allowed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>

              </section>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" className="px-6">
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>


       {/* Admin List Section */}
       {
  adminUser?.role === "superadmin" && (
    <div className="mt-10 space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">All Admins</h3>

      {allAdmins.map((admin) => (
        <div
          key={admin._id}
          className="flex justify-between items-center p-4 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 shadow-sm"
        >
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{admin.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditAdmin(admin);
                    setIsDialogOpen(true);
                  }}
                  className="hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  <Edit size={18} className="text-gray-700 dark:text-gray-300" />
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px] dark:bg-neutral-900">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <ShieldCheck size={20} /> Edit Admin
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <Input
                    className="dark:bg-neutral-800 dark:text-white"
                    value={editAdmin?.name || ""}
                    onChange={(e) => setEditAdmin({ ...editAdmin, name: e.target.value })}
                    placeholder="Name"
                  />
                  <Input
                    className="dark:bg-neutral-800 dark:text-white"
                    value={editAdmin?.email || ""}
                    onChange={(e) => setEditAdmin({ ...editAdmin, email: e.target.value })}
                    placeholder="Email"
                  />
                  <Select
                    value={editAdmin?.role || ""}
                    onValueChange={(value) => setEditAdmin({ ...editAdmin, role: value })}
                  >
                    <SelectTrigger className="dark:bg-neutral-800 dark:text-white">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-neutral-800 dark:text-white">
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="ghost"
                    className="px-4 py-2 cursor-pointer rounded-md border border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all"
                    onClick={() => {
                      setEditAdmin(null);
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-primary cursor-pointer text-white hover:bg-primary/90 dark:bg-neutral-600 dark:hover:bg-neutral-500 dark:border dark:border-neutral-500 transition-colors px-4 py-2 rounded-md font-medium"
                    onClick={() => {
                      handleUpdateAdmin(editAdmin);
                      setIsDialogOpen(false);
                    }}
                  >
                    Update
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-red-100 dark:hover:bg-red-900"
              onClick={() => handleDeleteAdmin(admin._id)}
            >
              <Trash className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

    </div>
  );
};

export default AdminProfile;
