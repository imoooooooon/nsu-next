export const MOMENT_FRAMES = [
  {
    id: "squircle",
    label: "Soft square",
    path: "M500 0C940 0 1000 60 1000 500C1000 940 940 1000 500 1000C60 1000 0 940 0 500C0 60 60 0 500 0Z",
  },
  {
    id: "hexagon",
    label: "Soft hexagon",
    path: "M500 35C560 35 585 58 675 105L865 210C942 252 966 300 966 390L966 610C966 700 942 748 865 790L675 895C585 942 560 965 500 965C440 965 415 942 325 895L135 790C58 748 34 700 34 610L34 390C34 300 58 252 135 210L325 105C415 58 440 35 500 35Z",
  },
  {
    id: "triangle",
    label: "Soft triangle",
    path: "M500 45C575 45 613 112 671 210L910 630C995 781 943 920 770 936C610 952 390 952 230 936C57 920 5 781 90 630L329 210C387 112 425 45 500 45Z",
  },
  {
    id: "organic",
    label: "Organic circle",
    path: "M500 30C690 0 870 96 937 275C1020 460 975 708 813 858C652 1008 388 1010 194 891C14 780 6 553 45 355C80 169 294 64 500 30Z",
  },
];
export const STORIES_ENABLED = false;
export function momentFrame(id) {
  return MOMENT_FRAMES.find((frame) => frame.id === id) || MOMENT_FRAMES[0];
}
export function frameStyle(id) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="${momentFrame(id).path}"/></svg>`;
  return {
    "--instant-mask": `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
  };
}
export function normalizePresentation(frame, captionPosition) {
  return {
    frame: momentFrame(frame).id,
    captionPosition: Number.isFinite(captionPosition)
      ? Math.max(0, Math.min(100, captionPosition))
      : 81,
  };
}
