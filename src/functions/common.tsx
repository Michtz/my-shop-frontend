export const getCategoryName = (category: string): string => {
  switch (category) {
    case 'tampers':
      return 'Tampers';
    case 'milk-jugs':
      return 'Milk Jugs';
    case 'tools':
      return 'Tools';
    case 'coffee-cups':
      return 'Coffee Cups';
    case 'cleaning-tools':
      return 'Cleaning Tools';
    case 'scales':
      return 'Scales';
    default:
      return 'unknown category';
  }
};
