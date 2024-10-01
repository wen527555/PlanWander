// utils/colors.ts
const colors = [
  '#a9a9e1',
  '#78C2C4',
  '#7B90D2',
  '#7DB9DE',
  '#FAD689',
  '#EBB471',
  '#F8C3CD',
  '#F4A7B9',
  '#5DAC81',
  '#dc9a61',
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
