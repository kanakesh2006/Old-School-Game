"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

export default function FlipClock() {
  const [time, setTime] = useState({
    hours: 0,
    minutes: 25,
    seconds: 0
  });
  const [isCountdown, setIsCountdown] = useState(false);
  const [customTime, setCustomTime] = useState({
    hours: 0,
    minutes: 25,
    seconds: 0
  });
  
  // Track flip states for each individual digit position
  const [flipStates, setFlipStates] = useState({
    hoursTens: { current: 0, next: 0, isFlipping: false },
    hoursOnes: { current: 0, next: 0, isFlipping: false },
    minutesTens: { current: 2, next: 2, isFlipping: false },
    minutesOnes: { current: 5, next: 5, isFlipping: false },
    secondsTens: { current: 0, next: 0, isFlipping: false },
    secondsOnes: { current: 0, next: 0, isFlipping: false }
  });

  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isCountdown) {
      countdownRef.current = setInterval(() => {
        setTime(prevTime => {
          let newHours = prevTime.hours;
          let newMinutes = prevTime.minutes;
          let newSeconds = prevTime.seconds - 1;

          if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes -= 1;
          }

          if (newMinutes < 0) {
            newMinutes = 59;
            newHours -= 1;
          }

          if (newHours < 0) {
            // Countdown completed
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
            }
            setIsCountdown(false);
            return { hours: 0, minutes: 0, seconds: 0 };
          }

          return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);

      return () => {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
      };
    }
  }, [isCountdown]);

  // Handle flip animations when time changes - track each digit individually
  useEffect(() => {
    const formatNumber = (num: number): string => {
      return num.toString().padStart(2, '0');
    };

    const hoursFormatted = formatNumber(time.hours);
    const minutesFormatted = formatNumber(time.minutes);
    const secondsFormatted = formatNumber(time.seconds);

    const newHoursTens = parseInt(hoursFormatted.charAt(0));
    const newHoursOnes = parseInt(hoursFormatted.charAt(1));
    const newMinutesTens = parseInt(minutesFormatted.charAt(0));
    const newMinutesOnes = parseInt(minutesFormatted.charAt(1));
    const newSecondsTens = parseInt(secondsFormatted.charAt(0));
    const newSecondsOnes = parseInt(secondsFormatted.charAt(1));

    setFlipStates(prev => {
      const newStates = { ...prev };

      // Only trigger flip if the individual digit actually changed
      if (newHoursTens !== prev.hoursTens.current) {
        newStates.hoursTens = {
          current: prev.hoursTens.current,
          next: newHoursTens,
          isFlipping: true
        };
      }

      if (newHoursOnes !== prev.hoursOnes.current) {
        newStates.hoursOnes = {
          current: prev.hoursOnes.current,
          next: newHoursOnes,
          isFlipping: true
        };
      }

      if (newMinutesTens !== prev.minutesTens.current) {
        newStates.minutesTens = {
          current: prev.minutesTens.current,
          next: newMinutesTens,
          isFlipping: true
        };
      }

      if (newMinutesOnes !== prev.minutesOnes.current) {
        newStates.minutesOnes = {
          current: prev.minutesOnes.current,
          next: newMinutesOnes,
          isFlipping: true
        };
      }

      if (newSecondsTens !== prev.secondsTens.current) {
        newStates.secondsTens = {
          current: prev.secondsTens.current,
          next: newSecondsTens,
          isFlipping: true
        };
      }

      if (newSecondsOnes !== prev.secondsOnes.current) {
        newStates.secondsOnes = {
          current: prev.secondsOnes.current,
          next: newSecondsOnes,
          isFlipping: true
        };
      }

      return newStates;
    });
  }, [time]);

  // Reset flip states after animation
  useEffect(() => {
    const formatNumber = (num: number): string => {
      return num.toString().padStart(2, '0');
    };

    const hoursFormatted = formatNumber(time.hours);
    const minutesFormatted = formatNumber(time.minutes);
    const secondsFormatted = formatNumber(time.seconds);

    const newHoursTens = parseInt(hoursFormatted.charAt(0));
    const newHoursOnes = parseInt(hoursFormatted.charAt(1));
    const newMinutesTens = parseInt(minutesFormatted.charAt(0));
    const newMinutesOnes = parseInt(minutesFormatted.charAt(1));
    const newSecondsTens = parseInt(secondsFormatted.charAt(0));
    const newSecondsOnes = parseInt(secondsFormatted.charAt(1));

    const timer = setTimeout(() => {
      setFlipStates(prev => ({
        hoursTens: { current: newHoursTens, next: newHoursTens, isFlipping: false },
        hoursOnes: { current: newHoursOnes, next: newHoursOnes, isFlipping: false },
        minutesTens: { current: newMinutesTens, next: newMinutesTens, isFlipping: false },
        minutesOnes: { current: newMinutesOnes, next: newMinutesOnes, isFlipping: false },
        secondsTens: { current: newSecondsTens, next: newSecondsTens, isFlipping: false },
        secondsOnes: { current: newSecondsOnes, next: newSecondsOnes, isFlipping: false }
      }));
    }, 350); // Match the CSS animation duration: 150ms + 100ms + 100ms buffer

    return () => clearTimeout(timer);
  }, [time]);

  const startCountdown = () => {
    setTime(customTime);
    setIsCountdown(true);
  };

  const resetCountdown = () => {
    setIsCountdown(false);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    setTime(customTime);
  };

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const renderFlipCard = (value: number, dataAttribute: string, isFlipping: boolean, nextValue: number) => {
    const digit = value.toString();
    const nextDigit = nextValue.toString();
    
    return (
      <div className={styles.flipCard} data-attribute={dataAttribute}>
        {/* Static display - shows current digit */}
        <div className={styles.top}>{digit}</div>
        <div className={styles.bottom}>{digit}</div>
        
        {/* Flip animation elements - only rendered during animation */}
        {isFlipping && (
          <>
            {/* Top flip - shows current digit folding down */}
            <div className={styles.topFlip}>{digit}</div>
            {/* Bottom flip - shows next digit being revealed */}
            <div className={styles.bottomFlip}>{nextDigit}</div>
          </>
        )}
      </div>
    );
  };

  const renderSegment = (title: string, value: number, tensAttr: string, onesAttr: string) => {
    const formattedValue = formatNumber(value);
    const tensDigit = parseInt(formattedValue.charAt(0));
    const onesDigit = parseInt(formattedValue.charAt(1));

    // Get the appropriate flip states based on the segment type
    let tensFlipState, onesFlipState;
    
    if (title === "Hours") {
      tensFlipState = flipStates.hoursTens;
      onesFlipState = flipStates.hoursOnes;
    } else if (title === "Minutes") {
      tensFlipState = flipStates.minutesTens;
      onesFlipState = flipStates.minutesOnes;
    } else { // Seconds
      tensFlipState = flipStates.secondsTens;
      onesFlipState = flipStates.secondsOnes;
    }

    return (
      <div className={styles.containerSegment}>
        <div className={styles.segmentTitle}>{title}</div>
        <div className={styles.segment}>
          {renderFlipCard(tensDigit, tensAttr, tensFlipState.isFlipping, tensFlipState.next)}
          {renderFlipCard(onesDigit, onesAttr, onesFlipState.isFlipping, onesFlipState.next)}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.heading}>Flip-Clock</h4>
      
      <div className={styles.countdown}>
        {renderSegment("Hours", time.hours, "hours-tens", "hours-ones")}
        {renderSegment("Minutes", time.minutes, "minutes-tens", "minutes-ones")}
        {renderSegment("Seconds", time.seconds, "seconds-tens", "seconds-ones")}
      </div>

      <div className={styles.controls}>
        <div className={styles.timeInputs}>
          <div className={styles.inputGroup}>
            <label>Hours:</label>
            <input
              type="number"
              min="0"
              max="99"
              value={customTime.hours}
              onChange={(e) => setCustomTime(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
              disabled={isCountdown}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Minutes:</label>
            <input
              type="number"
              min="0"
              max="59"
              value={customTime.minutes}
              onChange={(e) => setCustomTime(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
              disabled={isCountdown}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Seconds:</label>
            <input
              type="number"
              min="0"
              max="59"
              value={customTime.seconds}
              onChange={(e) => setCustomTime(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
              disabled={isCountdown}
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <button 
            onClick={startCountdown}
            disabled={isCountdown}
            className={styles.startButton}
          >
            Start Countdown
          </button>
          <button 
            onClick={resetCountdown}
            className={styles.resetButton}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
