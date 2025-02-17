import React, { useState, useEffect } from 'react';
import LiquidFillGauge from 'react-liquid-gauge';
import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import MotorControl from '../components/MotorControl';

const GaugeWrapper = (props) => {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0].includes('defaultProps')) return;
    originalConsoleError(...args);
  };

  React.useEffect(() => {
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return <LiquidFillGauge {...props} />;
};

const ReadWater = () => {
  const [value, setValue] = useState(0);
  const [waterData, setWaterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchWaterLevel = async () => {
      try {
        const response = await fetch('/api/location/2575/tank', {
          headers: {
            'Authorization': `TOKEN ${import.meta.env.VITE_Auth_Token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data[0] && data[0].current_water_level) {
          setValue(data[0].current_water_level.water_level_in_percentage);
          setWaterData({
            cms: `${Math.round(data[0].current_water_level.water_level)} out of ${data[0].height} cms`,
            kl: `${data[0].current_water_level.water_level_in_KL.toFixed(2)} out of ${(data[0].total_volume / 1000).toFixed(2)} KL`
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWaterLevel();
    const interval = setInterval(fetchWaterLevel, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const startColor = '#00bfff';
  const endColor = '#1e90ff';
  const radius = 200;
  const radiusSmall = 150;
  const currentRadius = windowWidth < 768 ? radiusSmall : radius;

  const interpolate = interpolateRgb(startColor, endColor);
  const fillColor = interpolate(value / 100);

  const gradientStops = [
    {
      key: '0%',
      stopColor: color(fillColor).darker(0.5).toString(),
      stopOpacity: 1,
      offset: '0%'
    },
    {
      key: '50%',
      stopColor: fillColor,
      stopOpacity: 0.75,
      offset: '50%'
    },
    {
      key: '100%',
      stopColor: color(fillColor).brighter(0.5).toString(),
      stopOpacity: 0.5,
      offset: '100%'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading water level data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-4 md:p-8 space-y-8 md:space-y-0 md:space-x-24">
      {/* Gauge */}
      <div className="w-full md:w-auto flex justify-center">
        <GaugeWrapper
          width={currentRadius * 2}
          height={currentRadius * 2}
          value={value}
          percent="%"
          textSize={1}
          textOffsetX={0}
          textOffsetY={0}
          textRenderer={(props) => {
            const value = Math.round(props.value);
            const textPixels = (props.textSize * Math.min(props.height / 2, props.width / 2) / 2);
            return (
              <tspan>
                <tspan style={{ fontSize: textPixels }}>{value}</tspan>
                <tspan style={{ fontSize: textPixels * 0.6 }}>{props.percent}</tspan>
              </tspan>
            );
          }}
          riseAnimation
          waveAnimation
          waveFrequency={2}
          waveAmplitude={1}
          gradient
          gradientStops={gradientStops}
          circleStyle={{ fill: fillColor }}
          waveStyle={{ fill: fillColor }}
          textStyle={{
            fill: color('#444').toString(),
            fontFamily: 'Arial'
          }}
          waveTextStyle={{
            fill: color('#fff').toString(),
            fontFamily: 'Arial'
          }}
        />
      </div>

      {/* Data Display */}
      {/* Data Display */}
      <div className="text-center w-full md:w-auto">
        {waterData && (
          <div className="space-y-4">
            <div className="text-6xl text-gray-700">{Math.round(value)}%</div> {/* Increased font size */}
            <div className="text-2xl text-gray-600">{waterData.cms}</div> {/* Increased font size */}
            <div className="text-2xl text-gray-600">{waterData.kl}</div> {/* Increased font size */}
          </div>
        )}

        {/* Last Updated */}
        <div className="text-sm text-gray-500 mt-4">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      <MotorControl/>

    </div>
  );
};

export default ReadWater;