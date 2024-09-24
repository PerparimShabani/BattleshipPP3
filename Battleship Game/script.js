let pyodide;
let game;

async function main() {
  pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/",
  });
  await pyodide.loadPackage("numpy");
  await pyodide.runPythonAsync(`
        ${await (await fetch("battleship.py")).text()}
    `);
  game = pyodide.globals.get("game");
}

main();

document.getElementById("start-game").addEventListener("click", async () => {
  const result = await pyodide.runPythonAsync(`
        game.start_game()        
    `);
  displayMessage(result);
  updateGrids();
});

document.getElementById("submit-guess").addEventListener("click", async () => {
  const input = document.getElementById("guess-input").value;
  const [x, y] = input.split(",").map((num) => parseInt(num.trim()));

  const result = await pyodide.runPythonAsync(`
        result = game.player_turn(${x}, ${y})
        game_over = game.check_game_over()
        if game_over:
            result += "\n" + game_over
        else:
            computer_result = game.computer_turn()
            result += "\n" + computer_result
            game_over = game.check_game_over()
            if game_over:
                result += "\n" + game_over
        result
    `);

  displayMessage(result);
  updateGrids();
});

function displayMessage(message) {
  const messageDiv = document.getElementById("game-message");
  messageDiv.innerHTML += `<p>${message}</p>`;
  messageDiv.scrollTop = messageDiv.scrollHeight;
}

async function updateGrids() {
  const playerGrid = await pyodide.runPythonAsync(
    `game.display_grid(game.player_grid)`
  );
  const computerGrid = await pyodide.runPythonAsync(
    `game.display_grid(game.computer_grid, hide_ships=True)`
  );

  document.getElementById("player-grid").innerHTML = `<p>${playerGrid}</p>`;
  document.getElementById("computer-grid").innerHTML = `<p>${computerGrid}</p>`;
}
