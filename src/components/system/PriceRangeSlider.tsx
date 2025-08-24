'use client';
import React, { useState, useEffect } from 'react';

export interface PriceRangeSliderProps {
  minPrice?: number;
  maxPrice?: number;
  currentMin?: number;
  currentMax?: number;
  onPriceChange?: (min: number, max: number) => void;
  onClose?: () => void;
  currency?: string;
  histogramData?: number[];
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice = 1,
  maxPrice = 4601,
  currentMin = 1,
  currentMax = 4601,
  onPriceChange,
  onClose,
  currency = 'CHF',
}) => {
  const [minValue, setMinValue] = useState(currentMin);
  const [maxValue, setMaxValue] = useState(currentMax);

  // Update local state when props change
  useEffect(() => {
    setMinValue(currentMin);
    setMaxValue(currentMax);
  }, [currentMin, currentMax]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(value);
    onPriceChange?.(value, maxValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(value);
    onPriceChange?.(minValue, value);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      minPrice,
      Math.min(Number(e.target.value) || minPrice, maxValue - 1),
    );
    setMinValue(value);
    onPriceChange?.(value, maxValue);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(
      maxPrice,
      Math.max(Number(e.target.value) || maxPrice, minValue + 1),
    );
    setMaxValue(value);
    onPriceChange?.(minValue, value);
  };

  const handleReset = () => {
    setMinValue(minPrice);
    setMaxValue(maxPrice);
    onPriceChange?.(minPrice, maxPrice);
  };

  const getSliderBackground = () => {
    const minPercent = ((minValue - minPrice) / (maxPrice - minPrice)) * 100;
    const maxPercent = ((maxValue - minPrice) / (maxPrice - minPrice)) * 100;
    return `linear-gradient(to right, #ddd 0%, #ddd ${minPercent}%, #f1c40f ${minPercent}%, #f1c40f ${maxPercent}%, #ddd ${maxPercent}%, #ddd 100%)`;
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          zIndex: 1000,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          minWidth: '350px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          marginTop: '5px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            Preis
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#999',
              padding: '0',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Reset Link */}
        <button
          onClick={handleReset}
          style={{
            background: 'none',
            border: 'none',
            color: '#999',
            cursor: 'pointer',
            marginBottom: '20px',
            fontSize: '14px',
            padding: '0',
            textDecoration: 'underline',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#666')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
        >
          Zurücksetzen
        </button>

        {/* Dual Range Slider */}
        <div
          style={{
            position: 'relative',
            marginBottom: '30px',
            height: '40px',
            margin: '20px 10px 30px 10px',
          }}
        >
          {/* Track Background */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '0',
              right: '0',
              height: '4px',
              background: getSliderBackground(),
              borderRadius: '2px',
            }}
          />

          {/* Min Slider */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={minValue}
            onChange={handleMinChange}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              width: '100%',
              height: '40px',
              background: 'transparent',
              appearance: 'none',
              outline: 'none',
              zIndex: 1,
            }}
          />

          {/* Max Slider */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={maxValue}
            onChange={handleMaxChange}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              width: '100%',
              height: '40px',
              background: 'transparent',
              appearance: 'none',
              outline: 'none',
              zIndex: 2,
            }}
          />
        </div>

        {/* Min/Max Input Fields */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
            alignItems: 'end',
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                marginBottom: '5px',
                color: '#666',
                fontWeight: '500',
              }}
            >
              Min
            </label>
            <div
              style={{
                display: 'flex',
                border: '1px solid #ddd',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: 'white',
              }}
            >
              <span
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#f8f9fa',
                  border: 'none',
                  fontSize: '14px',
                  color: '#666',
                  fontWeight: '500',
                }}
              >
                {currency}
              </span>
              <input
                type="number"
                value={minValue}
                onChange={handleMinInputChange}
                min={minPrice}
                max={maxValue - 1}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  backgroundColor: 'white',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              fontSize: '14px',
              color: '#666',
            }}
          >
            —
          </div>

          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                marginBottom: '5px',
                color: '#666',
                fontWeight: '500',
              }}
            >
              Max
            </label>
            <div
              style={{
                display: 'flex',
                border: '1px solid #ddd',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: 'white',
              }}
            >
              <span
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#f8f9fa',
                  border: 'none',
                  fontSize: '14px',
                  color: '#666',
                  fontWeight: '500',
                }}
              >
                {currency}
              </span>
              <input
                type="number"
                value={maxValue}
                onChange={handleMaxInputChange}
                min={minValue + 1}
                max={maxPrice}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  backgroundColor: 'white',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        input[type='range'] {
          pointer-events: none;
        }

        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid #333;
          cursor: pointer;
          pointer-events: all;
          position: relative;
          z-index: 3;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        input[type='range']::-webkit-slider-thumb:hover {
          border-color: #000;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        input[type='range']::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid #333;
          cursor: pointer;
          pointer-events: all;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        input[type='range']::-moz-range-thumb:hover {
          border-color: #000;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        input[type='range']::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>
    </>
  );
};

export default PriceRangeSlider;
