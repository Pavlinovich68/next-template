import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router/server.router.js";
import errorMiddleware from './middlewares/error-middleware.js';

dotenv.config();


const PORT = process.env.PORT || 5000;
const app = express();


 app.use(express.json({ limit: '50mb' }));
 app.use(express.urlencoded({ limit: '50mb', extended: true }));
 app.use(cookieParser());
 app.use(cors({
   credentials: true,
   origin: process.env.CLIENT_URL
 }));
 app.use('/api', router);
 app.use(errorMiddleware); // Всегда должен быть последним

const start = async () => {
   try {
      app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
   } catch (e) {
      console.log(e);      
   }   
}

start()