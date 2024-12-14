import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';


const Whiteboard = () => {

  const URL = import.meta.env.VITE_BE_URL;
  // const URL = 'http://localhost:3000';

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen");
  const [penSize, setPenSize] = useState(2);
  const [eraserSize, setEraserSize] = useState(20);
  const [penColor, setPenColor] = useState("white");
  const [result, setResult] = useState("");
  const [problem, setProblem] = useState("");

  // Resize canvas to full window
  useEffect(() => {
    



    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.65;
  
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1a1a1a"; // Canvas background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    const preventTouchDefault = (e) => {
      e.preventDefault(); // Prevent pull-to-refresh and scrolling
    };
  
    // Prevent default touch behavior
    canvas.addEventListener("touchstart", preventTouchDefault, { passive: false });
    canvas.addEventListener("touchmove", preventTouchDefault, { passive: false });
    canvas.addEventListener("touchend", preventTouchDefault, { passive: false });
  
    // Cleanup on unmount
    return () => {
      canvas.removeEventListener("touchstart", preventTouchDefault);
      canvas.removeEventListener("touchmove", preventTouchDefault);
      canvas.removeEventListener("touchend", preventTouchDefault);
    };
  }, []);
  

  // Get cursor or touch position relative to the canvas
  const getCursorPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const isTouch = e.touches && e.touches.length > 0;
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCursorPosition(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCursorPosition(e);

    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === "pen" ? penColor : "#1a1a1a";
    ctx.lineWidth = tool === "pen" ? penSize : eraserSize;
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (isDrawing) {
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1a1a1a"; // Canvas background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setResult('');
  };

  const sendCanvasToBackend = async () => {
    const canvas = canvasRef.current;
    const imageBase64 = canvas.toDataURL("image/png");
    try {
      const response = await axios.post(`${URL}/calculate`, {
        image: imageBase64,
        variables: { x: 5, y: 10 },
      });
  
      const data = response.data;
  
      if (data.success) {
        setProblem(`Expression: ${data.problem}`);
        setResult(`Result: ${data.result}`);
        console.log(`Extracted Problem: ${data.problem}\nResult: ${data.result}`);
      } else {
        setResult(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setResult("Failed to connect to the backend. Please try again.");
    }
  };

  // Function to download the canvas as an image
  const downloadCanvasImage = () => {
    const canvas = canvasRef.current;
    const imageBase64 = canvas.toDataURL("image/png");
    
    // Create a link element to download the image
    const downloadLink = document.createElement("a");
    downloadLink.href = imageBase64;
    downloadLink.download = "whiteboard_screenshot.png";
    downloadLink.click();
  };


  const randomStyle = () => {
    const random = (min, max) => Math.random() * (max - min) + min;
  
    return {
      position: `absolute`,
      left: `${random(0,100)}vw`, // Random horizontal position
      animationName: `fall`,
      top:`0`,
      // animationTimingFunction: `linear`,
      animationIterationCount: `infinite`,
      fontSize: `${random(15, 20)}px`, // Random size
      animationDuration: `${random(10, 20)}s`, // Random falling duration
      animationDelay: `${random(0, 5)}s`, // Random delay
      transform: `rotate(${random(0, 90)}deg)`, // Random rotation
      opacity: `${random(0,0.2)}`
    };
  };

  const fallingItems = [
    "y = mx + c",
    "∫xdx",
    "(a+b)²",
    "E = mc²",
    "sin(x) + cos(x)",
    "📚",
    "✏️",
    "🍎",
    "🚀",
    "📐",
    "a² + b² = c²",
    "🧮",
    "1 + 1 = 2",
    "πr²",
    "Δy/Δx",
    "∑x",
    "log(x)",
    "∞",
    "√x",
    "θ",
    "cos(θ)",
    "tan(θ)",
    "∂f/∂x",
    "v = u + at",
    "F = ma",
    "🌟",
    "🌍",
    "🌌",
    "☀️",
    "🎨",
    "📓",
    "✂️",
    "🎲",
    "🖋️",
    "x³",
    "∫e^x dx",
    "Ω",
    "⊗",
    "∘",
    "⇔",
    "∀x ∈ ℝ",
    "∃y",
    "ℕ",
    "φ",
    "∆",
    "v(t)",
    "∂²/∂x²",
    "lim(x→∞)",
    "∫∫dxdy",
  ];
  
  return (
    <>
    {/* Falling Items */}
    <div className="falling-items">
    {fallingItems.map((item, index) => (
      <div
        key={index}
        className="falling"
        style={randomStyle()}
      >
        {item}
      </div>
    ))}
  </div>



    <div className="whiteboard">
      <div className="toolbar">
        <button
          onClick={() => setTool("pen")}
          className={`fa fa-pencil tool-button ${tool === "pen" ? "active" : ""}`}
        >
          {/* Pen */}
        </button>
        <button
          onClick={() => setTool("eraser")}
          className={`fa fa-eraser tool-button ${tool === "eraser" ? "active" : ""}`}
        >
          {/* Eraser */}
        </button>
        <button onClick={clearCanvas} className="tool-button">
          Clear
        </button>
        <button onClick={sendCanvasToBackend} className="tool-button btn-success">
          Calculate
        </button>
        <button onClick={downloadCanvasImage} className="tool-button btn-download fa fa-download">
          {/* Download Screenshot */}
        </button>

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

      <canvas
      // className="canvas"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      ></canvas>

      <div className="result">
        {result && (
          <>
            <h1>Answer:</h1>
            <h3>{problem}</h3>
            <h3>{result}</h3>
          </>
        )}
      </div>
    </div>


    <style jsx global>{`
        @keyframes fall {
          0% { 
            transform: translateY(0) rotate(-90deg); 
            opacity: 0.2;
          }
          100% { 
            transform: translateY(100vh) rotate(90deg); 
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Whiteboard;
