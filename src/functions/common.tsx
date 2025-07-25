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

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
