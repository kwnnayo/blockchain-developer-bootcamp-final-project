export const getState = (state) => {
  switch (state) {
    case '0':
      return 'In Progress';
    case '1':
      return 'Goal reached';
    case '2':
      return 'Goal reached and owner got paid';
    default:
      return '';
  }
};
