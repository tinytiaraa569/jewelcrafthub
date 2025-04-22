import { briefdata } from "@/breif";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendurl, imgurl } from "@/server";
import { Clock, Image, Tag, Video, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Document, Page, View, Text, StyleSheet, pdf, Font ,Image as Imagefrompdf} from '@react-pdf/renderer';

import ReactPDF from '@react-pdf/renderer';
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";

const DesignRequirement = () => {
    // const[briefdata,setbriefdata] = useState([])
  const { user } = useSelector((state) => state.auth);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [briefdetailPopover, setbriefdetailPopover] = useState(false);
    const [selectedDesign, setSelectedDesign] = useState(null);

    const [categories, setCategories] = useState([]);
    const currentUserId = user?._id
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const res = await axios.get(`${backendurl}/category/all-categories`)
          setCategories(res.data.categories || [])
        } catch (err) {
          console.log(err,'error')
        }
      }
  
      fetchCategories();
    }, []);

    // const requiredSketches = [
    //     {
    //         id: 1,
    //         title: "Vintage Diamond Ring",
    //         category: "Ring",
    //         deadline: "April 10, 2025",
    //         isnew: true,
    //         reward: "₹5,000",
    //         details: {
    //             date: "24/03/2025",
    //             Name: "FNCYSHP2504-02",
    //             category: ["Ring", "Pendants", "Earrings"],
    //             styling: "All Diamond, No Color stone classic designs. Less round diamonds",
    //             Dimension: "BR_7.25",
    //             Targetcount: "50 each category",
    //             targetdate: "28/04/2025",
    //             diamondshapes: "All fancy round bigger",
    //             category: ["Pendant","Rings","Necklace"],
    //             styling: "Elegant gold pendant with fine detailing.",
    //             Dimension: "Medium",
    //             Targetcount: "30 designs per category",
    //             targetdate: "30/04/2025",
    //             diamondshapes: "Round, Oval",
    //             diamondweightrange:"50gms",
    //             colorstoneshape:"oval",
    //             colorstonerange:"400",
    //             pearlsize:"100inch",
    //             Instruction:"Make pendant option as pass through chain",
    //             referenceimg: [
    //             {
    //                 public_id: "1743397663522-67e7a5fcde846ff2c190dd7f-7.webp",
    //                 type: "file",
    //                 url: "/uploads/user/design/67e7a5fcde846ff2c190dd7f/1743397663522-67e7a5fcde846ff2c190dd7f-7.webp",
    //             },
    //             {
    //                 public_id: "1743397663528-67e7a5fcde846ff2c190dd7f-6.webp",
    //                 type: "file",
    //                 url: "/uploads/user/design/67e7a5fcde846ff2c190dd7f/1743397663528-67e7a5fcde846ff2c190dd7f-6.webp",
    //             },
    //             {
    //                 public_id: "1743397663536-67e7a5fcde846ff2c190dd7f-4__2_.webp",
    //                 type: "file",
    //                 url: "/uploads/user/design/67e7a5fcde846ff2c190dd7f/1743397663536-67e7a5fcde846ff2c190dd7f-4__2_.webp",
    //             },
    //         ],
    //         },
    //     },
    //     {
    //         id: 2,
    //         title: "Minimalist Gold Pendant",
    //         category: "Pendant",
    //         deadline: "March 25, 2025",
    //         isnew: true,
    //         reward: "₹4,500",
    //         details: {
    //             date: "25/03/2025",
    //             Name: "FNCYPEND2504",
    //             category: ["Pendant"],
    //             styling: "Elegant gold pendant with fine detailing.",
    //             Dimension: "Medium",
    //             Targetcount: "30 designs",
    //             targetdate: "30/04/2025",
    //             diamondshapes: "Round, Oval",
    //             referenceimg: [
    //                 {
    //                     public_id: "1743397663522-67e7a5fcde846ff2c190dd7f-7.webp",
    //                     type: "file",
    //                     url: "/uploads/user/design/67e7a5fcde846ff2c190dd7f/1743397663522-67e7a5fcde846ff2c190dd7f-7.webp",
    //                 },
    //                 {
    //                     public_id: "1743397663528-67e7a5fcde846ff2c190dd7f-6.webp",
    //                     type: "file",
    //                     url: "/uploads/user/design/67e7a5fcde846ff2c190dd7f/1743397663528-67e7a5fcde846ff2c190dd7f-6.webp",
    //                 },
    //                 {
    //                     public_id: "1743397663536-67e7a5fcde846ff2c190dd7f-4__2_.webp",
    //                     type: "file",
    //                     url: "/uploads/user/design/67e7a5fcde846ff2c190dd7f/1743397663536-67e7a5fcde846ff2c190dd7f-4__2_.webp",
    //                 },
    //             ],

    //         },
    //     },{
    //         id: 3,
    //         title: "Minimalist Gold Pendant",
    //         category: "Pendant",
    //         deadline: "March 25, 2025",
    //         isnew: false,
    //         reward: "₹4,500",
    //         details: {
    //             date: "25/03/2025",
    //             Name: "FNCYPEND2504",
    //             category: ["Pendant","Rings","Necklace"],
    //             styling: "Elegant gold pendant with fine detailing.",
    //             Dimension: "Medium",
    //             Targetcount: "30 designs per category",
    //             targetdate: "30/04/2025",
    //             diamondshapes: "Round, Oval",
    //             diamondweightrange:"50gms",
    //             colorstoneshape:"oval",
    //             colorstonerange:"400",
    //             pearlsize:"100inch",
    //             Instruction:"Make pendant option as pass through chain",
    //             referenceimg: [
    //             {
    //                 public_id: "1743397663522-67e7a5fcde846ff2c190dd7f-7.webp",
    //                 type: "file",
    //                 url: "/uploads/user/design/67e7a5fcde846ff2c190dd7f/1743397663522-67e7a5fcde846ff2c190dd7f-7.webp",
    //             },
    //             {
    //                 public_id: "1743397663528-67e7a5fcde846ff2c190dd7f-6.webp",
    //                 type: "file",
    //                 url: "/uploads/user/design/67e7a5fcde846ff2c190dd7f/1743397663528-67e7a5fcde846ff2c190dd7f-6.webp",
    //             },
    //             {
    //                 public_id: "1743397663536-67e7a5fcde846ff2c190dd7f-4__2_.webp",
    //                 type: "file",
    //                 url: "/uploads/user/design/67e7a5fcde846ff2c190dd7f/1743397663536-67e7a5fcde846ff2c190dd7f-4__2_.webp",
    //             },
    //         ],
    //         },
    //     },
    // ];
    const[brief,setBreifs] = useState([])

           const fetchBriefs = async () => {
            try {
              const { data } = await axios.get(`${backendurl}/brief/get-all-briefs`);
              // Filter briefs where isLive is true
              const liveBriefs = data.briefs.filter(
                (brief) => brief.isLive && brief.visibleTo?.includes(currentUserId)
              );
              setBreifs(liveBriefs); // Store only live briefs
            } catch (error) {
              console.error("Error fetching briefs:", error);
            } 
          };
    
          useEffect(() => {
            fetchBriefs();
          }, []);

          console.log(brief,'briefdata')

    const getRemainingTime = (deadline) => {
        const diff = new Date(deadline) - new Date();
        const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
        return daysLeft > 0 ? `${daysLeft} days left` : "Closed";
    };

    const filteredSketches = brief.filter((item) =>
      selectedCategory === "All" ||
      (item.category[selectedCategory] && item.category[selectedCategory] === true)
    );

    const handlebriefOpenPopover = (design) => {
        setSelectedDesign(design);
        setbriefdetailPopover(true);
    };

    const handlebriefClosePopover = () => {
        setbriefdetailPopover(false);
        setSelectedDesign(null);
    };
     // Check if URL is an image or video based on extension
    const isImage = (url) => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
  return validExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};
 const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

// Register Poppins font from local files
Font.register({
    family: 'Poppins',
    src: 'src/assets/Poppins-Regular.ttf', // Path to your local font file
  });
  
  Font.register({
    family: 'Poppins',
    src: 'src/assets/Poppins-Bold.ttf', // Path to Bold font file
    fontWeight: 'bold',
  });
  

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 20,
    },
    section: {
      margin: 10,
      padding: 10,
      border: '2px solid #000', // Outer border for the section
      borderRadius: 8, // Optional rounded corners for the section
    },
    header: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      fontFamily: 'Poppins',
    },
    categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
    },
    categoryItem: {
      padding: 5,
      margin: 5,
      backgroundColor: '#f4f4f4',
      borderRadius: 5,
      fontFamily: 'Poppins',
    },
    table: {
      width: '100%',
      border: '1px solid #ddd',
      borderCollapse: 'collapse',
      marginTop: 20,
    },
    tableHeader: {
      backgroundColor: '#f4f4f4',
      padding: 5,
      textAlign: 'left',
      fontWeight: 'bold',
      fontFamily: 'Poppins',
    },
    tableData: {
      padding: 5,
      border: '1px solid #ddd',
      fontFamily: 'Poppins',
    },
    imageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    imageItem: {
      width: '45%',
      height: '200px',
      marginBottom: 10,
      border: '1px solid #ddd', // Border inside each image container
      padding: 5,
    },
    details: {
      marginTop: 20,
      border: '1px solid #ddd', // Inner border for details
      padding: 10,
      borderRadius: 8,
    },
    detailsTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
      fontFamily: 'Poppins',
    },
    detailsText: {
      fontSize: 12,
      marginBottom: 5,
      fontFamily: 'Poppins',
    },
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Date on left and target date on right
      marginBottom: 10,
    },
    dateText: {
      fontSize: 12,
      fontFamily: 'Poppins',
    },
    namecon:{
        fontSize:14,
        fontFamily: 'Poppins',
        flexDirection:'row',
        gap:'4px'

    },
    nameconText:{
        fontSize: 12,
        fontFamily: 'Poppins',
    },
    categoryContainer:{
        fontSize:10,
        fontFamily: 'Poppins',
        flexDirection:'row',
        gap:'4px'
    },
    categoryText: {
        fontSize: 12,
        fontFamily: 'Poppins',
        marginLeft: 10, // Add some spacing between categories
      },
  });
  
  const MyDocument = ({ selectedDesign }) => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          {/* Header */}
          <Text style={styles.header}>Concept Brief - {selectedDesign?.title}</Text>
  
          {/* Date Section (left and right alignment) */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              Date: {selectedDesign?.details?.targetdate}
            </Text>
            <Text style={styles.dateText}>
              Target Date: {selectedDesign?.details?.targetdate}
            </Text>
          </View>

           {/* Categories on the right */}
           <View style={styles.categoryContainer}>
            <Text>
                Category : 

            </Text>
          {selectedDesign?.details?.category.map((category, index) => (
            <Text key={index} style={styles.categoryText}>
              {category}
            </Text>
          ))}
        </View>

            {/* Date Section (left and right alignment) */}
            <View style={styles.namecon}>
            <Text style={styles.nameconText}>
              Name : 
            </Text>
            <Text style={styles.nameconText}>
             {selectedDesign?.details?.Name}
            </Text>
          </View>
  
          
  
          {/* Reference Images */}
          <Text style={styles.detailsTitle}>Reference Images</Text>
          <View style={styles.imageContainer}>
            {selectedDesign?.details?.referenceimg?.map((file, index) => {
              return (
                <View key={index} style={styles.imageItem}>
                  <Text>{`Image ${index + 1}`}</Text>
                  {/* Check if the URL is valid and an image */}
                  {file.url && isImage(file.url) && (
                    <Imagefrompdf
                      style={{ width: '100%', height: 150 }}
                      src={`${imgurl}${file.url}`} // Ensure the image URL is complete and accessible
                    />
                  )}
                </View>
              );
            })}
          </View>
  
          {/* Design Details */}
          <View style={styles.details}>
            <Text style={styles.detailsTitle}>Design Details</Text>
            <Text style={styles.detailsText}><strong>Design Name:</strong> {selectedDesign?.details?.Name}</Text>
            <Text style={styles.detailsText}><strong>Category:</strong> {selectedDesign?.details?.category?.join(", ")}</Text>
            <Text style={styles.detailsText}><strong>Styling:</strong> {selectedDesign?.details?.styling}</Text>
            <Text style={styles.detailsText}><strong>Dimension:</strong> {selectedDesign?.details?.Dimension}</Text>
            <Text style={styles.detailsText}><strong>Target Count:</strong> {selectedDesign?.details?.Targetcount}</Text>
            <Text style={styles.detailsText}><strong>Target Date:</strong> {selectedDesign?.details?.targetdate}</Text>
            <Text style={styles.detailsText}><strong>Diamond Shapes:</strong> {selectedDesign?.details?.diamondshapes}</Text>
            <Text style={styles.detailsText}><strong>Diamond Weight Range:</strong> {selectedDesign?.details?.diamondweightrange}</Text>
            <Text style={styles.detailsText}><strong>Color Stone Shape:</strong> {selectedDesign?.details?.colorstoneshape}</Text>
            <Text style={styles.detailsText}><strong>Color Stone Range:</strong> {selectedDesign?.details?.colorstonerange}</Text>
            <Text style={styles.detailsText}><strong>Pearl Size:</strong> {selectedDesign?.details?.pearlsize}</Text>
            <Text style={styles.detailsText}><strong>Instruction:</strong> {selectedDesign?.details?.Instruction}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
  // Button click handler for downloading the PDF

const handleDownloadPDF = async () => {
  try {
    const blob = await pdf(<MyDocument selectedDesign={selectedDesign} />).toBlob();

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'concept-brief.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
const allCategory = { _id: 'all', categoryName: 'All', categoryShortform: 'ALL' };
const categoriesWithAll = [allCategory, ...categories];





    return (
        <div className="p-4 sm:p-6 space-y-6 !overflow-hidden">
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Sketch & Design</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Submit your jewelry sketches and designs to earn and collaborate with us.
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categoriesWithAll.length > 0 ? (
                categoriesWithAll.map((category) => (
                  <Button
                    key={category._id} // Use the unique _id field as the key
                    variant={selectedCategory === category.categoryName ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.categoryName)}
                    className="cursor-pointer w-auto" // Ensure button size adjusts to content
                  >
                    {category.categoryName}
                  </Button>
                ))
              ) : (
                <p>Loading categories...</p> // A loading state when categories are being fetched
              )}
            </div>


            <h3 className="text-lg sm:text-xl font-semibold mb-4">Latest Required Designs</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSketches.length > 0 ? (
              filteredSketches
                .filter((item) => item?.visibleTo?.includes(currentUserId)) // Only show if visible to current user
                .map((item) => (
                    <div key={item._id} className="relative">
                        {/* NEW Badge */}
                        {item.statusmap && (
                          <div
                            className={`absolute -top-2 -left-2 text-white text-xs font-semibold px-2 py-1 rounded-tr-md rounded-bl-md shadow-md 
                            ${
                              item.statusmap.toLowerCase() === 'new' 
                                ? 'bg-red-500' // Red for urgent
                                : item.statusmap.toLowerCase() === 'priority' 
                                ? 'bg-yellow-500' // Yellow for priority
                                : item.statusmap.toLowerCase() === 'urgent'
                                ? 'bg-blue-500' // Blue for new
                                : 'bg-green-500' // Green for default or other status
                            }`}
                          >
                            {item.statusmap}
                          </div>
                        )}


                        <Card className="!cursor-pointer border border-gray-200 shadow-md dark:bg-neutral-900 dark:border-neutral-700 dark:text-white hover-card" onClick={() => handlebriefOpenPopover(item)}>
                        <CardHeader>
                            {/* Show details.Name as the title */}
                            <CardTitle className="text-lg font-semibold">
                            {item?.name || item.title}
                            </CardTitle>
                            <p></p>
                        </CardHeader>

                        <CardContent className="space-y-2">
                            {/* Display all categories inside details.category */}
                            {item?.category && typeof item.category === 'object' && (
                              <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
                                  {/* Get the visible categories that are true */}
                                  {Object.keys(item.category)
                                    .filter((cat) => item.category[cat]) // Show only categories with true value
                                    .slice(0, 3) // Show only the first 3 categories (you can adjust this number)
                                    .map((cat, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded-md text-xs font-medium flex items-center gap-1"
                                      >
                                        <Tag className="w-4 h-4 text-blue-500" />
                                        {cat}
                                      </span>
                                    ))}

                                  {/* Add '...' after the visible categories if there are more */}
                                  {Object.keys(item.category).filter((cat) => item.category[cat]).length > 3 && (
                                    <span
                                      className="text-xs font-medium text-gray-500 dark:text-gray-400"
                                      style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    >
                                      ...
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}



                            {/* Deadline & Reward */}
                            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mt-3">
                            <div className="flex justify-center items-center gap-1">
                                <Clock className="w-4 h-4 mr-2 text-red-500" /> {getRemainingTime(item.targetdate)}
                            </div>
                            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
                                Earn {item.rewardPoints} Credits
                            </span>
                            </div>

                            {/* View Details Button */}
                            <Button
                            variant="outline"
                            className="mt-3 w-full dark:border-neutral-600 dark:text-gray-300 cursor-pointer dark:bg-neutral-800"
                            onClick={() => handlebriefOpenPopover(item)}
                            >
                            View Details
                            </Button>
                        </CardContent>
                        </Card>
                    </div>
                    ))
                ) : (
                    <div className="text-gray-600 dark:text-neutral-500 text-md font-medium mt-2">
                    Stay tuned for the latest upload!
                    </div>
                )}
            </div>

            {briefdetailPopover && selectedDesign && (
                <div className="fixed inset-0 bg-[#0000008c] flex items-center justify-center z-50 min-h-screen">
                    <div className="relative w-full max-w-4xl p-8 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-xl">
                        {/* Close Button */}
                        <button
                            onClick={handlebriefClosePopover}
                            className="cursor-pointer absolute top-4 right-4 text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 hover:dark:text-neutral-200 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Scrollable Content */}
                        <div className="max-h-[70vh] overflow-y-auto space-y-4 scrollbar-hidden">
                          <div className="mt-3">

                            <h3 className="text-center text-xl font-semibold text-neutral-900 dark:text-white">Concept Brief - {selectedDesign.title}</h3>

                            <h5 className="text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mt-1">
                                {selectedDesign.name}
                            </h5>
                          </div>

                            {/* Category Section with small, attractive style */}
                            <div className="space-y-4 mt-4">
                            <div className="flex flex-wrap gap-4">
                              {Object.keys(selectedDesign.category)
                                .filter((category) => selectedDesign.category[category]) // Only categories with true value
                                .map((category, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 px-2.5 bg-neutral-100 border border-neutral-200 dark:bg-neutral-700 dark:border-neutral-700 rounded-[10px] shadow-md transition-transform transform hover:scale-105 cursor-pointer hover:bg-blue-100 dark:hover:bg-neutral-600"
                                  >
                                    <Tag className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                                    <span className="ml-2 text-xs font-medium text-neutral-700 dark:text-neutral-200">
                                      {category}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>



                            
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Reference Images</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                                    {selectedDesign?.files?.map((file, index) => (
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

                              {/* Design Details Section */}
                            <div className="space-y-4 mt-6">
                            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Design Details</h3>
                            
                            <div className="space-y-3">
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Design Name:</strong> {selectedDesign.name}
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Category:</strong> 
                                {Object.keys(selectedDesign.category)
                                  .filter((category) => selectedDesign.category[category]) // Only categories with true value
                                  .join(", ")}
                              </p>

                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Styling:</strong> {selectedDesign.styling}
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Dimension:</strong> {selectedDesign.dimension}
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Target Count:</strong> {selectedDesign.targetcount}
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Target Date:</strong> {selectedDesign.targetdate}
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Diamond Shapes:</strong> {selectedDesign.diamondshapes}
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Diamond Weight Range:</strong> {selectedDesign.diamondweightrange}
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Color Stone Shape:</strong> {selectedDesign.colorstoneshape}
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Color Stone Range:</strong> {selectedDesign.colorstonerange}
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Pearl Size:</strong> {selectedDesign.pearlsize}
                                </p>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                <strong>Instruction:</strong> {selectedDesign.instruction}
                                </p>
                            </div>
                            </div>


                        </div>

                        {/* Close Button at the Bottom */}
                        <div className="flex justify-center mt-6 gap-3">
                            <Button variant="outline" onClick={handlebriefClosePopover} className="cursor-pointer">
                                Close
                            </Button>

                            <Button className='cursor-pointer dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:text-neutral-100' onClick={handleDownloadPDF}>Download pdf</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DesignRequirement;
