import React, { useRef, useEffect, useState } from 'react';
import './ScratchCard.css';

const ScratchCard = () => {
  const canvasRef = useRef(null);
  const [scratched, setScratched] = useState(false);
  const [reward] = useState('🎉 20% OFF on Skins!');

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = 300;
  canvas.height = 100;

  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const scratch = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const cleared = pixels.reduce((acc, val, i) => acc + (val === 0 ? 1 : 0), 0);

    if (cleared > canvas.width * canvas.height * 0.5 && !scratched) {
      setScratched(true);
    }
  };

  canvas.addEventListener('mousemove', scratch);
  canvas.addEventListener('touchmove', scratch);

  return () => {
    canvas.removeEventListener('mousemove', scratch);
    canvas.removeEventListener('touchmove', scratch);
  };
}, [scratched]);



  return (
    <div className="scratch-wrapper">
      <h3>🎁 Scratch & Win</h3>
      <div className="scratch-card">
        <div className="reward-text">{scratched ? reward : 'Scratch Here!'}</div>
        {!scratched && <canvas ref={canvasRef}></canvas>}
      </div>
    </div>
  );
};

export default ScratchCard;
