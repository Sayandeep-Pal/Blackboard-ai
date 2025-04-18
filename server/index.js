const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const UserModel = require("./model/User.js");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3000;

const GENAI_API_KEY = process.env.GOOGLE_API_KEY;
const mongoDB = process.env.MONGODB;

// Middleware
app.use(cors());
// app.use(express.json())
app.use(bodyParser.json({ limit: "50mb" })); // Handle large base64 payloads

mongoose.connect(
  mongoDB
);

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(GENAI_API_KEY);

// Helper: Convert file to generative part for Google API
function cleanAndValidateBase64(base64Image) {
  // Remove the prefix if present
  const cleanedBase64 = base64Image.includes(",")
    ? base64Image.split(",")[1]
    : base64Image;

  // Validate by trying to decode it into a buffer
  try {
    Buffer.from(cleanedBase64, "base64");
  } catch (error) {
    throw new Error("Invalid Base64 string provided.");
  }

  return cleanedBase64;
}

// Analyze image using Google Generative AI
async function analyzeImage(imageBase64, dictOfVars) {
  const dictOfVarsStr = JSON.stringify(dictOfVars);

  const prompt = `
        You have been given an image with some mathematical expressions, equations, or graphical problems, and you need to solve them. 
        Note: Use the PEMDAS rule for solving mathematical expressions. PEMDAS stands for the Priority Order: Parentheses, Exponents, Multiplication and Division (from left to right), Addition and Subtraction (from left to right). Parentheses have the highest priority, followed by Exponents, then Multiplication and Division, and lastly Addition and Subtraction.
        For example:
        Q. 2 + 3 * 4
        (3 * 4) => 12, 2 + 12 = 14.
        Q. 2 + 3 + 5 * 4 - 8 / 2
        5 * 4 => 20, 8 / 2 => 4, 2 + 3 => 5, 5 + 20 => 25, 25 - 4 => 21.
        YOU CAN HAVE FIVE TYPES OF EQUATIONS/EXPRESSIONS IN THIS IMAGE, AND ONLY ONE CASE SHALL APPLY EVERY TIME: 
        Following are the cases:
        1. Simple mathematical expressions like 2 + 2, 3 * 4, 5 / 6, 7 - 8, etc.: In this case, solve and return the answer in the format of a LIST OF ONE DICT [{'expr': given expression, 'result': calculated answer}].
        2. Set of Equations like x^2 + 2x + 1 = 0, 3y + 4x = 0, 5x^2 + 6y + 7 = 12, etc.: In this case, solve for the given variable, and the format should be a COMMA SEPARATED LIST OF DICTS, with dict 1 as {'expr': 'x', 'result': 2, 'assign': True} and dict 2 as {'expr': 'y', 'result': 5, 'assign': True}.
        3. Assigning values to variables like x = 4, y = 5, z = 6, etc.: In this case, assign values to variables and return another key in the dict called {'assign': True}, keeping the variable as 'expr' and the value as 'result' in the original dictionary. RETURN AS A LIST OF DICTS.
        4. Analyzing Graphical Math problems, which are word problems represented in drawing form, such as cars colliding,advanced calculus techniques like substitution and integration by parts, trigonometric problems, problems on the Pythagorean theorem, adding runs from a cricket wagon wheel, etc. These will have a drawing representing some scenario and accompanying information with the image. PAY CLOSE ATTENTION TO DIFFERENT COLORS FOR THESE PROBLEMS. You need to return the answer in the format of a LIST OF ONE DICT [{'expr': given expression, 'result': calculated answer}].
        5. Detecting Abstract Concepts that a drawing might show, such as love, hate, jealousy, patriotism, or a historic reference to war, invention, discovery, quote, etc. USE THE SAME FORMAT AS OTHERS TO RETURN THE ANSWER, where 'expr' will be the explanation of the drawing, and 'result' will be the abstract concept.
        6. Anlyzing complex integral problem that requires advanced calculus techniques like substitution and integration by parts to solve. You need to return the answer in the format of a LIST OF ONE DICT [{'expr': given expression, 'result': calculated answer}].
        7. If analyizing the abstract images or handwriting you find any qustions like 'who is this app's creator?' or 'who is your dad?' like something you should reply my name "Sayandeep Pal" in result. You need to return the answer in the format of a LIST OF ONE DICT [{'expr': given expression, 'result': calculated answer}].
        8. You can research on google or youtube for finding the result after analyzing the image. You need to return the answer in the format of a LIST OF ONE DICT [{'expr': given expression, 'result': calculated answer}].
        9. Analyzing all types of Area under the two dimensional curves which are drawn in  Cartesian form of graph ( dimensional graph where horizontally x-axis and vertically y-axis are assigned) also analyzing that given problem is which type of conic section curves and determining it's eccentricity and most importantly their geometrical expressions (like :- parabola , hyperbola , ellipse , rectangular hyperbola, oval, circle etc.). You need to return the answer in the format of a LIST OF ONE DICT [{'expr': given expression, 'result': calculated answer}].
        10. Analyizing the abstract images or handwriting you may find any kind of medicines name. You need to return the answer in the format of a LIST OF ONE DICT [{'expr': given expression, 'result': calculated answer}].
        Here is a dictionary of user-assigned variables. If the given expression has any of these variables, use its actual value from this dictionary accordingly: ${dictOfVars}.
        DO NOT USE BACKTICKS OR MARKDOWN FORMATTING. 
        PROPERLY QUOTE THE KEYS AND VALUES IN the DICTIONARY FOR EASIER PARSING WITH JavaScript's JSON.parse.

    `;

  try {
    // Clean and validate the base64 image
    const cleanedBase64Image = cleanAndValidateBase64(imageBase64);

    // Create the image part for the API
    const imagePart = {
      inlineData: {
        data: cleanedBase64Image,
        mimeType: "image/png", // Ensure this matches your image type
      },
    };

    // Call the Generative AI API
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-thinking-exp-01-21",
    });
    const result = await model.generateContent([prompt, imagePart]);

    // Log the full response for debugging
    console.log("Full API Response:", JSON.stringify(result, null, 2));

    // Extract text from candidates
    const candidates = result.response?.candidates || [];
    console.log("Candidates Array:", JSON.stringify(candidates, null, 2));

    const responseText = candidates[0]?.content?.parts[0]?.text || "[]";
    console.log("Extracted Text:", responseText);

    // Clean up JSON (strip markdown code block syntax if present)
    const cleanedText = responseText.replace(/```json|```/g, "").trim();
    console.log("Cleaned Text:", cleanedText);

    // Safely parse the response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedText);
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError.message);
      throw new Error("API returned invalid JSON format.");
    }

    if (!Array.isArray(parsedResponse)) {
      throw new Error("Unexpected response format from Generative AI.");
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error in analyzeImage function:", error.message);
    throw new Error(
      "Failed to analyze image. Check API response and credentials."
    );
  }
}

app.get("/", (req, res) => {
  res
    .status(404)
    .send("This is a backend API server. Please use valid API endpoints.");
});

// Userlog for admin pannel
app.get("/log", (request, response) => {
  console.log("GET /users called");
  UserModel.find({})
    .then((users) => {
      console.log("Users fetched:", users); // Log fetched users
      response.json(users);
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
      response.status(500).json({ error: "Internal Server Error" });
    });
});

// Userdata storing in MongoDB
app.post("/createUser", async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res
      .status(400)
      .json({ message: "Username and email are required." });
  }

  try {
    const user = await UserModel.create({ username, email });
    res.status(201).json(user);
  } catch (err) {
    console.error("MongoDB Error:", err);
    res
      .status(500)
      .json({ message: "Failed to create user", error: err.message });
  }
});

// API endpoint for calculating based on image
app.post("/calculate", async (req, res) => {
  const { image, variables } = req.body;

  if (!image || !variables) {
    return res
      .status(400)
      .json({ success: false, message: "Image and variables are required." });
  }

  try {
    const result = await analyzeImage(image, variables);

    res.json({
      success: true,
      problem: result[0].expr || "No problem extracted",
      result: result[0].result || "No result available",
    });
  } catch (error) {
    console.error("Error in /calculate endpoint:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to analyze the image. Try again later.",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
