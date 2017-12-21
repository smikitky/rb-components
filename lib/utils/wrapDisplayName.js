export default function wrapDisplayName(name, component) {
  return `${name}(${getDisplayName(component)})`;
}

export function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}
