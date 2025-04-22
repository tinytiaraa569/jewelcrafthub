import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { UploadCloud, X, Banknote, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FileUpload from '@/components/ui/file-upload';
import { CiCreditCard1 } from "react-icons/ci";
import { FaCcPaypal } from "react-icons/fa6";
import axios from 'axios';
import { backendurl } from '@/server';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { createNotification } from '@/redux/action/usernotification';
import { useSelector } from 'react-redux';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createAdminNotification } from '@/redux/action/adminNotificationActions';
import { verifyAuth } from '@/redux/slices/authSlice';
const UserPayout = () => {
  const [isPayoutPopoverOpen, setIsPayoutPopoverOpen] = useState(false);
  const [isWithdrawablePopoverOpen, setIsWithdrawablePopoverOpen] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);

  const { user } = useSelector((state) => state.auth);
  const [payoutDetails, setPayoutDetails] = useState(null);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { register, handleSubmit, setError, clearErrors, setValue, reset, formState: { errors }, watch } = useForm({
    shouldUnregister: true, // Unregister fields from validation when not in active tab
  });
  const [activeTab, setActiveTab] = useState("upi"); // Default tab
  const dispatch = useDispatch()

  const handlePayoutOpenPopover = () => setIsPayoutPopoverOpen(true);
  const handlePayoutClosePopover = () => setIsPayoutPopoverOpen(false);


 

  const fetchPayoutDetails = async () => {
    try {
        const token = localStorage.getItem("token"); // Get JWT token from localStorage
        if (!token) {
            setError("Unauthorized: No token found");
            setLoading(false);
            return;
        }

        const response = await axios.get(`${backendurl}/payout/user-payout/details`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response,'response')
        
        setPayoutDetails(response.data.payoutDetails);
    } catch (err) {
        console.log(err);
    } 
};

console.log(payoutDetails,'payout details')

const fetchUserPoints = async () => {
  if(user){
    try {
      const { data } = await axios.get(`${backendurl}/payout/user-payout/confirmation-details/${user._id}`);
      console.log(data.user.points,"points")
      return data.user.points;
    } catch (error) {
      console.error("Failed to fetch user points:", error);
      toast.error("Failed to validate points. Try again.");
      return null;
    }
  }else{
    toast.error("Failed to get users points")
  }

};


  useEffect(() => {
    fetchPayoutDetails();
}, []);


  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };


  const onSubmit = async (data) => {
    console.log("Submitting payout data...", data, uploadedFiles);
  
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }
  
    try {
      // Convert files to Base64
      const base64Files = await Promise.all(
        uploadedFiles.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          content: await convertFileToBase64(file),
        }))
      );
  
      // Structure Payout Data
      const payoutData = {
        addressdetails: {
          city: data?.city,
          country: data?.country,
          state: data?.state,
          street: data?.street,
          zip: data?.zip,
        },
        upidetails: data?.upiId && [{ upiId: data?.upiId }] , // ✅ Convert to array
        bankdeatils: data?.accountNumber
          && [{ 
              accountHolder: data?.accountHolder,
              accountNumber: data?.accountNumber,
              ifsc: data?.ifsc,
            }]
          , // ✅ Convert to array
        paypaldetails: data?.paypalEmail
          && [ { 
              paypalEmail: data?.paypalEmail,
              swiftCode: data?.swiftCode,
            }]
          , // ✅ Keep PayPal as an object
        files: base64Files,
      };
  
      console.log("Payout data ready:", payoutData);
  
      // Retrieve token from localStorage
      const token = localStorage.getItem("token");
  
      // Send Request to Backend
      const response = await axios.post(
        `${backendurl}/payout/user-payout/create`, // Adjust base URL as needed
        payoutData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        }
      );
  
      // Handle successful response
      if (response.status === 201) {
        handlePayoutClosePopover(); // Close popover after success
        // fetchUserPayouts(); // Refresh payout list if applicable
        fetchPayoutDetails()
  
        dispatch(
          createNotification(
            user?._id,
            "Payout Information Added",
            "Your payout information has been added successfully! You can now withdraw your points.",
            "check"
          )
        );
        
  
        toast.success("Payout request submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting payout request:", error);
      toast.error(error.response?.data?.error || "Failed to submit payout request.");
    }
  };
  
  

  const handleFilesSelected = (files) => {
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };


  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedUpi, setSelectedUpi] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedPaypal, setSelectedPaypal] = useState(null);
  
  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    setSelectedUpi(null);
    setSelectedBank(null);
    setSelectedPaypal(null);
    setValue("upi", null);
    setValue("bank", null);
    setValue("paypal", null);
  };
  
  const handleUpiSelect = (value) => {
    setSelectedMethod("upi");
    setSelectedUpi(value);
    setSelectedBank(null);
    setSelectedPaypal(null);
    setValue("upi", value);
    setValue("bank", null);
    setValue("paypal", null);
  };
  
  const handleBankSelect = (value) => {
    setSelectedMethod("bank");
    setSelectedBank(value);
    setSelectedUpi(null);
    setSelectedPaypal(null);
    setValue("bank", value);
    setValue("upi", null);
    setValue("paypal", null);
  };
  
  const handlePaypalSelect = (value) => {
    setSelectedMethod("paypal");
    setSelectedPaypal(value);
    setSelectedUpi(null);
    setSelectedBank(null);
    setValue("paypal", value);
    setValue("upi", null);
    setValue("bank", null);
  };
  const handleWithdrawableOpenPopover = () => setIsWithdrawablePopoverOpen(true);
  const handleWithdrawableClosePopover = () => {

      // Reset selected values
      setSelectedMethod("");  // Reset method selection
      setSelectedUpi(null);   // Reset selected UPI
      setSelectedBank(null);  // Reset selected bank
      setSelectedPaypal(null);// Reset selected PayPal
      reset();  // Reset form fields using react-hook-form's reset function

      setIsWithdrawablePopoverOpen(false);
  
  
  };

  const onSubmitWithdraw = async (data) => {

    const currentPoints = await fetchUserPoints();

    console.log(currentPoints,'crrent points from backend')

    console.log(currentPoints,"current points")
    if (!selectedMethod) {
      toast.error("Please select a withdrawal method.");
      return;
    }
  
    if (!data.amount || data.amount < 1) {
      toast.error("Please enter a valid withdrawal amount.");
      return;
    }
  
    if (selectedMethod === "upi" && !selectedUpi) {
      toast.error("Please select a UPI ID.");
      return;
    }
  
    if (selectedMethod === "bank" && !selectedBank) {
      toast.error("Please select a bank account.");
      return;
    }
  
    if (selectedMethod === "paypal" && !selectedPaypal) {
      toast.error("Please select a PayPal account.");
      return;
    }
  
    const withdrawalAmount = Number(data.amount); // Convert amount to number

    if (withdrawalAmount > (user?.points || 0)) {
      toast.error("Withdrawal amount exceeds available points.");
      return;
    }
    
    
   

  const selectedUpiDetails = payoutDetails.upiDetails?.find((upi) => upi.upiId === selectedUpi) || null;
  const selectedBankDetails = payoutDetails.bankDetails?.find((bank) => bank.accountNumber === selectedBank) || null;
  const selectedPaypalDetails = payoutDetails.paypalDetails?.find((paypal) => paypal.email === selectedPaypal) || null;

  const payloadwithdraw = {
    userId: user?._id,
    method: selectedMethod,
    amount: withdrawalAmount,
    upi: selectedUpiDetails,
    bank: selectedBankDetails,
    paypal: selectedPaypalDetails,
    details:payoutDetails
  };

    
  try {
    // Make Axios POST request to your backend API
    const response = await axios.post(`${backendurl}/withdrawal/user-withdrawal/create`, payloadwithdraw);

    console.log(response,'respone ---------')

    if (response.status === 201) {
      toast.success("Withdraw Request Submitted Successfully");

      dispatch(
        createNotification(
          user?._id,
          "Withdrawal Requested",
          "Your withdrawal request was submitted successfully. We’ll notify you once it's processed.",
          "info"
        )
      );
  
      // ✅ Notify the admin
      dispatch(
        createAdminNotification(
          user?._id,
          "New Withdrawal Request",
          `${user?.name || "A user"} has submitted a new withdrawal request.`,
          "info"
        )
      );
    } else {
      toast.error("Something went wrong. Please try again later.");
    }

    // Reset fields after successful submission
    dispatch(verifyAuth());
    handleWithdrawableClosePopover();
    fetchWithdrawals();
    reset(); // Reset form inputs
    setSelectedMethod(null);
    setSelectedUpi(null);
    setSelectedBank(null);
    setSelectedPaypal(null);

  } catch (error) {
    console.error("Error submitting withdrawal request:", error);
    toast.error("An error occurred while submitting the withdrawal request.");
  }
  
  };
  
  // Fetch user's withdrawal requests

  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get(`${backendurl}/withdrawal/user/${user._id}/get-withdrawals`);
      setWithdrawals(res.data.withdrawals);
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err);
    }
  };
  useEffect(() => {
  
    if (user?._id) {
      fetchWithdrawals();
    }
  }, [user?._id]);

  console.log(withdrawals,'userswithdrwawal')

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 dark:text-green-400";
      case "rejected":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-yellow-600 dark:text-yellow-400";
    }
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Payout Dashboard</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your payouts and verify your bank details.</p>
        </div>
        <Button onClick={handlePayoutOpenPopover} variant="outline" className="cursor-pointer">
          <UploadCloud className="w-5 h-5 mr-2" /> Request Payout
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center w-full p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white tracking-tight">
          Wallet Summary
        </h3>

        <div className="w-full grid grid-cols-2 gap-4">
          {/* Available Points */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-xl p-4 border border-blue-200 dark:border-blue-700 shadow-sm transition-all duration-200">
            <h3 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300">
              {user?.points}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Available
            </p>
          </div>

          {/* Withdrawn Points */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-tr from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 rounded-xl p-4 border border-green-200 dark:border-green-700 shadow-sm transition-all duration-200">
            <h3 className="text-3xl font-extrabold text-green-700 dark:text-green-300">
              {user?.withdrawnPoints || 0}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Withdrawn
            </p>
          </div>
        </div>

        <Button
          onClick={handleWithdrawableOpenPopover}
          className="cursor-pointer mt-2 px-6 py-2 text-sm font-medium rounded-md 
                    bg-neutral-100 text-gray-900 border border-neutral-300 
                    dark:bg-neutral-800 dark:text-white dark:border-neutral-600 
                    hover:bg-neutral-200 dark:hover:bg-neutral-700 
                    active:scale-[0.98] transition-all duration-200 shadow-sm"
        >
          Withdraw
        </Button>

      </div>






      {isPayoutPopoverOpen && (
        <div className="fixed inset-0 bg-[#000000b7] bg-opacity-50 flex items-center justify-center z-50 min-h-screen">
          <div className="relative w-full max-w-3xl p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg">
            <button onClick={handlePayoutClosePopover} className="absolute top-4 right-4 text-muted-foreground cursor-pointer">
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-lg font-semibold">Payout Request</h3>
            <p className="text-sm text-muted-foreground mb-4">Provide your details for the payout.</p>
            <div className="max-h-[80vh] overflow-y-auto scrollbar-hidden">

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="upi" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="upi" className='!cursor-pointer'><Banknote className="mr-1 w-5 h-5 " /> UPI</TabsTrigger>
                    <TabsTrigger value="bank" className='!cursor-pointer'><CiCreditCard1 className="mr-1 w-5 h-5 " /> Bank Transfer</TabsTrigger>
                    <TabsTrigger value="paypal" className='!cursor-pointer'><FaCcPaypal className="mr-1 w-5 h-5 " /> PayPal</TabsTrigger>
                </TabsList>

                <TabsContent value="upi">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input id="upiId" className='mt-1' placeholder="Enter UPI ID" {...(activeTab === "upi" ? register("upiId", { required: "UPI ID is required" }) : {})}  />
                    {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId.message}</p>}
                </TabsContent>

                <TabsContent value="bank">
                    <div className="space-y-3">
                    <Label htmlFor="accountHolder">Account Holder Name</Label>
                    <Input id="accountHolder" placeholder="Enter name"  {...(activeTab === "bank" ? register("accountHolder", { required: "Name is required" }) : {})}  />
                    {errors.accountHolder && <p className="text-red-500 text-sm mt-1">{errors.accountHolder.message}</p>}

                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" placeholder="Enter account number"  {...(activeTab === "bank" ? register("accountNumber", { required: "Account number is required" }) : {})}  />
                    {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber.message}</p>}

                    <Label htmlFor="ifsc">IFSC Code</Label>
                    <Input id="ifsc" placeholder="Enter IFSC code"  {...(activeTab === "bank" ? register("ifsc", { required: "IFSC code is required" }) : {})}  />
                    {errors.ifsc && <p className="text-red-500 text-sm mt-1">{errors.ifsc.message}</p>}
                    </div>
                </TabsContent>

                {/* New Foreign Payment Method */}
                <TabsContent value="paypal">
                    <div className="space-y-3">
                    <Label htmlFor="paypalEmail">PayPal Email</Label>
                    <Input id="paypalEmail" placeholder="Enter PayPal email" {...(activeTab === "paypal" ? register("paypalEmail", { required: "PayPal email is required" }) : {})}  />
                    {errors.paypalEmail && <p className="text-red-500 text-sm mt-1">{errors.paypalEmail.message}</p>}

                    <Label htmlFor="swiftCode">SWIFT Code</Label>
                    <Input id="swiftCode" placeholder="Enter SWIFT Code" {...(activeTab === "paypal" ? register("swiftCode", { required: "SWIFT code is required" }) : {})}  />
                    {errors.swiftCode && <p className="text-red-500 text-sm mt-1">{errors.swiftCode.message}</p>}
                    </div>
                </TabsContent>
                </Tabs>

 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                  <div>
                    <Label htmlFor="street">Street</Label>
                    <Input id="street" className='mt-1' placeholder="Enter street" {...register("street", { required: "Street is required" })} />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" className='mt-1' placeholder="Enter city" {...register("city", { required: "City is required" })} />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" className='mt-1' placeholder="Enter state" {...register("state", { required: "State is required" })} />
                  </div>
                  <div>
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input id="zip" className='mt-1' placeholder="Enter zip code" {...register("zip", { required: "Zip code is required" })} />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" className='mt-1' placeholder="Enter country" {...register("country", { required: "Country is required" })} />
                  </div>
                </div>

                <Label htmlFor="verification" className="mt-5 mb-2">Upload Verification Proof</Label>
                <p className="text-sm text-muted-foreground">(Aadhar for Indian users, Passport for others)</p>
                <FileUpload onFilesSelected={handleFilesSelected} accept="image/*" />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-40 object-cover rounded-lg" />
                      <button onClick={() => removeFile(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="submit" className='cursor-pointer'>Submit Request</Button>
                  <Button type="button" onClick={handlePayoutClosePopover} variant="destructive" className='cursor-pointer dark:bg-red-500 hover:dark:bg-red-400'>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {
        isWithdrawablePopoverOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-lg shadow-xl p-6">
        <button  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400">
          <X onClick={handleWithdrawableClosePopover} className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-semibold">Withdraw Request</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select your payout method.</p>

        {/* Available Points */}
        <div className="mb-4 px-4 py-3 bg-gray-100  rounded-md dark:bg-neutral-700 border dark:border-neutral-600">
          <p className="text-sm font-medium">
            Available Credits : <span className="ml-1 font-semibold text-orange-400">{user?.points}</span>
          </p>
        </div>

        {/* Main Selection */}
        <RadioGroup value={selectedMethod} onValueChange={handleMethodChange} className="flex gap-4">
          {payoutDetails?.upiDetails?.length > 0 && (
            <div className="flex items-center gap-2">
              <RadioGroupItem value="upi" id="upi" className="cursor-pointer" />
              <Label htmlFor="upi" className="cursor-pointer">UPI</Label>
            </div>
          )}
          {payoutDetails?.bankDetails?.length > 0 && (
            <div className="flex items-center gap-2">
              <RadioGroupItem value="bank" id="bank"  className="cursor-pointer"/>
              <Label htmlFor="bank" className="cursor-pointer">Bank</Label>
            </div>
          )}
          {payoutDetails?.paypalDetails?.length > 0 && (
            <div className="flex items-center gap-2">
              <RadioGroupItem value="paypal" id="paypal"  className="cursor-pointer"/>
              <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
            </div>
          )}
        </RadioGroup>

        {/* Conditional Display of Selected Method */}
        {/* Conditional Display of Selected Method */}
        <form onSubmit={handleSubmit(onSubmitWithdraw)}>
          {selectedMethod === "upi" && (
            <Card className="mt-2 dark:bg-neutral-700">
              <CardContent className="px-4">
                <Label className="font-medium">UPI Transfer</Label>
                {payoutDetails?.upiDetails?.length > 0 ? (
                  payoutDetails.upiDetails.map((upi, index) => (
                    <div key={index} className="my-1.5 flex items-center gap-2">
                      <Checkbox
                        id={`upi-${index}`}
                        checked={selectedUpi === upi.upiId}
                        onCheckedChange={() => handleUpiSelect(upi.upiId)}
                         className="dark:bg-neutral-500 dark:border-neutral-400"
                      />
                      <Label htmlFor={`upi-${index}`} className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                        {upi.upiId}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No UPI added.</p>
                )}
              </CardContent>
            </Card>
          )}

          {selectedMethod === "bank" && (
            <Card className="mt-4 dark:bg-neutral-700">
              <CardContent className="px-4 ">
                <Label className="font-medium">Bank Transfer</Label>
                {payoutDetails?.bankDetails?.length > 0 ? (
                  payoutDetails.bankDetails.map((bank, index) => (
                    <div key={index} className="my-1.5 flex items-center gap-2">
                      <Checkbox
                        id={`bank-${index}`}
                        checked={selectedBank === bank.accountNumber}
                        onCheckedChange={() => handleBankSelect(bank.accountNumber)}
                      />
                      <Label htmlFor={`bank-${index}`} className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                        {bank.accountHolder} - {bank.accountNumber}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No bank account added.</p>
                )}
              </CardContent>
            </Card>
          )}

          {selectedMethod === "paypal" && (
            <Card className="mt-4 dark:bg-neutral-700">
              <CardContent className="px-4">
                <Label className="font-medium">PayPal</Label>
                {payoutDetails?.paypalDetails?.email ? (
                  payoutDetails.paypalDetails.map((paypal, index) => (
                    <div key={index} className="my-1.5 flex items-center gap-2">
                      <Checkbox
                        id={`paypal-${index}`}
                        checked={selectedPaypal === paypal.email}
                        onCheckedChange={() => handlePaypalSelect(paypal.email)}
                      />
                      <Label htmlFor={`paypal-${index}`} className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                        {paypal.email}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No PayPal account added.</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Textbox for amount */}
          <div className="mt-4">
            <Label className="font-medium">Enter Withdrawal Credits</Label>
            <Input
              {...register("amount", { required: true, min: 1 })}
              type="number"
              placeholder="Enter Credits"
              className="w-full mt-2 !bg-neutral-700"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="destructive" onClick={handleWithdrawableClosePopover} className='cursor-pointer dark:bg-red-400 dark:text-white'>
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer bg-neutral-700 hover:bg-neutral-600 text-white">
              Submit Request
            </Button>
          </div>
        </form>


      </div>
    </div>
        )
      }

      

<div className="space-y-8 ">
  <Card className="rounded-2xl shadow-md border border-border dark:border-zinc-700">
    <CardContent className='py-4'>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Your Withdrawal Requests</h2>

      {withdrawals.length === 0 ? (
        <p className="text-muted-foreground text-center">No withdrawal requests found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted dark:bg-zinc-800">
                <TableHead className="text-gray-600 dark:text-gray-300">Date</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300">Credits</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300">Method</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal._id} className="even:bg-muted/50 dark:even:bg-zinc-900 hover:bg-muted transition-colors">
                  <TableCell className="text-sm text-gray-800 dark:text-gray-100">
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {withdrawal.amount}
                  </TableCell>
                  <TableCell className="text-sm capitalize text-gray-700 dark:text-gray-200">
                    {withdrawal.method}
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-2 text-sm font-medium ${getStatusColor(withdrawal.status)}`}>
                      {getStatusIcon(withdrawal.status)}
                      {withdrawal.status || "Pending"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </CardContent>
  </Card>
</div>



    </div>
  );
};

export default UserPayout;
