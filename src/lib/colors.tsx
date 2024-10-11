// utils/colors.ts
const colors = [
  '#7B90D2',
  '#FAD689',
  '#F4A7B9',
  '#7DB9DE',
  '#EBB471',
  '#a9a9e1',
  '#78C2C4',
  '#F8C3CD',
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
