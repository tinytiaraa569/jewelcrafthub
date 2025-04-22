import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from 'react-redux';
import { Upload, User, Mail, BadgeCheck, Clock, ShieldAlert } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { backendurl, imgurl } from '@/server';
import axios from 'axios';
import { toast } from 'sonner';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { createNotification } from '@/redux/action/usernotification';
import { createAdminNotification } from '@/redux/action/adminNotificationActions';


const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState(null);
  const form = useForm({
    defaultValues: {
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        skills: user?.skills || '',
        experience: user?.experience || '',
        specialties: user?.specialties || '',
        availability: user?.availability || false,
        workingHours: user?.workingHours || '',
        workingHoursFrom: user?.workingHoursFrom || '',
        workingHoursTo: user?.workingHoursTo || '',
        employmentType: user?.employmentType || '',
        jewelryRole: user?.jewelryRole || '',
    },
  });
  const dispatch = useDispatch()
  const { reset } = form;
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found");
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(`${backendurl}/auth/get-user-profile`, config);
        setUserData(response.data.user);

        // Dynamically update form values with fetched user data
        reset({
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          bio: response.data.user.bio || '',
          skills: response.data.user.skills || '',
          experience: response.data.user.experience || '',
          specialties: response.data.user.specialties || '',
          availability: response.data.user.availability || false,
          workingHours: response.data.user.workingHours || '',
          workingHoursFrom: response.data.user.workingHoursFrom || '',
          workingHoursTo: response.data.user.workingHoursTo || '',
          employmentType: response.data.user.employmentType || '',
          jewelryRole: response.data.user.jewelryRole || '',
        });
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
      }
    };

    fetchUserData();
  }, [reset]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

 



  const onSubmit = async (data) => {
    console.log(data, "Data captured from frontend");
  
    try {
      // Append the selected file directly to the data object if it exists
      if (selectedFile) {
        data.profileImage = await convertToBase64(selectedFile); // Convert image to Base64
      }

  
      // Debugging: Log data object before sending
      console.log("Data to be sent:", data);
  
      // Axios config (JSON request)
      const config = {
        headers: {
          "Content-Type": "application/json", // Send JSON instead of multipart/form-data
        },
      };
  
      // Send data object directly to the backend
      const response = await axios.post(
        `${backendurl}/auth/update-user-profile`,
        data, // No FormData; data sent as JSON
        config
      );
      setUserData(response.data.user);
      dispatch(createNotification(user?._id, "Profile Updated", "Your Profile has been updated successfully!", "check"));
      toast.success("Profile updated successfully!"); // Success toast

      dispatch(
        createAdminNotification(
          user?._id,
          "Profile Updated",
          `${user?.name || "A user"} has updated their profile. (${user?.email})`,
          "info"
        )
      );
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      toast.error("Failed to update profile. Please try again."); // Error toast
    }
  };

  // Function to show confirmation popup and handle deletion
  const handleDeleteConfirmation = async (userId) => {
  
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover your account!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(`${backendurl}/auth/delete-user/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
  
          if (response.status === 200) {
            swal("Your profile has been deleted!", { icon: "success" }).then(() => {
                window.location.reload(); // Reload after success
              });
            navigate('/'); // Redirect to home or another page
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          swal("Failed to delete your profile. Please try again later.", { icon: "error" });
        }
      } else {
        toast.success("Your profile is safe!");
      }
    });
  };
  
  
  
  

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  console.log(userData?._id,"userdta")

  return (
        <div className="container mx-auto max-w-full px-2 py-4 font-poppins">
        <Card className="shadow-sm border rounded-[15px] overflow-hidden border-neutral-300 dark:border-neutral-700">
      
        <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
        <CardTitle className="text-2xl font-bold flex items-center gap-3 text-gray-800 dark:text-neutral-100">
            <User className="w-6 h-6 text-primary dark:text-primary-light" />
            User Profile
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-neutral-400">
            Keep your personal and professional details updated.
        </CardDescription>
        </CardHeader>


        <CardContent className="px-8 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Personal Details Section */}
              <section className="border rounded-lg p-6 bg-white  dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-100">
                    <User className="w-5 h-5 text-muted-foreground dark:text-neutral-500" /> Personal Details
                </h2>

                {/* Profile Upload */}
                <div className="flex flex-col justify-center items-center gap-4 mb-8">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border border-muted dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center shadow-sm">
                    {selectedFile ? (
                        <img
                        src={URL.createObjectURL(selectedFile)}  // Display selected file if uploaded
                        alt="Profile"
                        className="w-full h-full object-cover"
                        />
                    ) : user?.avatar ? (
                        <img
                        src={`${imgurl}${user.avatar}`}  // Display user's avatar from the server
                        alt="Profile"
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="text-muted-foreground dark:text-neutral-500 w-12 h-12" />
                    )}
                    </div>

                    <label className="absolute bottom-0 right-0 cursor-pointer p-2 bg-primary text-white dark:bg-neutral-700 dark:text-neutral-200 rounded-full">
                    <Upload className="w-4 h-4" />
                    <input type="file" onChange={handleFileChange} className="hidden" />
                    </label>
                </div>
                
                <p className="text-sm text-muted-foreground dark:text-neutral-400">
                {user?.avatar 
                    ? "Click to update your profile picture"  // Text if avatar exists
                    : "Upload your profile picture (max: 2MB)" // Default text if no avatar
                }
                </p>
                </div>

                {/* Name & Bio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <Controller
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="font-medium text-gray-600 dark:text-neutral-300">Name</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter your full name"
                            {...field}
                            className="bg-white dark:bg-neutral-800 dark:text-neutral-100"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Email (Unchanged) */}
                    <FormItem>
                    <FormLabel className="font-medium text-gray-600 dark:text-neutral-300">Email</FormLabel>
                    <FormControl>
                        <Input
                        value={user?.email}
                        readOnly
                        className="bg-gray-100 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed"
                        />
                    </FormControl>
                    </FormItem>

                    {/* Bio Field (Full Width) */}
                    <div className="md:col-span-2">
                    <Controller
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-medium text-gray-600 dark:text-neutral-300">Bio</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="Brief introduction about yourself"
                                {...field}
                                className="resize-none bg-white dark:bg-neutral-800 dark:text-neutral-100"
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                </div>
                </section>


          {/* Professional Information Section */}
          <section className="border rounded-lg p-6 bg-white  dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-100">
                <BadgeCheck className="w-5 h-5 text-muted-foreground dark:text-neutral-500" /> Professional Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <Controller
                control={form.control}
                name="skills"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="font-medium text-gray-600 dark:text-neutral-300">Skills</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="e.g., Jewelry sketching, CAD modeling, gem setting"
                        {...field}
                        className="bg-white dark:bg-neutral-800 dark:text-neutral-100"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Years of Experience */}
                <Controller
                control={form.control}
                name="experience"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="font-medium text-gray-600 dark:text-neutral-300">Years of Experience</FormLabel>
                    <FormControl>
                        <Input
                        type="number"
                        placeholder="e.g., 5"
                        {...field}
                        className="bg-white dark:bg-neutral-800 dark:text-neutral-100"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Specialties - Using Shadcn UI Select */}
                <Controller
                control={form.control}
                name="specialties"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="font-medium text-gray-600 dark:text-neutral-300">Specialties</FormLabel>
                    <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full bg-white dark:bg-neutral-800 dark:text-neutral-100">
                            <SelectValue placeholder="Select your specialty" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-neutral-800 dark:text-neutral-100">
                            <SelectItem value="Manual Designer">Manual Designer</SelectItem>
                            <SelectItem value="CAD Designer">CAD Designer</SelectItem>
                            <SelectItem value="Gem Setter">Gem Setter</SelectItem>
                            <SelectItem value="Jewelry Sketch Artist">Jewelry Sketch Artist</SelectItem>
                            <SelectItem value="Jewelry Polisher">Jewelry Polisher</SelectItem>
                            <SelectItem value="Stone Setter">Stone Setter</SelectItem>
                        </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Jewelry Role */}
                <Controller
                control={form.control}
                name="jewelryRole"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="font-medium text-gray-600 dark:text-neutral-300">Jewelry Role</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="e.g., Manual Designer, CAD Designer, Gem Setter"
                        {...field}
                        className="bg-white dark:bg-neutral-800 dark:text-neutral-100"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            </section>


              {/* Availability Section */}
              <section className="border rounded-lg p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-700 dark:text-gray-100">
                    <Clock className="w-5 h-5 text-muted-foreground dark:text-neutral-500" /> Availability Status
                </h2>

                <div className="grid gap-4 md:grid-cols-3">
                    {/* Employment Type Checkbox Group */}
                    <Controller
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="font-medium text-gray-600 dark:text-neutral-300">Employment Type</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-6">
                            {/* Full-Time Checkbox */}
                            <Checkbox
                                checked={field.value === "Full-Time"}
                                onCheckedChange={(checked) => {
                                if (checked) field.onChange("Full-Time");
                                }}
                                id="full-time"
                            />
                            <Label htmlFor="full-time" className="text-gray-600 dark:text-neutral-300">
                                Full-Time
                            </Label>

                            {/* Part-Time Checkbox */}
                            <Checkbox
                                checked={field.value === "Part-Time"}
                                onCheckedChange={(checked) => {
                                if (checked) field.onChange("Part-Time");
                                }}
                                id="part-time"
                            />
                            <Label htmlFor="part-time" className="text-gray-600 dark:text-neutral-300">
                                Part-Time
                            </Label>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Availability Switch */}
                    <Controller
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="font-medium text-gray-600 dark:text-neutral-300">Current Availability</FormLabel>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className={`bg-gray-200 dark:bg-neutral-800  ${field.value ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-200 dark:bg-gray-600'}`}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />

                    {/* Working Hours Input (from-to) */}
                    <div className="flex gap-4">
                    <Controller
                        control={form.control}
                        name="workingHoursFrom"
                        render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="font-medium text-gray-600 dark:text-neutral-300">Working Hours From</FormLabel>
                            <FormControl>
                            <Input type="time" {...field} className="bg-white dark:bg-neutral-800 dark:text-neutral-100" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="workingHoursTo"
                        render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="font-medium text-gray-600 dark:text-neutral-300">Working Hours To</FormLabel>
                            <FormControl>
                            <Input type="time" {...field} className="bg-white dark:bg-neutral-800 dark:text-neutral-100" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                </div>
                </section>





                <div className="flex justify-end">
                <Button
                    type="submit"
                    className="bg-primary text-white hover:bg-primary-dark dark:bg-neutral-800 dark:hover:bg-neutral-700 
                            dark:text-neutral-100 rounded-lg px-6 py-2 transition duration-300 cursor-pointer"
                >
                    Save Profile
                </Button>
                </div>


            </form>
          </Form>
        </CardContent>

        <CardFooter className="border-t w-full p-6 dark:border-neutral-700">
        <div className="w-full border border-red-600 rounded-lg p-6 bg-red-50 dark:bg-neutral-900 dark:border-neutral-700">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-500 mb-4">
            <ShieldAlert className="w-6 h-6" />
            <h3 className="text-xl font-semibold dark:text-neutral-100">Danger Zone</h3>
            </div>

            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            Deleting your profile is permanent and cannot be undone. Proceed with caution.
            All your work, data, and associated information will be permanently deleted and cannot be recovered.
            </p>

            <Button variant="destructive" className="mt-4 py-2 px-4 text-sm dark:bg-red-700 cursor-pointer" onClick={() => handleDeleteConfirmation(user?._id)}  >
            Delete Profile
            </Button>
        </div>
        </CardFooter>




      </Card>
    </div>
  );
};

export default UserProfile;
