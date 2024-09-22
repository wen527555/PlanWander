// utils/colors.ts
const colors = [
  '#8e8ee0',
  '#00adb0',
  '#00c8ff',
  '#4b61cf',
  '#f1a731',
  '#ed7fcc',
  '#41e26c',
  '#83d685',
  '#dc9a61',
  '#dc618a',
];

const getRandomLightColor = () => {
  const letters = 'BCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

export const getColorForDate = (dateIndex: number) => {
  if (dateIndex < colors.length) {
    return colors[dateIndex];
  } else {
    return getRandomLightColor();
  }
};
