
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = Math.min(window.innerWidth * 0.9, 800);
    canvas.height = Math.min(window.innerHeight * 0.8, 600);

    let paddleWidth = 120;
    let paddleHeight = 15;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 6; 
    let dy = -6;

    const brickRowCount = Math.ceil(brickCount / 10);
    const brickColumnCount = 10;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = (canvas.width - (brickColumnCount * (brickWidth + brickPadding))) / 2 + brickPadding/2;

    let bricks: { x: number; y: number; status: number }[][] = [];
    let totalBricks = 0;
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        if(totalBricks < brickCount) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
            totalBricks++;
        }
      }
    }

    let rightPressed = false;
    let leftPressed = false;
    let animationFrameId: number;

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    };
    
    const mouseMoveHandler = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        if(relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    document.addEventListener("mousemove", mouseMoveHandler);


    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b && b.status === 1) {
            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
              dy = -dy;
              b.status = 0;
              totalBricks--;
              if(totalBricks === 0) {
                 setGameState('win');
              }
            }
          }
        }
      }
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#0ea5e9";
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#f97316";
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
           if (bricks[c][r] && bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = `hsl(${200 + r * 20}, 80%, 60%)`;
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
      if (y + dy < ballRadius) dy = -dy;
      else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          setGameState('gameOver');
          return; 
        }
      }

      if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 10;
      else if (leftPressed && paddleX > 0) paddleX -= 10;
      
      x += dx;
      y += dy;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [brickCount]);

  const getMessage = () => {
    if (gameState === 'gameOver') return 'Game Over!';
    if (gameState === 'win') return 'You Win!';
    return '';
  }

  return (
    <div className="relative bg-gray-900 border-4 border-primary rounded-lg shadow-2xl p-2 animate-scale-in">
        <canvas ref={canvasRef} />
        <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-white hover:bg-white/20" onClick={onGameEnd}>
            <X className="h-6 w-6"/>
        </Button>
        {gameState !== 'playing' && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white space-y-4">
                <h2 className="text-5xl font-bold">{getMessage()}</h2>
                <Button onClick={onGameEnd}>Close Game</Button>
            </div>
        )}
    </div>
  );
};
