import React, { useState, useEffect, useRef, useCallback } from "react";
import { Scissors, FileText, Mountain } from "lucide-react";

interface GameObject {
  id: number;
  type: "rock" | "paper" | "scissors";
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const OBJECT_SIZE = 20;
const BASE_SPEED = 2;
const WIN_CONDITION = 120;

const RockPaperScissorsGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameObjectsRef = useRef<GameObject[]>([]);
  const animationIdRef = useRef<number>();
  const [counts, setCounts] = useState({ rock: 40, paper: 40, scissors: 40 });
  const [isRunning, setIsRunning] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState<string>("");
  const [startingCounts, setStartingCounts] = useState({ rock: 40, paper: 40, scissors: 40 });
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  // Responsive canvas size
  const [canvasSize, setCanvasSize] = useState({ width: GAME_WIDTH, height: GAME_HEIGHT });
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize canvas on window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const maxWidth = Math.min(window.innerWidth - 32, GAME_WIDTH); // 32px padding
        const maxHeight = Math.min(window.innerHeight - 300, GAME_HEIGHT); // 300px for UI
        const aspect = GAME_WIDTH / GAME_HEIGHT;
        let width = maxWidth;
        let height = Math.round(width / aspect);
        if (height > maxHeight) {
          height = maxHeight;
          width = Math.round(height * aspect);
        }
        setCanvasSize({ width, height });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize game objects
  const initializeGame = useCallback(() => {
    const objects: GameObject[] = [];
    let id = 0;
    const currentSpeed = BASE_SPEED * speedMultiplier;

    // Create rocks starting from top-left corner
    for (let i = 0; i < startingCounts.rock; i++) {
      objects.push({
        id: id++,
        type: "rock",
        x: Math.random() * 200 + 50,
        y: Math.random() * 200 + 50,
        vx: (Math.random() - 0.5) * currentSpeed * 2,
        vy: (Math.random() - 0.5) * currentSpeed * 2,
        size: OBJECT_SIZE,
      });
    }

    // Create papers starting from top-right corner
    for (let i = 0; i < startingCounts.paper; i++) {
      objects.push({
        id: id++,
        type: "paper",
        x: Math.random() * 200 + GAME_WIDTH - 250,
        y: Math.random() * 200 + 50,
        vx: (Math.random() - 0.5) * currentSpeed * 2,
        vy: (Math.random() - 0.5) * currentSpeed * 2,
        size: OBJECT_SIZE,
      });
    }

    // Create scissors starting from bottom center
    for (let i = 0; i < startingCounts.scissors; i++) {
      objects.push({
        id: id++,
        type: "scissors",
        x: Math.random() * 300 + GAME_WIDTH / 2 - 150,
        y: Math.random() * 200 + GAME_HEIGHT - 250,
        vx: (Math.random() - 0.5) * currentSpeed * 2,
        vy: (Math.random() - 0.5) * currentSpeed * 2,
        size: OBJECT_SIZE,
      });
    }

    gameObjectsRef.current = objects;
    updateCounts(objects);
    setGameEnded(false);
    setWinner("");
  }, [startingCounts, speedMultiplier]);

  // Update counts and check win condition
  const updateCounts = (objects: GameObject[]) => {
    const newCounts = { rock: 0, paper: 0, scissors: 0 };
    objects.forEach((obj) => {
      newCounts[obj.type]++;
    });
    setCounts(newCounts);

    // Win condition: one type remains, other two are zero
    if (newCounts.rock > 0 && newCounts.paper === 0 && newCounts.scissors === 0) {
      setGameEnded(true);
      setWinner("Rock");
      setIsRunning(false);
    } else if (newCounts.paper > 0 && newCounts.rock === 0 && newCounts.scissors === 0) {
      setGameEnded(true);
      setWinner("Paper");
      setIsRunning(false);
    } else if (newCounts.scissors > 0 && newCounts.rock === 0 && newCounts.paper === 0) {
      setGameEnded(true);
      setWinner("Scissors");
      setIsRunning(false);
    }
  };

  // Check collision between two objects
  const checkCollision = (obj1: GameObject, obj2: GameObject) => {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (obj1.size + obj2.size) / 2;
  };

  // Determine winner in rock-paper-scissors
  const getWinner = (type1: string, type2: string) => {
    if (type1 === type2) return null;
    if (type1 === "rock" && type2 === "scissors") return "rock";
    if (type1 === "scissors" && type2 === "paper") return "scissors";
    if (type1 === "paper" && type2 === "rock") return "paper";
    if (type2 === "rock" && type1 === "scissors") return "rock";
    if (type2 === "scissors" && type1 === "paper") return "scissors";
    if (type2 === "paper" && type1 === "rock") return "paper";
    return null;
  };

  // Update game state
  const updateGame = useCallback(() => {
    const objects = gameObjectsRef.current;
    const processedCollisions = new Set<string>();

    // Update positions
    objects.forEach((obj) => {
      obj.x += obj.vx;
      obj.y += obj.vy;

      // Add a small random jitter to velocity every frame to break symmetry
      obj.vx += (Math.random() - 0.5) * 0.05;
      obj.vy += (Math.random() - 0.5) * 0.05;

      // Bounce off walls
      if (obj.x <= obj.size / 2 || obj.x >= GAME_WIDTH - obj.size / 2) {
        obj.vx *= -1;
        obj.x = Math.max(obj.size / 2, Math.min(GAME_WIDTH - obj.size / 2, obj.x));
      }
      if (obj.y <= obj.size / 2 || obj.y >= GAME_HEIGHT - obj.size / 2) {
        obj.vy *= -1;
        obj.y = Math.max(obj.size / 2, Math.min(GAME_HEIGHT - obj.size / 2, obj.y));
      }
    });

    // Check collisions and conversions
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        const obj1 = objects[i];
        const obj2 = objects[j];
        const collisionKey = `${Math.min(obj1.id, obj2.id)}-${Math.max(obj1.id, obj2.id)}`;

        if (checkCollision(obj1, obj2) && !processedCollisions.has(collisionKey)) {
          processedCollisions.add(collisionKey);

          // Handle type conversion
          const winner = getWinner(obj1.type, obj2.type);
          if (winner) {
            if (winner === obj1.type) {
              obj2.type = obj1.type as "rock" | "paper" | "scissors";
            } else {
              obj1.type = obj2.type as "rock" | "paper" | "scissors";
            }
          }

          // Improved collision response - elastic collision physics
          const dx = obj2.x - obj1.x;
          const dy = obj2.y - obj1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0) {
            const nx = dx / distance;
            const ny = dy / distance;

            // Separate objects to prevent overlap
            const overlap = (obj1.size + obj2.size) / 2 - distance;
            if (overlap > 0) {
              obj1.x -= nx * overlap * 0.5;
              obj1.y -= ny * overlap * 0.5;
              obj2.x += nx * overlap * 0.5;
              obj2.y += ny * overlap * 0.5;
            }

            // Calculate relative velocity
            const relativeVx = obj1.vx - obj2.vx;
            const relativeVy = obj1.vy - obj2.vy;

            // Calculate relative velocity in collision normal direction
            const speed = relativeVx * nx + relativeVy * ny;

            // Do not resolve if velocities are separating
            if (speed > 0) {
              // Collision impulse (assuming equal mass and elastic collision)
              const impulse = (2 * speed) / 2;

              // Update velocities with elastic collision
              obj1.vx -= impulse * nx;
              obj1.vy -= impulse * ny;
              obj2.vx += impulse * nx;
              obj2.vy += impulse * ny;

              // Add some randomness to prevent objects getting stuck
              const randomFactor = 0.5; // increased randomness
              obj1.vx += (Math.random() - 0.5) * randomFactor;
              obj1.vy += (Math.random() - 0.5) * randomFactor;
              obj2.vx += (Math.random() - 0.5) * randomFactor;
              obj2.vy += (Math.random() - 0.5) * randomFactor;
            }
          }
        }
      }
    }

    updateCounts(objects);
  }, []);

  // Update object speeds when speed multiplier changes during gameplay
  const updateObjectSpeeds = useCallback(() => {
    const objects = gameObjectsRef.current;
    objects.forEach((obj) => {
      // Normalize current velocity and apply new speed
      const currentSpeed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
      if (currentSpeed > 0) {
        const newSpeed = BASE_SPEED * speedMultiplier;
        const ratio = newSpeed / currentSpeed;
        obj.vx *= ratio;
        obj.vy *= ratio;
      }
    });
  }, [speedMultiplier]);

  // Update render to use responsive size
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale drawing to fit canvas
    ctx.setTransform(canvasSize.width / GAME_WIDTH, 0, 0, canvasSize.height / GAME_HEIGHT, 0, 0);
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw objects with emoji/text representations
    gameObjectsRef.current.forEach((obj) => {
      ctx.save();
      ctx.translate(obj.x, obj.y);

      // Set font for emoji
      ctx.font = `${obj.size}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw background circle with type-specific color
      ctx.beginPath();
      ctx.arc(0, 0, obj.size / 2, 0, 2 * Math.PI);

      ctx.fill();

      // Draw emoji on top
      ctx.fillStyle = "white";
      switch (obj.type) {
        case "rock":
          ctx.fillText("🪨", 0, 0);
          break;
        case "paper":
          ctx.fillText("📔", 0, 0);
          break;
        case "scissors":
          ctx.fillText("✂️", 0, 0);
          break;
      }

      ctx.restore();
    });
  }, [canvasSize]);

  // Game loop
  const gameLoop = useCallback(() => {
    updateGame();
    render();
    if (isRunning) {
      animationIdRef.current = requestAnimationFrame(gameLoop);
    }
  }, [isRunning, updateGame, render]);

  // Start/stop game
  const toggleGame = () => {
    if (!gameEnded) {
      setIsRunning(!isRunning);
    }
  };

  const resetGame = () => {
    setIsRunning(false);
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    initializeGame();
    render();
  };

  const handleCountChange = (type: "rock" | "paper" | "scissors", value: string) => {
    // Allow empty string for controlled input, but only update state if valid
    if (value === "") {
      setStartingCounts((prev) => ({ ...prev, [type]: "" as any }));
      return;
    }
    const numValue = Math.max(1, Math.min(100, parseInt(value) || 1));
    setStartingCounts((prev) => ({ ...prev, [type]: numValue }));
  };

  const handleSpeedChange = (value: string) => {
    setSpeedMultiplier(parseFloat(value));
    if (isRunning) {
      updateObjectSpeeds(); // Only update speeds, do not reset counts or objects
    }
  };

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
    render();
  }, [initializeGame, render]);

  // Update speeds when speed multiplier changes during gameplay
  useEffect(() => {
    if (isRunning) {
      updateObjectSpeeds();
    }
  }, [speedMultiplier, updateObjectSpeeds]);

  // Start/stop game loop
  useEffect(() => {
    if (isRunning) {
      gameLoop();
    } else if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isRunning, gameLoop]);

  return (
    <div className='flex flex-col items-center gap-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-800 mb-2'>Rock Paper Scissors Battle</h1>
        <p className='text-gray-600'>Watch as objects collide and convert each other!</p>
      </div>

      {/* Starting Count Controls */}
      <div className='flex flex-wrap justify-center gap-4 bg-white rounded-lg shadow-lg p-4 w-full max-w-[900px]'>
        <div className='flex items-center gap-2 min-w-[150px] justify-center'>
          <span className='text-lg'>🪨</span>
          <label className='text-sm font-medium'>Rocks:</label>
          <input
            type='number'
            min='1'
            max='100'
            value={startingCounts.rock || ""}
            onChange={(e) => handleCountChange("rock", e.target.value)}
            disabled={isRunning}
            className='w-16 px-2 py-1 border border-gray-300 rounded text-center disabled:bg-gray-100'
          />
        </div>
        <div className='flex items-center gap-2 min-w-[150px] justify-center'>
          <span className='text-lg'>📄</span>
          <label className='text-sm font-medium'>Papers:</label>
          <input
            type='number'
            min='1'
            max='100'
            value={startingCounts.paper || ""}
            onChange={(e) => handleCountChange("paper", e.target.value)}
            disabled={isRunning}
            className='w-16 px-2 py-1 border border-gray-300 rounded text-center disabled:bg-gray-100'
          />
        </div>
        <div className='flex items-center gap-2 min-w-[150px] justify-center'>
          <span className='text-lg'>✂️</span>
          <label className='text-sm font-medium'>Scissors:</label>
          <input
            type='number'
            min='1'
            max='100'
            value={startingCounts.scissors || ""}
            onChange={(e) => handleCountChange("scissors", e.target.value)}
            disabled={isRunning}
            className='w-16 px-2 py-1 border border-gray-300 rounded text-center disabled:bg-gray-100'
          />
        </div>
        <div className='flex items-center gap-2 border-l pl-4 min-w-[150px] justify-center'>
          <label className='text-sm font-medium'>Speed:</label>
          <select
            value={speedMultiplier}
            onChange={(e) => handleSpeedChange(e.target.value)}
            className='px-2 py-1 border border-gray-300 rounded'>
            <option value='1'>1x</option>
            <option value='1.25'>1.25x</option>
            <option value='1.5'>1.5x</option>
            <option value='2'>2x</option>
            <option value='2.5'>2.5x</option>
          </select>
        </div>
      </div>

      {/* Live Counter */}
      <div className='flex flex-wrap justify-center gap-8 bg-white rounded-lg shadow-lg p-6 w-full max-w-[900px]'>
        <div className='flex items-center gap-2 min-w-[150px] justify-center'>
          <span className='text-2xl'>🪨</span>
          <span className='text-lg font-semibold'>Rocks:</span>
          <span className='text-2xl font-bold text-gray-700'>{counts.rock}</span>
        </div>
        <div className='flex items-center gap-2 min-w-[150px] justify-center'>
          <span className='text-2xl'>📄</span>
          <span className='text-lg font-semibold'>Papers:</span>
          <span className='text-2xl font-bold text-blue-600'>{counts.paper}</span>
        </div>
        <div className='flex items-center gap-2 min-w-[150px] justify-center'>
          <span className='text-2xl'>✂️</span>
          <span className='text-lg font-semibold'>Scissors:</span>
          <span className='text-2xl font-bold text-red-600'>{counts.scissors}</span>
        </div>
      </div>

      {/* Game End Message */}
      {gameEnded && (
        <div className='bg-yellow-100 border border-yellow-400 rounded-lg p-6 text-center'>
          <h2 className='text-2xl font-bold text-yellow-800 mb-2'>Game Over!</h2>
          <p className='text-lg text-yellow-700'>
            {winner} wins with {counts[winner.toLowerCase() as keyof typeof counts]} objects!
          </p>
        </div>
      )}

      {/* Game Canvas */}
      <div ref={containerRef} className='bg-white rounded-lg shadow-xl p-4 w-full max-w-[900px] flex justify-center'>
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className='border border-gray-200 rounded-lg w-full h-auto max-w-full max-h-[70vh]'
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>

      {/* Controls */}
      <div className='flex gap-4'>
        <button
          onClick={toggleGame}
          disabled={gameEnded}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
            gameEnded
              ? "bg-gray-400 cursor-not-allowed"
              : isRunning
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}>
          {gameEnded ? "Game Over" : isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetGame}
          className='px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors'>
          {gameEnded ? "Play Again" : "Reset"}
        </button>
      </div>

      {/* Legend */}
      <div className='bg-white rounded-lg shadow-lg p-4'>
        <h3 className='font-semibold mb-3 text-gray-800'>Rules:</h3>
        <div className='grid grid-cols-3 gap-4 text-sm'>
          <div className='text-center'>
            <div className='text-2xl mb-1'>🪨</div>
            <span>Rock beats Scissors</span>
          </div>
          <div className='text-center'>
            <div className='text-2xl mb-1'>📄</div>
            <span>Paper beats Rock</span>
          </div>
          <div className='text-center'>
            <div className='text-2xl mb-1'>✂️</div>
            <span>Scissors beats Paper</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RockPaperScissorsGame;
