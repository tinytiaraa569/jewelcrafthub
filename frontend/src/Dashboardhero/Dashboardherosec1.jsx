import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { backendurl } from "@/server";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Dashboardherosec1 = () => {
  const [designs, setDesigns] = useState([]);
  const [approvedDesigns, setApprovedDesigns] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(0);
  const { user } = useSelector((state) => state.auth);

  const [useruploadedFiles, setuserUploadedFiles] = useState(0);
const [previousUploads, setPreviousUploads] = useState(0);
const [increaseRate, setIncreaseRate] = useState("0");
const [isTrendingUp, setIsTrendingUp] = useState(true);

const [userRank, setUserRank] = useState(null);
const fetchUserRank = async () => {
  try {
    const response = await axios.patch(
      `${backendurl}/userdesign/user-rank/${user?._id}`
    );
    setUserRank(response.data.rank);
  } catch (error) {
    console.error("Error fetching user rank:", error);
  }
};

  useEffect(() => {
    fetchUserDesigns();
    fetchUserRank()
  }, []);


  console.log(userRank,'user rank')
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
        `${backendurl}/userdesign/user-design/my-designs/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDesigns(response.data.designs);
      // Count total uploaded files
      const uploadedFilesCount = response.data.designs.reduce((acc, design) => {
        return acc + (design.files?.length || 0);
      }, 0);
 
      setUploadedFiles(uploadedFilesCount);
      


      // Count approved designs
      const approvedFilesCount = response.data.designs.reduce((acc, design) => {
        const approvedFiles = design.files?.filter(file => file.status === "approved") || [];
        return acc + approvedFiles.length;
      }, 0);
      
      setApprovedDesigns(approvedFilesCount);


       
    } catch (error) {
      console.error("Error fetching user designs:", error);
    }
  };

  useEffect(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = (thisMonth - 1 + 12) % 12;
    const currentYear = now.getFullYear();
  
    let thisMonthUploads = 0;
    let lastMonthUploads = 0;
  
    designs.forEach((design) => {
      const createdAt = new Date(design.createdAt);
      const designMonth = createdAt.getMonth();
      const designYear = createdAt.getFullYear();
  
      if (designYear === currentYear && designMonth === thisMonth) {
        thisMonthUploads += design.files?.length || 0;
      } else if (designYear === currentYear && designMonth === lastMonth) {
        lastMonthUploads += design.files?.length || 0;
      }
    });
  
    const uploaded = thisMonthUploads;
    const previous = lastMonthUploads;
  
    const rate = previous
      ? (((uploaded - previous) / previous) * 100).toFixed(2)
      : uploaded > 0 ? "100" : "0";
  
    const isUp = parseFloat(rate) >= 0;
  
    // Set all final values here (you might have these in state):
    setPreviousUploads(previous);
    setuserUploadedFiles(uploaded);
    setIncreaseRate(rate);
    setIsTrendingUp(isUp);
  }, [designs]);
  

  const dashboardCards = [
    {
      description: "Total Earnings",
      value: `₹${user?.totalEarnings || 0}`,
      trend: "+8.2%",
      trendingUp: true,
      footerText: "Earnings up this month",
      footerSubText: "Steady growth in revenue",
      buttonText: "View Earnings",
      link: "/user-payouts",
    },
    {
      description: "Total Designs Uploaded",
      value: `${uploadedFiles}`, // e.g., "12"
      trend:
        previousUploads > 0
          ? isTrendingUp
            ? `+${increaseRate}%`
            : `${increaseRate}%`
          : uploadedFiles > 0
          ? "New uploads"
          : "—",
      trendingUp: isTrendingUp,
      footerText:
        previousUploads === 0 && uploadedFiles > 0
          ? "First time uploads"
          : isTrendingUp
          ? "Uploads increased"
          : "Uploads decreased",
      footerSubText: "Your latest contributions",
      buttonText: "View Designs",
      link: "/user-designupload",
    }
    ,
    {
      description: "Approved Designs",
      value: `${approvedDesigns}`,
      trend: "+10%",
      trendingUp: true,
      footerText: "Designs approved",
      footerSubText: "Keep uploading designs",
      buttonText: "View Approved Designs",
      link: "/user-designupload",
    },
    {
      description: "User Ranking",
      value: userRank ? `#${userRank}` : "Loading...",
      trend: userRank && userRank <= 10 ? "Top 10%" : `${userRank}`,
      trendingUp: userRank && userRank <= 10,
      footerText: "Excellent performance",
      footerSubText: "Keep climbing the ranks",
      buttonText: "View Ranking",
      link: "/user-designupload",
    },
  ];

  return (
    <div className="grid my-4 grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:px-6">
      {dashboardCards.map((card, idx) => (
        <Card
          key={idx}
          className="hover:shadow-lg transition-shadow dark:bg-stone-950 dark:border-muted border border-border dark:hover:bg-muted/20 "
        >
          <CardHeader className="relative">
            <CardDescription className="dark:text-muted-foreground">
              {card.description}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold sm:text-3xl tabular-nums dark:text-white">
              {card.value}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className={`flex gap-1 rounded-lg text-xs ${
                  card.trendingUp ? "text-green-500" : "text-red-500"
                }`}
              >
                {card.trendingUp ? (
                  <TrendingUpIcon className="size-3" />
                ) : (
                  <TrendingDownIcon className="size-3" />
                )}
                {card.trend}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.footerText}
              {card.trendingUp ? (
                <TrendingUpIcon className="size-4 text-green-500" />
              ) : (
                <TrendingDownIcon className="size-4 text-red-500" />
              )}
            </div>
            <div className="text-muted-foreground">{card.footerSubText}</div>
            <Link to={card.link}>
              <Button variant="outline" className="mt-2 w-full">
                {card.buttonText}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Dashboardherosec1;
