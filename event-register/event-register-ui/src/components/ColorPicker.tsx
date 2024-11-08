import React, { useState, useEffect } from 'react';

interface ColorPickerProps {
    value?: string; // Optional 8-character hex color value
    onColorChange?: (color: string) => void; // Callback for color changes
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onColorChange }) => {
    const [color, setColor] = useState<string>(value || ''); // Initialize as blank if no value is provided

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

    // Get alpha as decimal for preview background
    const alphaDecimal = color.length === 9 ? parseInt(color.slice(7, 9), 16) / 255 : 1;

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid gray',
                overflow: 'hidden', // Ensure background preview is clipped to container
            }}
        >
            {/* Background color preview behind inputs */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: color.slice(0, 7) || '#FFFFFF',
                    opacity: alphaDecimal,
                    zIndex: 1, // Behind other content
                    pointerEvents: 'none', // Prevent interaction with the background layer
                }}
            />

            <div style={{ display: 'flex', alignItems: 'center', zIndex: 2, marginBottom: '10px' }}>
                {/* Hex input for color value on the left */}
                <input
                    type="text"
                    value={color.length === 9 ? color.toUpperCase() : color.toUpperCase()} // Display hex only
                    onChange={handleHexChange}
                    maxLength={9} // Including '#'
                    style={{ width: '150px', textAlign: 'center', marginRight: '10px'}}
                />

                {/* Visible color input */}
                <input
                    type="color"
                    value={color.slice(0, 7) || '#FFFFFF'}
                    onChange={(e) => handleHexChange(e as any)} // Cast as any to reuse handleHexChange
                    style={{
                        width: '55px', height: '55px', cursor: 'pointer',
                        border: 'none', boxSizing: "content-box", margin: 0,
                        padding: 0}}
                />
            </div>

            {/* Alpha slider at the bottom */}
            <input
                type="range"
                min={0}
                max={255}
                value={parseInt(color.slice(7, 9) || 'FF', 16)}
                onChange={handleAlphaChange}
                style={{ width: '160px', zIndex: 2 }}
            />
        </div>
    );
};

export default ColorPicker;
