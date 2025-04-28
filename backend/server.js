const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const app = express();

//  Enable CORS with specific frontend origin and credentials
app.use(
  cors({
    origin: "https://jewelcrafthub.vercel.app",  // Allow only your frontend
    credentials: true,                // Allow cookies & auth headers
  })
);


app.use(cookieParser());

//  Configure JSON and URL-encoded body parsers with increased limits
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true })); 

//  Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Import route controllers
const auth = require("./controllers/authController");
const usernotification = require("./controllers/usernotifications");
const userportfolio = require("./controllers/userportfolio");
const userdesign = require("./controllers/userdesign");
const userpayout = require("./controllers/userpayout");


// admin
const adminuser = require("./controllers/adminuser");
const adminnotification = require("./controllers/adminnotification");


// brief 
const brief = require("./controllers/brief")


//category
const category = require("./controllers/category")


// withdrawal

const withdrawal = require("./controllers/withdrawal")


//support 

const usersupport = require("./controllers/supportController")


//analytics
const analytics = require("./controllers/analyticscontroller")


//  Define API routes
app.use("/api/auth", auth);
app.use("/api/notification", usernotification);
app.use("/api/userportfolio", userportfolio);
app.use("/api/userdesign", userdesign);
app.use("/api/payout", userpayout);

app.use("/api/admin", adminuser);
app.use("/api/adminnotification", adminnotification);


app.use("/api/brief", brief);

app.use("/api/category", category);

app.use("/api/withdrawal", withdrawal);
app.use("/api/usersupport", usersupport);


app.use("/api/analytics", analytics);









//  Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
