'use client';

interface ControlsProps {
  positionX: number;
  setPositionX: (val: number) => void;
  positionY: number;
  setPositionY: (val: number) => void;
  scale: number;
  setScale: (val: number) => void;
  disabled: boolean;
}

export default function Controls({
  positionX, setPositionX,
  positionY, setPositionY,
  scale, setScale,
  disabled
}: ControlsProps) {
  
  return (
    <div className={`flex flex-col gap-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      
      {/* Posición X */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-fg">
            Posición Horizontal (X)
          </label>
          <span className="text-[10px] font-bold text-foreground">{positionX}%</span>
        </div>
        <input 
          type="range" 
          min="0" max="100" 
          value={positionX} 
          onChange={(e) => setPositionX(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none bg-border outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-volt [&::-webkit-slider-thumb]:rounded-none"
        />
      </div>

      {/* Posición Y */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-fg">
            Posición Vertical (Y)
          </label>
          <span className="text-[10px] font-bold text-foreground">{positionY}%</span>
        </div>
        <input 
          type="range" 
          min="0" max="100" 
          value={positionY} 
          onChange={(e) => setPositionY(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none bg-border outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-volt [&::-webkit-slider-thumb]:rounded-none"
        />
      </div>

      {/* Escala */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-fg">
            Tamaño (Escala)
          </label>
          <span className="text-[10px] font-bold text-foreground">{scale}%</span>
        </div>
        <input 
          type="range" 
          min="50" max="150" 
          value={scale} 
          onChange={(e) => setScale(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none bg-border outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-volt [&::-webkit-slider-thumb]:rounded-none"
        />
      </div>

      {/* Reset */}
      <button 
        onClick={() => {
          setPositionX(50);
          setPositionY(30);
          setScale(100);
        }}
        className="self-start text-[10px] font-bold uppercase tracking-widest text-volt hover:underline underline-offset-2"
      >
        Reiniciar Controles
      </button>

    </div>
  );
}
