export const boilerImages = [
  {
    src: "/boiler/110%20Seriously%20Super%20Creative%20Print%20Ads%20%E2%80%93%20Bashooka.jpg",
    alt: "Abstract circuit-board portrait on a dark green background",
  },
  {
    src: "/boiler/download%20(1).jpg",
    alt: "Illustrated hand reaching toward a digital globe",
  },
  {
    src: "/boiler/download%20(2).jpg",
    alt: "Profile portrait made from binary code and circuit traces",
  },
  {
    src: "/boiler/download.jpg",
    alt: "A tree formed from circuit traces",
  },
] as const;

export function getBoilerImage(index: number) {
  return boilerImages[index % boilerImages.length];
}
