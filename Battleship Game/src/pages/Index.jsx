import React from 'react';
import BattleshipGame from '../components/BattleshipGame';

const Index = () => {
    return (
        <div className="p-4">
            <h1 className="text-2x1 front-bold mb-4">Battleship Game</h1>
            <BattleshipGame />
        </div>
    );
};

export default Index;