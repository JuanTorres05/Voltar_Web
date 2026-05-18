'use client';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const COLORS = [
  { name: 'Blanco', value: '#FFFFFF' },
  { name: 'Negro', value: '#1A1A1A' }, // No usamos #000000 puro para que el multiply no borre las arrugas totalmente
  { name: 'Gris', value: '#808080' },
  { name: 'Azul Marino', value: '#1C2841' },
  { name: 'Rojo', value: '#B22222' },
  { name: 'Verde', value: '#2E8B57' },
  { name: 'Amarillo', value: '#DAA520' },
  { name: 'Rosado', value: '#FFB6C1' },
];

export default function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {COLORS.map((color) => {
        const isSelected = selectedColor === color.value;
        const isWhite = color.value === '#FFFFFF';
        
        return (
          <button
            key={color.name}
            onClick={() => onSelectColor(color.value)}
            className={`group relative h-12 w-12 transition-all hover:scale-105 ${
              isSelected ? 'ring-2 ring-volt ring-offset-2 ring-offset-background' : ''
            }`}
            title={color.name}
          >
            <div 
              className={`absolute inset-0 border ${isWhite ? 'border-border' : 'border-transparent'}`}
              style={{ backgroundColor: color.value }}
            />
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`h-2 w-2 rounded-full ${isWhite ? 'bg-black' : 'bg-white'}`} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
