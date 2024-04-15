import "dotenv/config";
import bodyParser from "body-parser";
import express from "express";
import { MongoClient } from "mongodb";
import { Survey } from "./services/survey.mjs";
import { Users } from "./services/users.mjs";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
const port = 4000;

async function init() {
    const client = await new MongoClient(process.env.MONGODB_URI).connect();
    const database = client.db(process.env.MONGODB_DATABASE);

    const surveyService = new Survey(database);
    const usersService = new Users(database);

    return { surveyService, usersService };
}

init().then(({ surveyService, usersService }) => {
    // Get survey results
    app.get("/", async (req, res) => {
        res.send("Hi!");
    });

    // Get survey results
    app.get("/survey/results", verifyToken, async (req, res) => {
        try {
            const results = await surveyService.getSurveyResults();
            res.json(results);
        } catch (error) {
            console.log("error", error);
            res.status(500).send(error);
        }
    });

    // Post new survey result
    app.post("/survey", async (req, res) => {
        try {
            res.json(await surveyService.addSurveyResult(req.body));
        } catch (error) {
            console.log("error", error);
            res.status(500).send(error);
        }
    });

    // Change survey result
    app.put("/survey", async (req, res) => {
        try {
            res.json(await surveyService.editSurveyResult(req.body));
        } catch (error) {
            console.log("error", error);
            res.status(500).send(error);
        }
    });

    // Delete new survey result
    app.delete("/survey/:id", async (req, res) => {
        try {
            res.json(await surveyService.removeSurveyResult(req.params.id));
        } catch (error) {
            console.log("error", error);
            res.status(500).send(error);
        }
    });

    app.post("/login", async (req, res) => {
        const username = req.body.username;

        try {
            const user = await usersService.getUser(username);

            // if user doesn't exist then
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            // if user exists compare passwords
            const checkCorrectPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );

            // if password is incorrect then
            if (!checkCorrectPassword) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password or username",
                });
            }

            // creating jwt token
            const token = jwt.sign(
                { id: user._id.toString() },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "15d" }
            );

            // set token in the browser cookies and send the response to the client
            res.cookie("accessToken", token, {
                httpOnly: true,
                expires: token.expiresIn,
            })
                .status(200)
                .json({
                    success: true,
                    token,
                    message: "login success",
                });
        } catch (err) {
            console.log("err", err);
            res.status(500).json({
                success: false,
                message: "failed to login",
            });
        }
    });

    app.post("/logout", (req, res) => {
        res.clearCookie("accessToken");
        res.end();
    });

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});
