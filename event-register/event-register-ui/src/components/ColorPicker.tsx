import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
    value?: string; // Optional 8-character hex color value
    onColorChange?: (color: string) => void; // Callback for color changes
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onColorChange }) => {
    const [color, setColor] = useState<string>(value || ''); // Initialize as blank if no value is provided
    const colorInputRef = useRef<HTMLInputElement>(null);

    // Update local state when value prop changes
    useEffect(() => {
        setColor(value || ''); // Set to blank if value is missing
    }, [value]);

    // Handle hex input changes
    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newHex = e.target.value.toUpperCase();

        // Ensure valid hex starts with `#`
        if (newHex.length > 0 && !newHex.startsWith('#')) {
            newHex = `#${newHex}`;
        }

        // Handle different lengths for hex input
        if (newHex.length === 4 || newHex.length === 7) {
            // 3-character or 6-character hex without alpha; treat as fully opaque (FF)
            setColor(newHex);
            if (onColorChange) onColorChange(newHex + 'FF');
        } else if (newHex.length === 9) {
            // 8-character hex with alpha
            setColor(newHex);
            if (onColorChange) onColorChange(newHex);
        } else {
            // Allow partial input for typing
            setColor(newHex);
        }
    };

    // Handle alpha changes via range slider
    const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const alphaHex = parseInt(e.target.value).toString(16).padStart(2, '0');
        const updatedColor = color.length >= 7 ? color.slice(0, 7) + alphaHex : '#FFFFFF' + alphaHex;
        setColor(updatedColor);
        if (onColorChange) onColorChange(updatedColor);
    };

    // Trigger color input click when the preview div is clicked
    const openColorPicker = () => {
        colorInputRef.current?.click();
    };

    // Get alpha as decimal for opacity and slider input
    const alphaDecimal = color.length === 9 ? parseInt(color.slice(7, 9), 16) / 255 : 1;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {/* Hex input for color value on the left */}
                <input
                    type="text"
                    value={color.length === 9 ? color.toUpperCase() : color.toUpperCase()}
                    onChange={handleHexChange}
                    maxLength={9} // Including '#'
                    style={{ width: '100px', textAlign: 'center', marginRight: '10px' }}
                />

                {/* Hidden color input */}
                <input
                    type="color"
                    value={color.slice(0, 7) || '#FFFFFF'}
                    onChange={handleHexChange}
                    ref={colorInputRef}
                    style={{ display: 'none' }}
                />

                {/* Clickable preview div to show color with transparency */}
                <div
                    onClick={openColorPicker}
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: color.slice(0, 7) || '#FFFFFF',
                        opacity: alphaDecimal,
                        border: '1px solid gray',
                    }}
                ></div>
            </div>

            {/* Alpha slider at the bottom */}
            <input
                type="range"
                min={0}
                max={255}
                value={parseInt(color.slice(7, 9) || 'FF', 16)}
                onChange={handleAlphaChange}
                style={{ width: '160px' }}
            />
        </div>
    );
};

export default ColorPicker;
