
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DXBallGameProps {
  brickCount: number;
  onGameEnd: () => void;
}

export const DXBallGame: React.FC<DXBallGameProps> = ({ brickCount, onGameEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'win'>('playing');

  // Use refs for all game state that changes inside the animation loop
  const gameInstance = useRef({
    paddleX: 0,
    ballX: 0,
    ballY: 0,
    ballDX: 8,
    ballDY: -8,
    rightPressed: false,
    leftPressed: false,
    bricks: [] as { x: number; y: number; status: number }[],
    score: 0,
    animationFrameId: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Game Setup ---
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const paddleHeight = 15;
    const paddleWidth = 120;
    const ballRadius = 10;

    const game = gameInstance.current;
    game.paddleX = (canvas.width - paddleWidth) / 2;
    game.ballX = canvas.width / 2;
    game.ballY = canvas.height - 30;
    game.score = 0; // Reset score on new game
    game.ballDX = 8; // Reset ball speed
    game.ballDY = -8;

    // --- Brick Generation (Refactored Logic) ---
    game.bricks = [];
    const brickColumnCount = 10;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = (canvas.width - (brickColumnCount * (brickWidth + brickPadding))) / 2 + brickPadding / 2;

    for (let i = 0; i < brickCount; i++) {
        const c = i % brickColumnCount;
        const r = Math.floor(i / brickColumnCount);
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        game.bricks.push({ x: brickX, y: brickY, status: 1 });
    }
    
    // --- Controls ---
    const keyDownHandler = (e: KeyboardEvent) => {
      if(e.key == "Right" || e.key == "ArrowRight") game.rightPressed = true;
      else if(e.key == "Left" || e.key == "ArrowLeft") game.leftPressed = true;
    }
    const keyUpHandler = (e: KeyboardEvent) => {
      if(e.key == "Right" || e.key == "ArrowRight") game.rightPressed = false;
      else if(e.key == "Left" || e.key == "ArrowLeft") game.leftPressed = false;
    }
    const mouseMoveHandler = (e: MouseEvent) => {
      const relativeX = e.clientX - canvas.getBoundingClientRect().left;
      if(relativeX > 0 && relativeX < canvas.width) {
        game.paddleX = relativeX - paddleWidth / 2;
      }
    }
    const touchMoveHandler = (e: TouchEvent) => {
        const relativeX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
        if (relativeX > 0 && relativeX < canvas.width) {
            game.paddleX = relativeX - paddleWidth / 2;
        }
    };
    
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    canvas.addEventListener("touchmove", touchMoveHandler, false);

    // --- Drawing Functions ---
    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(game.ballX, game.ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#0ea5e9";
      ctx.fill();
      ctx.closePath();
    }
    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(game.paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#f97316";
      ctx.fill();
      ctx.closePath();
    }
    const drawBricks = () => {
        game.bricks.forEach((brick, index) => {
            if (brick.status === 1) {
                const row = Math.floor(index / brickColumnCount);
                ctx.beginPath();
                ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
                ctx.fillStyle = `hsl(${200 + row * 20}, 80%, 60%)`;
                ctx.fill();
                ctx.closePath();
            }
        });
    }
    
    const collisionDetection = () => {
      game.bricks.forEach(b => {
          if (b.status === 1) {
            if (game.ballX > b.x && game.ballX < b.x + brickWidth && game.ballY > b.y && game.ballY < b.y + brickHeight) {
              game.ballDY = -game.ballDY;
              b.status = 0;
              game.score++;
              
              // Increase speed by a random amount between 15% and 25%
              const speedMultiplier = 1.15 + Math.random() * 0.10;
              game.ballDX *= speedMultiplier;
              game.ballDY *= speedMultiplier;
              
              if (game.score === brickCount) {
                setGameState('win');
              }
            }
          }
        });
    }

    // --- Game Loop ---
    const draw = () => {
      if (gameInstance.current.animationFrameId === -1) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      if (game.ballX + game.ballDX > canvas.width - ballRadius || game.ballX + game.ballDX < ballRadius) game.ballDX = -game.ballDX;
      if (game.ballY + game.ballDY < ballRadius) game.ballDY = -game.ballDY;
      else if (game.ballY + game.ballDY > canvas.height - ballRadius) {
        if (game.ballX > game.paddleX && game.ballX < game.paddleX + paddleWidth) {
          game.ballDY = -game.ballDY;
        } else {
          setGameState('gameOver');
          return;
        }
      }

      if (game.rightPressed && game.paddleX < canvas.width - paddleWidth) game.paddleX += 10;
      else if (game.leftPressed && game.paddleX > 0) game.paddleX -= 10;
      
      game.ballX += game.ballDX;
      game.ballY += game.ballDY;

      game.animationFrameId = requestAnimationFrame(draw);
    };

    game.animationFrameId = requestAnimationFrame(draw);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(game.animationFrameId);
      gameInstance.current.animationFrameId = -1;
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
      canvas.removeEventListener("touchmove", touchMoveHandler);
    };
  }, [brickCount]);

  useEffect(() => {
    if (gameState !== 'playing' && gameInstance.current.animationFrameId > 0) {
      cancelAnimationFrame(gameInstance.current.animationFrameId);
      gameInstance.current.animationFrameId = 0;
    }
  }, [gameState]);


  const getMessage = () => {
    if (gameState === 'gameOver') return 'Game Over!';
    if (gameState === 'win') return `You Win! Brokerage Earned: ₹${brickCount.toFixed(2)}`;
    return '';
  }

  return (
    <div className="relative w-full h-full bg-gray-900 flex items-center justify-center animate-scale-in">
        <canvas ref={canvasRef} />
        <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-white hover:bg-white/20" onClick={onGameEnd}>
            <X className="h-6 w-6"/>
        </Button>
        {gameState !== 'playing' && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white space-y-4">
                <h2 className="text-4xl sm:text-5xl font-bold text-center px-4">{getMessage()}</h2>
                <Button onClick={onGameEnd}>Close Game</Button>
            </div>
        )}
    </div>
  );
};
