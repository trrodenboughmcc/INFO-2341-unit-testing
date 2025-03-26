import React, { useRef, useState, useEffect } from 'react';
import {
  checkCoinCollision,
  checkEnemyCollision,
  incrementSurvivalTime,
  collides
} from './logic';
import './Game.css'; // Create Game.css with styles (optional)

const CANVAS_SIZE = 200;

export default function Game() {
  const canvasRef = useRef(null);
  const playerRef = useRef({ x: 20, y: 20, size: 10, health: 3 });
  const enemiesRef = useRef([{ x: 150, y: 50, size: 10, speed: 1 }]);
  const coinsRef = useRef(generateCoins(3));
  const scoreRef = useRef(0);
  const wallsRef = useRef([
    { x: 80, y: 80, size: 20 },
    { x: 40, y: 40, size: 20 }
  ]);
  const gameStateRef = useRef({
    survivalTime: 0,
    isGameOver: false
  });
  const coinCountRef = useRef(0); // starts at 0, goes up with each coin
  const [renderTrigger, setRenderTrigger] = useState(0); // used to trigger React re-renders

  // Canvas draw loop using requestAnimationFrame
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');

    const draw = () => {
        if (!gameStateRef.current.isGameOver) {
          ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
          // Player
          ctx.fillStyle = 'white';
          ctx.fillRect(
            playerRef.current.x,
            playerRef.current.y,
            playerRef.current.size,
            playerRef.current.size
          );
      
          // Coins
          ctx.fillStyle = 'yellow';
          coinsRef.current.forEach(c =>
            ctx.fillRect(c.x, c.y, c.size, c.size)
          );
      
          // Enemies
          ctx.fillStyle = 'red';
          enemiesRef.current.forEach(e =>
            ctx.fillRect(e.x, e.y, e.size, e.size)
          );
      
          // Walls
          ctx.fillStyle = 'gray';
          wallsRef.current.forEach(w =>
            ctx.fillRect(w.x, w.y, w.size, w.size)
          );
        }
      
        // Always keep the loop running (in case game restarts)
        requestAnimationFrame(draw);
      };

    draw();
  }, []);

  // Enemy AI movement every 500ms
  useEffect(() => {
    const moveEnemies = () => {
      const newEnemies = enemiesRef.current.map(enemy => {
        const dx = playerRef.current.x - enemy.x;
        const dy = playerRef.current.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return enemy;
        const moveX = (dx / dist) * enemy.speed;
        const moveY = (dy / dist) * enemy.speed;
        const newX = enemy.x + moveX;
        const newY = enemy.y + moveY;

        if (!wallsRef.current.some(w =>
          collides({ x: newX, y: newY, size: enemy.size }, w)
        )) {
          return { ...enemy, x: newX, y: newY };
        }
        return enemy;
      });

      enemiesRef.current = newEnemies;

      if (
        !gameStateRef.current.isGameOver &&
        checkEnemyCollision(playerRef.current, enemiesRef.current)
      ) {
        const newHealth = playerRef.current.health - 1;
    
        if (newHealth <= 0) {
          gameStateRef.current.isGameOver = true;
        }
    
        playerRef.current = { ...playerRef.current, health: newHealth };
        setRenderTrigger(n => n + 1); // Update UI
      }
    };

    const interval = setInterval(moveEnemies, 500);
    return () => clearInterval(interval);
  }, []);

  // Survival timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameStateRef.current.isGameOver) {
        gameStateRef.current = incrementSurvivalTime(gameStateRef.current);
        setRenderTrigger(n => n + 1); // trigger UI update
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle key press
  useEffect(() => {
    const handleKeyDown = e => {
      const speed = 10;
      const key = e.key.toLowerCase();
      let { x, y } = playerRef.current;

      if (key === 'arrowup' || key === 'w') y -= speed;
      if (key === 'arrowdown' || key === 's') y += speed;
      if (key === 'arrowleft' || key === 'a') x -= speed;
      if (key === 'arrowright' || key === 'd') x += speed;

      if (!wallsRef.current.some(w =>
        collides({ x, y, size: playerRef.current.size }, w)
      )) {
        const newPlayer = { ...playerRef.current, x, y };
        const coinResult = checkCoinCollision(newPlayer, coinsRef.current);
        coinsRef.current = coinResult.updatedCoins;

        if (coinResult.scoreDelta > 0) {
            scoreRef.current += coinResult.scoreDelta;
            coinCountRef.current += 1;
          
            coinsRef.current.push(...generateCoins(1));
          
            // Spawn N enemies based on how many coins collected
            for (let i = 0; i < coinCountRef.current; i++) {
              enemiesRef.current.push(generateEnemy(scoreRef.current));
            }
          }

        if (checkEnemyCollision(newPlayer, enemiesRef.current)) {
          newPlayer.health -= 1;
          if (newPlayer.health <= 0) {
            gameStateRef.current.isGameOver = true;
          }
        }

        playerRef.current = newPlayer;
        setRenderTrigger(n => n + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const restartGame = () => {
    playerRef.current = { x: 20, y: 20, size: 10, health: 3 };
    coinsRef.current = generateCoins(3);
    enemiesRef.current = [{ x: 150, y: 50, size: 10, speed: 1 }];
    scoreRef.current = 0;
    gameStateRef.current = { survivalTime: 0, isGameOver: false };
    setRenderTrigger(n => n + 1); // Force UI update
  };

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
      ></canvas>
      <p>Score: {scoreRef.current}</p>
      <p>
        Health:{" "}
        {playerRef.current.health > 0
            ? "❤️".repeat(playerRef.current.health)
            : "💀"}
    </p>
      <p>Time Survived: {gameStateRef.current.survivalTime}s</p>
      {gameStateRef.current.isGameOver && (
        <button onClick={restartGame}>Restart</button>
      )}
    </div>
  );
}

function generateCoins(count) {
  const coins = [];
  for (let i = 0; i < count; i++) {
    coins.push({
      x: Math.floor(Math.random() * 18) * 10,
      y: Math.floor(Math.random() * 18) * 10,
      size: 10
    });
  }
  return coins;
}

function generateEnemy(score) {
  return {
    x: Math.random() * 180,
    y: Math.random() * 180,
    size: 10,
    speed: 1 + score * 0.1
  };
}
