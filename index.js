import express from 'express'
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kanbas/Users/routes.js";
import cors from "cors";
import "dotenv/config";
import session from "express-session";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import EnrollmentsRoutes from "./Kanbas/Enrollments/routes.js";
import AssignmentRoutes from "./Kanbas/Assignments/routes.js";
import mongoose from "mongoose";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kanbas"
const allowedOrigins = [
  "http://localhost:3000"
]
// Dynamically allow Netlify branch deploy URLs
if (process.env.NODE_ENV === "production") {
  allowedOrigins.push(/\.netlify\.app$/); // Match all *.netlify.app subdomains
}

// Connect to Database
console.log("database connection =" + CONNECTION_STRING );
mongoose.connect(CONNECTION_STRING);

const app = express();
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // Allow if no origin (e.g., server-to-server) or origin matches allowedOrigins
      if (!origin || allowedOrigins.some((o) => (typeof o === "string" ? o === origin : o.test(origin)))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kanbas",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
EnrollmentsRoutes(app)
AssignmentRoutes(app)
Lab5(app);
Hello(app);
app.listen(process.env.PORT || 4000)