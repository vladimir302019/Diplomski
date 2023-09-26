import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

const DeliveryCountdown = ({ deliveryTime, onCountdownComplete, onRemainingHoursChange }) => {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateCountdown = () => {
      const currentTime = new Date().getTime();
      const deliveryTimeValue = new Date(deliveryTime).getTime();

      const remainingTime = deliveryTimeValue - currentTime;
      const remainingSeconds = Math.floor((remainingTime / 1000) % 60);
      const remainingMinutes = Math.floor((remainingTime / (1000 * 60)) % 60);
      const remainingHours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);

      setCountdown({ hours: remainingHours, minutes: remainingMinutes, seconds: remainingSeconds });
      onRemainingHoursChange(remainingHours); // Pass the remaining hours to the parent component

      if (remainingTime <= 0) {
        onCountdownComplete(); // Call a callback function when countdown completes
      }
    };

    calculateCountdown();

    const timer = setInterval(calculateCountdown, 1000);

    // Clean up the timer when the component unmounts
    return () => clearInterval(timer);
  }, [deliveryTime, onCountdownComplete, onRemainingHoursChange]);

  return (
    <Typography  component="div">
      {countdown.hours}:{countdown.minutes < 10 ? '0' : ''}
      {countdown.minutes}:{countdown.seconds < 10 ? '0' : ''}
      {countdown.seconds}
    </Typography>
  );
};


  export default DeliveryCountdown;