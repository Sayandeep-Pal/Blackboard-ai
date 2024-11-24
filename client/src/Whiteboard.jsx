import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import Tesseract from 'tesseract.js';

const Whiteboard = () => {

  const URL = "https://blackboard-ai-be.vercel.app";

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen"); // Current tool: "pen" or "eraser"
  const [penSize, setPenSize] = useState(2); // Pen size
  const [eraserSize, setEraserSize] = useState(20); // Eraser size
  const [penColor, setPenColor] = useState("white"); // Pen color
  const [result, setResult] = useState("");
  const [problem, setproblem] = useState("");

  // Resize canvas to full window
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.95; // 90% of window width
    canvas.height = window.innerHeight * 0.6; // 90% of window height
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1a1a1a"; // Canvas background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Function to get cursor position relative to the canvas
  const getCursorPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect(); // Get canvas position
    return {
      x: e.clientX - rect.left, // Adjust for canvas's left offset
      y: e.clientY - rect.top,  // Adjust for canvas's top offset
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCursorPosition(e);
    ctx.beginPath();
    ctx.moveTo(x, y); // Start drawing at the adjusted coordinates
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCursorPosition(e);

    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === "pen" ? penColor : "#1a1a1a"; // Pen or eraser color
    ctx.lineWidth = tool === "pen" ? penSize : eraserSize; // Pen or eraser size
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1a1a1a"; // Canvas background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };


  const sendCanvasToBackend = async () => {
    const canvas = canvasRef.current;
    
    // Convert canvas to a base64 image
    const imageBase64 = canvas.toDataURL("image/png");
    
    try {
      const response = await axios.post(`${URL}/calculate`, {
        image: imageBase64, // Send the image as base64
        variables: { x: 5, y: 10 } // Include any additional variables if needed
      });
  
      const data = response.data;
  
      if (data.success) {
        setproblem(`Expression : ${data.problem}`)
        setResult(`Result: ${data.result}`);
        console.log(`Extracted Problem: ${data.problem}\nResult: ${data.result}`)
      } else {
        setResult(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setResult("Failed to connect to the backend. Please try again.");
    }
};
  

//   const sendProblemToBackend = async (problemText) => {
//     try {
//       const response = await axios.post("http://localhost:3000/calculate", {
//         problem: problemText,  // Send the extracted problem to the backend
//       });

//       const data = response.data;

//       if (data.success) {
//         setResult(`Problem: ${data.problem}\nResult: ${data.result}`);
//         alert(`Problem: ${data.problem}\nResult: ${data.result}`)
//       } else {
//         setResult(`Error: ${data.message}`);
//         alert(`Error: ${data.message}`)
//       }
//     } catch (error) {
//       console.error("Error connecting to backend:", error);
//       setResult("Failed to connect to the backend. Please try again.");
//     }
//   };

//   // Extract text from the canvas using Tesseract.js
//   const extractTextFromCanvas = () => {
//     const canvas = canvasRef.current;
//     const imageBase64 = canvas.toDataURL("image/png"); // Convert canvas to base64 image

//     Tesseract.recognize(
//       imageBase64,
//       'eng', // Language of text in the image
//       {
//         logger: (m) => console.log(m), // Log progress
//       }
//     ).then(({ data: { text } }) => {
//       console.log('Extracted Text:', text);
//       sendProblemToBackend(text); // Send extracted text to the backend
//     });
//   };

  return (
    <div className="whiteboard">
      <div className="toolbar">
        {/* Tool Buttons */}
        <button
          onClick={() => setTool("pen")}
          className={`tool-button ${tool === "pen" ? "active" : ""}`}
        >
          Pen
        </button>
        <button
          onClick={() => setTool("eraser")}
          className={`tool-button ${tool === "eraser" ? "active" : ""}`}
        >
          Eraser
        </button>
        <button onClick={clearCanvas} className="tool-button">
          Clear
        </button>
        <button onClick={sendCanvasToBackend} className="tool-button btn-success">
          Calculate
        </button>

        {/* Pen Size Slider */}
        {tool === "pen" && (
          <div className="slider-container">
            <label htmlFor="penSize">Pen Size: {penSize}px</label>
            <input
              type="range"
              id="penSize"
              min="1"
              max="20"
              value={penSize}
              onChange={(e) => setPenSize(Number(e.target.value))}
            />
          </div>
        )}

        {/* Eraser Size Slider */}
        {tool === "eraser" && (
          <div className="slider-container">
            <label htmlFor="eraserSize">Eraser Size: {eraserSize}px</label>
            <input
              type="range"
              id="eraserSize"
              min="10"
              max="50"
              value={eraserSize}
              onChange={(e) => setEraserSize(Number(e.target.value))}
            />
          </div>
        )}

        {/* Color Picker */}
        {tool === "pen" && (
          <div className="color-picker">
            <label htmlFor="penColor">Pen Color:</label>
            <input
              type="color"
              id="penColor"
              value={penColor}
              onChange={(e) => setPenColor(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      ></canvas>

      <div className="result">
        {result && (
            <>
                <h1>Answer :</h1>
                <h3>{problem}</h3>
                <h3>{result}</h3>
            </>
            
            )}
      </div>
    </div>
  );
};

export default Whiteboard;
