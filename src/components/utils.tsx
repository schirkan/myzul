export const getSeedFromLocation = () => {
  var hash = window.location.hash?.trim().substring(1) || '';
  return hash.length > 0 ? hash : undefined;
};

export const updateSeedToLocation = (seed: string) => {
  window.location.hash = seed;
};
