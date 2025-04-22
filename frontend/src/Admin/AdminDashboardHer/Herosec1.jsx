import { IndianRupeeIcon, PaletteIcon, TrendingDownIcon, TrendingUpIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { backendurl } from "@/server";
import axios from "axios";

export function HeroSec1() {

  const [users, setUsers] = useState([]);
  const [briefs, setBriefs] = useState([]);
  const [briefChange, setBriefChange] = useState(null); // For % change
    const [designsData, setDesignsData] = useState([]);
  

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/admin/all-users`, {
        withCredentials: true,
      });
      setUsers(data);
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to fetch users.");
    }
  };

  const fetchBriefs = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/brief/get-all-briefs`, {
        withCredentials: true,
      });
  
      const allBriefs = data.briefs;
      setBriefs(allBriefs);
  
      // Calculate change over the last 7 days
      const now = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
  
      const lastWeekBriefs = allBriefs.filter(
        (brief) => new Date(brief.createdAt) >= oneWeekAgo
      );
  
      const previousWeekStart = new Date();
      previousWeekStart.setDate(now.getDate() - 14);
  
      const previousWeekBriefs = allBriefs.filter(
        (brief) =>
          new Date(brief.createdAt) >= previousWeekStart &&
          new Date(brief.createdAt) < oneWeekAgo
      );
  
      const currentCount = lastWeekBriefs.length;
      const previousCount = previousWeekBriefs.length;
  
      const percentChange =
        previousCount === 0 ? 100 : ((currentCount - previousCount) / previousCount) * 100;
  
      setBriefChange(percentChange.toFixed(1));
    } catch (error) {
      console.error("Error fetching briefs:", error);
    }
  };

  console.log(users,'user from hero')

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get(`${backendurl}/userdesign/user-design/all-designs`, {
          withCredentials: true,
        });
        setDesignsData(response.data.designs || []);
      } catch (error) {
        console.error('Error fetching designs data:', error);
      }
    };
    fetchDesigns();
  }, []);

  // Count approved, pending, and rejected files
  const totalDesigns = designsData.flatMap(design => design.files || []).length;
  const approved = designsData.flatMap(design => design.files || []).filter(file => file.status === 'approved').length;
  const pending = designsData.flatMap(design => design.files || []).filter(file => file.status === 'pending').length;
  const rejected = designsData.flatMap(design => design.files || []).filter(file => file.status === 'rejected').length;
  
  

  useEffect(() => {
    fetchUsers();
    fetchBriefs()
  }, []);

  const totalRevenue = users.reduce(
    (total, user) => total + (user.totalEarnings || 0),
    0
  );

  console.log(users,'users')
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
      {/* Total Revenue */}
      <Card className="shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="relative">
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
          ₹{totalRevenue.toLocaleString("en-IN")}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <IndianRupeeIcon className="size-3" />
              
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
          Spend insights <IndianRupeeIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
           Total earnings Spend in services
          </div>
        </CardFooter>
      </Card>

      {/* New Customers */}
      <Card className="shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="relative">
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
            {users.length}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <UsersIcon className="size-3" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total registered users
          </div>
          <div className="text-muted-foreground">
            Growing userbase, strong traction.
          </div>
        </CardFooter>
      </Card>



      {/* Total Briefs */}
      <Card className="shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="relative">
          <CardDescription>Total Briefs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
            {briefs.length}
          </CardTitle>
          <div className="absolute right-4 top-4">
          {briefChange !== null && (
            <Badge
              variant="outline"
              className={`flex gap-1 rounded-lg text-xs ${
                briefChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {briefChange >= 0 ? (
                <TrendingUpIcon className="size-3" />
              ) : (
                <TrendingDownIcon className="size-3" />
              )}
              {briefChange}%
            </Badge>
          )}
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Increasing creative briefs
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            More briefs, more growth
          </div>
        </CardFooter>
      </Card>


      {/* Growth Rate */}
      <Card className="shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="relative">
          <CardDescription>Total Designs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl flex ">
            {totalDesigns}
            {/* Breakdown: Approved / Pending / Rejected */}
            <div className="mb-1 text-xs font-medium flex  self-end">
              <span className="text-green-600"> {approved}</span>
              <span className="text-yellow-600"> /{pending}</span>
              <span className="text-red-600">/{rejected}</span>
            </div>
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <PaletteIcon className="size-3" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Designs submitted <PaletteIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Includes all uploaded custom designs
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
