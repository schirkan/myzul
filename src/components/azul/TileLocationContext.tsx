import React from 'react';

export const defaultLocation = {
  placeholder: {} as {
    [index: string]: HTMLDivElement
  }
};

export const TileLocationContext = React.createContext(defaultLocation);
