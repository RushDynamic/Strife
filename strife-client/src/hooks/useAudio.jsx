import { useState } from 'react';

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));

  const notify = () => {
    audio.currentTime = 0;
    audio.play();
  };

  return [notify];
};

export default useAudio;
