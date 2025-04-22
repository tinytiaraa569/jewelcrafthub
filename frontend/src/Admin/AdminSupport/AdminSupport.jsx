import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { backendurl } from '@/server';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AdminSupport = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        const response = await axios.get(
          `${backendurl}/usersupport/admin/support-requests`,
          { withCredentials: true }
        );
        const enrichedData = response.data.data.map((req) => ({
          ...req,
          status: req.status || "Open",
          priority: req.priority || ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
        }));
        setSupportRequests(enrichedData || []);
      } catch (error) {
        console.error("Error fetching support requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportRequests();
  }, []);

  const updateSupportRequest = async () => {
    if (!selectedRequest) return;

    if (selectedRequest.status === 'Closed') {
      toast.info("This request is closed. No further actions can be updated.");
      return;
    }

    try {
      setUpdating(true);
      await axios.patch(
        `${backendurl}/usersupport/admin/support-requests/${selectedRequest._id}`,
        { status, priority },
        { withCredentials: true }
      );
      setSupportRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id ? { ...req, status, priority } : req
        )
      );
      toast.success("Support request updated");
    } catch (error) {
      toast.error("Failed to update support request");
      console.error("Error updating support request:", error);
    } finally {
      setUpdating(false);
    }
  };

  const statusBadge = (status) => (
    <Badge
      className={`text-xs ${
        status === "Open"
          ? "bg-green-200 text-green-800"
          : status === "Closed"
          ? "bg-gray-300 text-gray-800"
          : "bg-yellow-200 text-yellow-800"
      }`}
    >
      {status}
    </Badge>
  );

  const priorityBadge = (priority) => (
    <Badge
      className={`text-xs ${
        priority === "High"
          ? "bg-red-200 text-red-800"
          : priority === "Medium"
          ? "bg-yellow-200 text-yellow-800"
          : "bg-blue-200 text-blue-800"
      }`}
    >
      {priority}
    </Badge>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 mx-auto dark:bg-background bg-white rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Support Requests</h2>
          <p className="text-sm text-muted-foreground">
            View and manage all incoming support requests from users.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading...</div>
      ) : supportRequests.length === 0 ? (
        <div className="text-center text-muted-foreground">No support requests found.</div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supportRequests.map((req, index) => (
                <TableRow key={req._id} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                  <TableCell>{req.name}</TableCell>
                  <TableCell>{req.email}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{req.subject}</TableCell>
                  <TableCell>{statusBadge(req.status)}</TableCell>
                  <TableCell>{priorityBadge(req.priority)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-sm cursor-pointer"
                          onClick={() => {
                            setSelectedRequest(req);
                            setStatus(req.status);
                            setPriority(req.priority);
                          }}
                        >
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Support Request Details</DialogTitle>
                          <DialogDescription>
                            Submitted on:{" "}
                            {new Date(req.createdAt).toLocaleString()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div><strong>Name:</strong> {req.name}</div>
                            <div><strong>Email:</strong> {req.email}</div>
                          </div>
                          <div><strong>Subject:</strong> {req.subject}</div>
                          <div>
                            <strong>Message:</strong>
                            <div className="bg-muted p-3 rounded mt-1 whitespace-pre-wrap border border-gray-300 dark:border-gray-700">
                              {req.message}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className='mb-2'>Status</Label>
                              <Select value={status} onValueChange={setStatus} disabled={req.status === "Closed"}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Open">Open</SelectItem>
                                  <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className='mb-2'>Priority</Label>
                              <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Low">Low</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between pt-4">
                          <DialogClose asChild>
                            <Button className='cursor-pointer' variant="secondary">Close</Button>
                          </DialogClose>
                          <Button
                            onClick={updateSupportRequest}
                            disabled={updating || req.status === "Closed"}
                          >
                            {req.status === "Closed" ? "Issue Solved" : updating ? "Updating..." : "Update"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
