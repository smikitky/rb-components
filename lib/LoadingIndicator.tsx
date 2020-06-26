import React, { useState, useEffect } from 'react';
import Icon from './Icon';

const StaticLoadingIndicator: React.FC<{
  icon?: string;
}> = props => {
  const { icon = 'refresh' } = props;
  return <Icon icon={icon} spin={true} />;
};

const LoadingIndicator: React.FC<{
  delay?: number;
  icon: string;
}> = props => {
  const { delay, icon } = props;
  const [show, setShow] = useState(() => !(props.delay > 0));

  useEffect(() => {
    if (show) return;
    let cancelled = false;
    const start = new Date().getTime();
    const handleNextFrame = () => {
      if (cancelled) return;
      const current = new Date().getTime();
      if (current - start > delay) {
        setShow(true);
      } else {
        requestAnimationFrame(handleNextFrame);
      }
    };
    requestAnimationFrame(handleNextFrame);
    return () => {
      cancelled = true;
    };
  }, [delay, show]);

  return show && <StaticLoadingIndicator icon={icon} />;
};

export default LoadingIndicator;
