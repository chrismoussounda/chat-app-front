import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useVideo = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const video = searchParams.get('video') || 'false';
  const isVideo: boolean = JSON.parse(video);
  const toggle = () => setSearchParams({ video: JSON.stringify(!isVideo) });
  useEffect(() => {
    const video = searchParams.get('video') || 'false';
    setSearchParams({ video }, { replace: true });
  }, [searchParams, setSearchParams]);
  return { isVideo, toggle };
};
