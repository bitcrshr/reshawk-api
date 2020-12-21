/* eslint-disable ban-types */

import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import routesConfig from "./routes/routes-config";
import * as admin from "firebase-admin";

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));
admin.initializeApp();

routesConfig(app);

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})