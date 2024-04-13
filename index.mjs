import "dotenv/config";
import bodyParser from "body-parser";
import express from "express";
import surveyService from "./services/survey.mjs";

const app = express();
app.use(bodyParser.json());
const port = 4000;

// Validate headers
// app.use(function (req, res, next) {
//     if (process.env.BACKEND_KEY === req.headers.key) {
//         next();
//     } else {
//         res.status(401).send("Wrong credentials");
//     }
// });

// Get survey results
app.get("/", async (req, res) => {
    res.send("Hi!");
});

// Get survey results
app.get("/survey/results", async (req, res) => {
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

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
