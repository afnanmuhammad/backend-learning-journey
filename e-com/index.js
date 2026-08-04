import express from "express";
import mongoose from "mongoose";
import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import Backend from "i18next-fs-backend";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import categoryRouter from "./routes/category.route.js";
import userRouter from "./routes/auth.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import productRouter from "./routes/produtc.routes.js";
import orderRouter from "./routes/order.routes.js"

dotenv.config();

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    lng: "en",
    fallbackLng: "en",
    backend: {
      loadPath: "./locales/{{lng}}.json",
    },
  });

const app = express();
const port = process.env.PORT || 3000;
const api = process.env.API || "/api/v1";

app.use(i18nextMiddleware.handle(i18next));
app.use(express.json());
app.use(morgan("combined"));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://mydomain.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error:", error);
  });

/****************************** */
app.use(`${api}/auth`, userRouter);
app.use(`${api}/categories`, authMiddleware, categoryRouter);
app.use(`${api}/product`, authMiddleware, productRouter);
app.use(`${api}/orders`, authMiddleware, orderRouter);
app.use("/public/uploads", express.static("public/uploads"))

app.get("/health", (req, res) => {
  res.send(req.t("categoryRequired"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
