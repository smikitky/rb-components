import React from 'react';

const wrapDisplayName = (name: string, component: React.ComponentType<any>) => {
  return `${name}(${getDisplayName(component)})`;
};

export default wrapDisplayName;

export const getDisplayName = (component: React.ComponentType<any>): string => {
  return component.displayName || component.name || 'Component';
};
