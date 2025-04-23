// "use client";
// import { motion, useScroll, useTransform } from "framer-motion";
// import React, { useEffect, useRef, useState } from "react";

// const Homesec4 = () => {
//   const ref = useRef(null);
//   const containerRef = useRef(null);
//   const [height, setHeight] = useState(0);

//   useEffect(() => {
//     if (ref.current) {
//       const rect = ref.current.getBoundingClientRect();
//       setHeight(rect.height);
//     }
//   }, [ref]);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start 10%", "end 50%"],
//   });

//   const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
//   const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

//   const stepsData = [
//     {
//       title: "Step 1: Sign Up",
//       content: (
//         <div className="flex flex-col md:flex-row gap-10">
//           <div className="md:w-1/2">
//             <img
//               src="https://lirp.cdn-website.com/e2788c22/dms3rep/multi/opt/1-f40aff6c-1920w.png"
//               alt="Step 1"
//               className="w-full"
//             />
//           </div>
//           <div className="md:w-1/2">
//             <p>Create your free designer profile. Tell us about your skills and style.</p>
//             <button className="px-6 py-2 mt-4 bg-blue-600 text-white rounded-md">Get Started</button>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Step 2: View Brief",
//       content: (
//         <div className="flex flex-col md:flex-row gap-10">
//           <div className="md:w-1/2">
//             <p>
//               Access design briefs shared by verified jewelry businesses. Each brief includes clear guidelines, style inspirations, material specs, and deadlines.
//             </p>
//             <button className="px-6 py-2 mt-4 bg-blue-600 text-white rounded-md">Get Started</button>
//           </div>
//           <div className="md:w-1/2">
//             <img
//               src="https://lirp.cdn-website.com/e2788c22/dms3rep/multi/opt/2-1920w.png"
//               alt="Step 2"
//               className="w-full"
//             />
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Step 3: Submit Your Design",
//       content: (
//         <div className="flex flex-col md:flex-row gap-10">
//           <div className="md:w-1/2">
//             <img
//               src="https://lirp.cdn-website.com/e2788c22/dms3rep/multi/opt/3-1920w.png"
//               alt="Step 3"
//               className="w-full"
//             />
//           </div>
//           <div className="md:w-1/2">
//             <p>Upload your original sketch or concept design as per the brief. Add annotations or storyboards if needed.</p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Step 4: Get Selected & Get Paid",
//       content: (
//         <div className="flex flex-col md:flex-row gap-10">
//           <div className="md:w-1/2">
//             <p>If your design is selected, you receive payment as per the project’s reward amount. You'll be credited and compensated fairly.</p>
//           </div>
//           <div className="md:w-1/2">
//             <img
//               src="https://lirp.cdn-website.com/e2788c22/dms3rep/multi/opt/4-1920w.png"
//               alt="Step 4"
//               className="w-full"
//             />
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10" ref={containerRef}>
//       <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
//         <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
//           How It Works
//         </h2>
//       </div>
//       <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
//         {stepsData.map((item, index) => (
//           <div key={index} className="flex justify-center pt-10 md:pt-40 md:gap-10">
//             <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
//               <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
//                 <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
//               </div>
//               <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500">
//                 {item.title}
//               </h3>
//             </div>

//             <div className="relative pl-20 pr-4 md:pl-4 w-full">
//               {/* <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
//                 {item.title}
//               </h3> */}
//               <div className="flex flex-col">

//               {item.content}
//               </div>
//             </div>
//           </div>
//         ))}
//         <div
//           style={{
//             height: height + "px",
//           }}
//           className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
//         >
//           <motion.div
//             style={{
//               height: heightTransform,
//               opacity: opacityTransform,
//             }}
//             className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Homesec4;


"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import step1img from './images/step1.webp'
import step2img from './images/step2.webp'
import step3img from './images/step3.webp'
import step4img from './images/step4.webp'
import step5img from './images/step5.webp'


const Homesec4 = () => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  

  useEffect(() => {
    const handleResizeOrLoad = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };
  
    window.addEventListener("load", handleResizeOrLoad);
    window.addEventListener("resize", handleResizeOrLoad);
    handleResizeOrLoad();
  
    return () => {
      window.removeEventListener("load", handleResizeOrLoad);
      window.removeEventListener("resize", handleResizeOrLoad);
    };
  }, []);
  

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const stepsData = [
    {
      stepno: "Step 1",
      title: "Sign Up",
      image:
      step1img,
      content:
        "Create your free designer profile. Tell us about your skills and style.",
      isStarted: true,
    },
    {
      stepno: "Step 2",
      title: "View Brief",
      image:
      step2img,
      content:
        "Access design briefs shared by verified jewelry businesses. Each brief includes clear guidelines, style inspirations, material specs, and deadlines.",
      isStarted: true,
    },
    {
      stepno: "Step 3",
      title: "Submit Your Design",
      image:
      step3img,
      content:
        "Upload your original sketch or concept design as per the brief. Add annotations or storyboards if needed.",
      isStarted: false,
    },
    {
      stepno: "Step 4",
      title: "Get Selected & Get Paid",
      image:
      step4img,
      content:
        "If your design is selected, you receive payment as per the project’s reward amount. You'll be credited and compensated fairly.",
      isStarted: false,
    },
    {
      stepno: "Step 5",
      title: "Build Your Reputation",
      image:
      step5img,

      content:
        "Your profile grows with every submission, selection, and review – helping you become a go-to designer in the industry.",
      isStarted: true,
    },
  ];


  return (
    <div
    ref={containerRef}
    className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10 "
    >
      
      <div className="flex flex-col items-center   mx-auto pt-20 pb-10 px-4 md:px-8 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className=" text-lg md:text-4xl mb-1  text-black font-bold dark:text-white max-w-4xl"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center md:text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl"
        >
          Follow these easy steps to start designing and earning with real-world jewelry brands.
        </motion.p>
      </div>

      <div ref={ref} className="relative max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 xl:px-10 mx-auto pb-40 hidden md:block overflow-hidden">
        {stepsData.map((item, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            // viewport={{ once: true }}
            transition={{ staggerChildren: 0.3 }}
            className={`flex flex-col md:flex-row  items-center gap-10 py-20 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Image Block with Fade & Slide In */}
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: index % 2 === 0 ? -80 : 80,
                },
                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:w-1/3 w-full"
            >
              <motion.img
                src={item.image}
                alt={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="w-full rounded-xl shadow-2xl transition-transform duration-300"
              />
            </motion.div>

            {/* Sticky Middle with Spinning Dot */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-32 md:w-1/3 w-full z-40 flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="h-10 w-10 rounded-full bg-gradient-to-br from-black to-gray-500 shadow-md flex items-center justify-center"
              >
                <div className="h-4 w-4 rounded-full bg-white border border-neutral-300 dark:border-neutral-700" />
              </motion.div>
              <p className="mt-4 text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300">
                {item.stepno}
              </p>
              <h3 className="mt-2 text-lg md:text-2xl font-semibold text-neutral-700 dark:text-neutral-300">
                {item.title}
              </h3>
            </motion.div>

            {/* Description Block with Slide In */}
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: index % 2 === 0 ? 80 : -80,
                },
                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:w-1/3 w-full px-4"
            >
              <h1 className="text-xl font-bold text-black dark:text-white">
                {item.title}
              </h1>
              <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-300 mb-4">
                {item.content}
              </p>

              {item?.isStarted && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mt-2 px-6 py-2 bg-black hover:bg-transparent text-white hover:text-black hover:border hover:border-black font-semibold rounded-full shadow-lg transition-all"
                >
                  Get Started
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        ))}

        {/* Vertical Scroll Progress Line */}
        <div
          style={{ height: height + "px" }}
          className="absolute left-1/2 -translate-x-1/2 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-300 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] bg-gradient-to-t from-black via-gray-600 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
      
      {/* mobile version */}
        <div  className="block md:hidden px-4 py-10 space-y-8 max-w-md mx-auto">
        {stepsData.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-xl border border-neutral-200 dark:border-neutral-800"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[150px] object-contain rounded-lg mb-4"
            />
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {item.stepno}
              </p>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {item.content}
              </p>
              {item?.isStarted && (
                <button className="mt-4 px-5 py-2 bg-black text-white rounded-full hover:bg-transparent hover:text-black hover:border hover:border-black dark:hover:bg-white dark:hover:text-black transition-all text-sm font-medium">
                  Get Started
                </button>
              )}
            </div>
          </div>
        ))}
      </div>


      
    </div>
    




  );
};

export default Homesec4;