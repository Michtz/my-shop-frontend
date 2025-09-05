export const getCategoryName = (category: string): string | undefined => {
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
      return undefined;
  }
};

export const getCategoryIndex = (category: string): number => {
  switch (category) {
    case 'tampers':
      return 1;
    case 'milk-jugs':
      return 2;
    case 'tools':
      return 3;
    case 'coffee-cups':
      return 4;
    case 'cleaning-tools':
      return 5;
    case 'scales':
      return 6;
    default:
      return 0;
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
