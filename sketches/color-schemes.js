export const COLOR_SCHEMES = [
  ['#161E54', '#88E0EF', '#FF5151', '#FF9B6A'],
  ['#FEF5ED', '#D3E4CD', '#ADC2A9', '#99A799'],
  ['#9D5C0D', '#E5890A', '#F7D08A', '#FAFAFA'],
  ['#000D6B', '#9C19E0', '#FF5DA2', '#99DDCC'],
  ['#66806A', '#B4C6A6', '#FFC286', '#FFF1AF'],
  ['#000000', '#F58840', '#B85252', '#EADEDE'],
  ['#88E0EF', '#161E54', '#FF5151', '#FF9B6A'],
  ['#FFCE45', '#D4AC2B', '#B05E27', '#7E370C'],
  ['#F0E9D2', '#E6DDC4', '#678983', '#181D31'],
  ['#FEFFDE', '#DDFFBC', '#91C788', '#52734D'],
  ['#DDDDDD', '#222831', '#30475E', '#F05454'],
  ['#120078', '#9D0191', '#FD3A69', '#FECD1A'],
  ['#FFAB73', '#FFD384', '#FFF9B0', '#FFAEC0'],
  ['#0A043C', '#03506F', '#BBBBBB', '#FFE3D8'],
  ['#E6E6E6', '#C5A880', '#532E1C', '#0F0F0F'],
];

export const randomColorScheme =
  COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)];
