interface Places {
  name: string;
  latitude: number;
  longitude: number;
  color: string;
  number: number;
}

interface Route {
  start: {
    name: string;
    latitude: number;
    longitude: number;
  };
  end: {
    name: string;
    latitude: number;
    longitude: number;
  };
  color: string;
}

const colors = [
  '#00c8ff',
  '#a5e7b7',
  '#b3b3eb',
  '#c3e5e6',
  '#eef3ac',
  '#D3D3D3',
  '#E0FFFF',
  '#FFE4E1',
  '#FFDAB9',
  '#FFF0F5',
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

export const processDays = (days: Day[]): { markers: Places[]; routes: Route[] } => {
  const places: Places[] = [];
  days.forEach((day, dayIndex) => {
    const color = getColorForDate(dayIndex);
    day.places?.forEach((place, index) => {
      places.push({
        ...place,
        color,
        number: index + 1,
      });
    });
  });

  return { places };
};
