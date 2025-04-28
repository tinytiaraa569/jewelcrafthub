// Import necessary hooks and libraries
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle, UserPlus, XCircle } from "lucide-react";
import { backendurl } from "@/server";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import swal from 'sweetalert';

const AdminWithdrawal = () => {
  const [allwithdrawals, setAllWithdrawals] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [conversionRate, setConversionRate] = useState("");
  const [isApprovalMode, setIsApprovalMode] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const [amountPaid, setAmountPaid] = useState("");
  const [paymentDoneBy, setPaymentDoneBy] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  
  const handleUpdatePayment = async () => {
    if (!selectedWithdrawal) {
      console.error("No withdrawal selected.");
      return;
    }

    try {
      const response = await axios.patch(
        `${backendurl}/withdrawal/withdrawals/${selectedWithdrawal._id}/update-payment`,
        {
          amountPaid,
          paymentDoneBy,
          referenceNumber,
        },
        { withCredentials: true }
      );

      toast.success("Payment related information updated successfully");

      // Close the dialog after success
      setIsDialogOpen(false);
      setAmountPaid("")
      setPaymentDoneBy("")
      setReferenceNumber("")


      // Refresh the withdrawal list
      fetchWithdrawals();
    } catch (error) {
      console.error("Error updating payment:", error.response?.data || error.message);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const response = await axios.get(
        `${backendurl}/withdrawal/admin/get-all-withdrawals`,
        { withCredentials: true }
      );
      setAllWithdrawals(response.data.withdrawals);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const openDialog = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setIsDialogOpen(true);
    setIsApprovalMode(false);
    setConversionRate("");

    // Pre-fill the payment fields if they exist, otherwise empty
    setAmountPaid(withdrawal.amountPaid || "");
    setPaymentDoneBy(withdrawal.paymentDoneBy || "");
    setReferenceNumber(withdrawal.referenceNumber || "");
  };

  const closeDialog = () => {
    setSelectedWithdrawal(null);
    setIsDialogOpen(false);
  };

  const handleApprove = () => {
    setIsApprovalMode(true);
  };

  const submitApproval = async () => {
    try {
      // Show confirmation popup before proceeding with approval
      swal({
        title: 'Are you sure?',
        text: 'Are you sure you want to approve this withdrawal request?',
        icon: 'warning',
        buttons: ['Cancel', 'Approve'],
        dangerMode: true,
      }).then(async (willApprove) => {
        if (willApprove) {
          // Proceed with the approval request
          await axios.post(`${backendurl}/withdrawal/admin/withdrawal-approve`, {
            withdrawalId: selectedWithdrawal._id,
            conversionRate: Number(conversionRate),
          }, {
            withCredentials: true,
          });
  
          // Close the dialog and refresh withdrawals
          closeDialog();
          fetchWithdrawals();
  
          // Show success toast and message
          toast.success("Withdrawal request approved successfully!");
  
          // Optionally, show a success message in the UI (if needed)
        //   swal({
        //     title: 'Approved!',
        //     text: 'The withdrawal request has been approved successfully.',
        //     icon: 'success',
        //   });
        } else {
          toast.info("Approval canceled.");
        }
      });
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("There was an error approving the withdrawal request.");
    }
  };

  const rejectWithdrawal = async () => {
    swal({
      title: 'Are you sure?',
      text: 'Once rejected, you will not be able to recover this withdrawal request!',
      icon: 'warning',
      buttons: ['Cancel', 'Reject'],
      dangerMode: true,
    }).then(async (willReject) => {
      if (willReject) {
        try {
          await axios.post(`${backendurl}/withdrawal/admin/withdrawal-reject`, {
            withdrawalId: selectedWithdrawal._id,
          }, {
            withCredentials: true,
          });
          closeDialog();
          fetchWithdrawals();
          toast.success("Withdrawal Request Rejected Successfully");
        } catch (error) {
          console.error("Rejection failed:", error);
        }
      } else {
        toast.info("Withdrawal rejection canceled.");
      }
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500 dark:text-white" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500 dark:text-white" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-white" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-500 dark:text-red-100";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100";
    }
  };
  

  return (
    <div className="p-4 sm:p-6 space-y-8 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Withdrawal Request's</h2>
          <p className="text-sm text-muted-foreground">Monitor and manage all user withdrawal requests efficiently.</p>
        </div>
        
      </div>

      <div className="overflow-x-auto">
      <Table className="bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-[12px] shadow-sm  text-sm">
        <TableHeader>
            <TableRow className="bg-neutral-100 dark:bg-neutral-800 border-b border-gray-300 dark:border-neutral-700">
            {["User", "Credits", "Method", "Status", "Created At", "Action"].map((header) => (
                <TableHead
                key={header}
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                {header}
                </TableHead>
            ))}
            </TableRow>
        </TableHeader>
        <TableBody>
            {allwithdrawals.length > 0 ? allwithdrawals.map((withdrawal) => (
            <TableRow
                key={withdrawal._id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 transition-all"
            >
                <TableCell className="px-4 py-3 text-gray-900 dark:text-white">{withdrawal.user.name}</TableCell>
                <TableCell className="px-4 py-3 text-gray-800 dark:text-gray-200">{withdrawal.amount}</TableCell>
                <TableCell className="px-4 py-3 capitalize text-gray-700 dark:text-gray-300">{withdrawal.method}</TableCell>
                <TableCell className="px-4 py-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center ${getStatusStyles(withdrawal.status)}`}>
                    {getStatusIcon(withdrawal.status)}
                    <span className="ml-1 capitalize">{withdrawal.status || "Pending"}</span>
                </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-300">
                {new Date(withdrawal.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="px-4 py-3">
                <Button
                    variant="outline"
                    onClick={() => openDialog(withdrawal)}
                    className="text-xs border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
                >
                    View
                </Button>
                </TableCell>
            </TableRow>
            )) : (
            <TableRow>
                <TableCell colSpan="6" className="text-center py-6 text-gray-600 dark:text-gray-300">
                No withdrawal requests found.
                </TableCell>
            </TableRow>
            )}
        </TableBody>
        </Table>


      </div>

      {selectedWithdrawal && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-h-[85vh] overflow-y-auto  scrollbar-hidden bg-white dark:bg-neutral-900 p-6 rounded-xl max-w-xl w-full border border-gray-300 dark:border-neutral-700 shadow-lg">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Withdrawal Details
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                Review and take action on this request.
                </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3 text-sm text-gray-800 dark:text-gray-100">
                <p><strong>User:</strong> {selectedWithdrawal.user.name} ({selectedWithdrawal.user.email})</p>
                <p><strong>credits:</strong> {selectedWithdrawal.amount}</p>
                <p><strong>Method:</strong> {selectedWithdrawal.method}</p>
                <p><strong>Status:</strong> <span className="capitalize">{selectedWithdrawal.status || "Pending"}</span></p>
                <p><strong>Created At:</strong> {new Date(selectedWithdrawal.createdAt).toLocaleString()}</p>

                {selectedWithdrawal.upi && (
                <p><strong>UPI:</strong> {selectedWithdrawal.upi.upiId}</p>
                )}

                {selectedWithdrawal.bank && (
                <>
                    <p><strong>Account Holder:</strong> {selectedWithdrawal.bank.accountHolder}</p>
                    <p><strong>Account Number:</strong> {selectedWithdrawal.bank.accountNumber}</p>
                    <p><strong>IFSC:</strong> {selectedWithdrawal.bank.ifsc}</p>
                </>
                )}

                {selectedWithdrawal.paypal && (
                <>
                    <p><strong>PayPal Email:</strong> {selectedWithdrawal.paypal.paypalEmail}</p>
                    <p><strong>SWIFT Code:</strong> {selectedWithdrawal.paypal.swiftCode}</p>
                </>
                )}
            </div>

            {isApprovalMode && (
                <div className="mt-6 space-y-3">
                <label htmlFor="conversion" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Set conversion rate
                </label>
                <Input
                    id="conversion"
                    type="number"
                    placeholder="e.g. 10 (for ₹10 or $10)"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(e.target.value)}
                    className="my-2 border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
                <Button
                    onClick={submitApproval}
                    className="cursor-pointer w-full"
                    disabled={!conversionRate}
                >
                    Submit Approval
                </Button>
                </div>
            )}

            {selectedWithdrawal.status === "approved" && (
              <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/30 dark:border-green-700">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                  <strong className="text-green-900 dark:text-green-100">Conversion Rate:</strong>{" "}
                  ₹{selectedWithdrawal?.conversionRate || "Not updated"}
                </p>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  <strong className="text-green-900 dark:text-green-100">Converted Amount:</strong>{" "}
                  ₹
                  {selectedWithdrawal?.conversionRate && selectedWithdrawal?.amount
                    ? `${(selectedWithdrawal.conversionRate * selectedWithdrawal.amount).toFixed(2)} (${selectedWithdrawal.amount} × ${selectedWithdrawal.conversionRate})`
                    : "Not available"}
                </p>
              </div>
            )}

            {selectedWithdrawal && selectedWithdrawal.status === "approved" && (
                    <div className="mt-2 space-y-4">
                      {/* Amount Paid Input */}
                      <div>
                        <label htmlFor="amountPaid" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          Amount Paid
                        </label>
                        <Input
                          id="amountPaid"
                          type="number"
                          placeholder="Enter the paid amount"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(e.target.value)}
                          className="mt-2 border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        />
                      </div>

                      {/* Payment Done By Input */}
                      <div>
                        <label htmlFor="paymentDoneBy" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          Payment Done By
                        </label>
                        <Input
                          id="paymentDoneBy"
                          type="text"
                          placeholder="e.g., Paytm, Bank Transfer, UPI"
                          value={paymentDoneBy}
                          onChange={(e) => setPaymentDoneBy(e.target.value)}
                          className="mt-2 border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        />
                      </div>

                      {/* Reference Number Input */}
                      <div>
                        <label htmlFor="referenceNumber" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          Reference Number
                        </label>
                        <Input
                          id="referenceNumber"
                          type="text"
                          placeholder="Enter transaction reference number"
                          value={referenceNumber}
                          onChange={(e) => setReferenceNumber(e.target.value)}
                          className="mt-2 border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                        />
                      </div>

                      {/* Update Button */}
                      <Button
                        onClick={handleUpdatePayment}
                        className="w-full cursor-pointer"
                        disabled={!amountPaid || !paymentDoneBy || !referenceNumber}
                      >
                        Update Payment
                      </Button>
                    </div>
                  )}





            <DialogFooter className="mt-6 flex justify-end gap-3">
                {!isApprovalMode && selectedWithdrawal.status === "pending" && (
                <>
                    <Button className="cursor-pointer" onClick={handleApprove}>
                    Approve
                    </Button>
                    <Button
                    className="cursor-pointer bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700"
                    variant="destructive"
                    onClick={rejectWithdrawal}
                    >
                    Reject
                    </Button>
                </>
                )}
                <Button
                className="cursor-pointer border border-gray-300 dark:border-neutral-600 text-gray-800 dark:text-white dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600"
                variant="outline"
                onClick={closeDialog}
                >
                Close
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        )}

    </div>
  );
};

export default AdminWithdrawal;
