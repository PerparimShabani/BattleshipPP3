import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { input } from "@/components/ui/input";

const BattleshipGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState(
    'Welcome to Battleship! Press "Start Game" to begin.'
  );
  const [input, setInput] = useState("");

  const startGame = async () => {
    if (window.pyodide) {
      await window.pyodide.runPythonAsync(`
              game.start_game()
            `);
      setGameStarted(true);
      setMessage("Game started! Enter coordinates to make a guess.");
    }
  };

  const makeGuess = async () => {
    if (window.pyodide && input) {
      const [x, y] = input.split(",").map((num) => parseInt(num.trim()));
      const result = await window.pyodide.runPythonAsync(`
          result = game.player_turn(${x}, ${y})
          game.computer_turn()
          result
        `);
      setMessage(result);
      setInput("");
    }
  };

  useEffect(() => {
    const loadPyodide = async () => {
      if (typeof window !== "undefined" && !window.pyodide) {
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/",
        });
        window.pyodide = pyodide;
        await pyodide.runPythonAsync(`
                ${await (await fetch("/src/battleship.py")).text()}
            `);
        window.game = pyodide.globals.get("game");
      }
    };

    loadPyodide();
  }, []);

  return (
    <div className="space-y-4">
      <Button onClick={startGame} disabled={gameStarted}>
        Start Game
      </Button>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter coordinates (e.g., 0,0)"
          disabled={!gameStarted}
        />
        <Button onClick={makeGuess} disabled={!gameStarted}>
          Make Guess
        </Button>
      </div>
      <div className="bg-gray-100 p-4 rounded">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default BattleshipGame;
