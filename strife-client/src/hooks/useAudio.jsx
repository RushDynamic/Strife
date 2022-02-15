import { useState } from 'react';

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));

  const play = (loop = false) => {
    audio.currentTime = 0;
    audio.loop = loop;
    audio.play();
  };

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
  };

  return [play, stop];
};

export default useAudio;
