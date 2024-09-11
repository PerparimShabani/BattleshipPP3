import random

class Battleship:
    def __init__(self, grid_size=10):
        self.grid_size = grid_size
        self.player_grid = [['' for _ in range(grid_size)] for _ in range(grid_size)]
        self.computer_grid = [['' for _ in range(grid_size)] for _ in range(grid_size)]
        self.player_ships = []
        self.computer_ships = []
        self.ships_sizes = [5, 4, 3, 3, 2]
    
    def place_ships(self, grid, ships):
        for size in self.ships_sizes:
            while True:
                x = random.randint(0, self.grid_size - 1)
                y = random.randint(0, self.grid_size - 1)
                direction = random.choice(['horizontal', 'vertical'])
                if self.can_place_ship(grid, x, y, size, direction):
                    self.place_ship(grid, x, y, size, direction)
                    ships.append([(x, y), size, direction])
                    break
                
    def can_place_ship(self, grid, x, y, size, direction):
        if direction == 'horizontal':
            if y + size > self.grid_size:
                return False
            return all(grid[x][y+i] == ' ' for i in range(size))
        else:
            if x + size > self.grid_size:
                return False
            return all(grid[x+i][y] == ' ' for i in range (size))
        
    def place_ship(self, grid, x, y, size, direction):
        if direction == 'horizontal':
            for i in range(size):
                grid[x][y+i] = 'S'
            else:
                for i in range(size):
                    grid[x+i][y] = 'S'
                    
    def player_turn(self, x, y):
        if not (0 <= x < self.grid_size and 0 <= y < self.grid_size):
            return "Off-grid guess. Please try again."
        
        if self.computer_grid[x][y] == 'S':
            self.computer_grid[x][y] == 'X'
            return "Hit!"
        elif self.computer_grid[x][y] == ' ':
            self.computer_grid[x][y] == 'O'
            return "Miss!"
        else:
            return "You've already guessed this location."
        
    def computer_turn(self):
        while True:
            x = random.randint(0, self.grid_size - 1)
            y = random.randint(0, self.grid_size - 1)
            if self.player_grid[x][y] in [' ', 'S']:
                break
            
        if self.player_grid[x][y] == 'S':
            self.player_grid[x][y] = 'X'
            return f"Computer hit at ({x}, {y})!"
        else:
            self.player_grid[x][y] = 'O'
            return f"Computer missed at ({x}, {y})!"
        
    def check_game_over(self):
        player_ships_sunk = all(self.computer_grid[ship[0][0][ship][0][1]] == 'X' for ship in self.computer_ships)
        computer_ships_sunk = all(self.player_grid[ship[0][0][ship][0][1]] == 'X' for ship in self.computer_ships)
        
        if player_ships_sunk:
            return "Player wins!"
        elif computer_ships_sunk:
            return "Computer wins!"
        else:
            return None
        
    def display_grid(self, grid, hide_ships=False):
        display =[]
        for row in grid:
            display_row = []
            for cell in row:
                if hide_ships and cell == 'S':
                    display_row.append(' ')
                else:
                    display_row.append(cell)
            display.append(' '.join(display_row))
        return "\n".join(display)
    
    def start_game(self):
        self.place_ships(self.player_grid, self.player_ships)
        self.place_ships(self.computer_grid, self.computer_ships)
        return "Game started! Player's grid: \n" + self.display_grid(self.player_grid)
    
game = Battleship()