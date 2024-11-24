import { useCallback, useEffect, useState } from 'react';

const useScroll = (threshold: number) => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    if ((window.scrollY || window.pageYOffset) > threshold) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, [threshold]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return scrolled;
};

export default useScroll;
