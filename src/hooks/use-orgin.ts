export const useOrgin = () => {
  const orgin =
    typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
  return orgin;
};
