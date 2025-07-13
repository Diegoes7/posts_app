export const capitalizeFirstLetter = (name: string): string => {
  if (typeof name !== 'string' || name.length === 0) {
    return '';
  }

  return name[0].toUpperCase() + name.slice(1).toLowerCase();
};