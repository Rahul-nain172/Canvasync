export const colors = {
    PURPLE: "#6B32F3",
    BLUE: "#408FF8",
    RED: "#F32D27",
    GREEN: "#6FCB12",
    GOLD: "#A89D6C",
    PINK: "#EB29DA",
    MINT: "#19CB87",
    RED_LIGHT: "#ED7878",
    CYAN: "#02CBF6",
    RED_DARK: "#BA1555",
    ORANGE: "#FF7300",
};
export const colorsArr = [...Object.values(colors)];
export const getNextColor = (t_color) => {
    const index = colorsArr.findIndex((color) => color === t_color);
  
    if (index === -1) return colorsArr[0];
  
    return colorsArr[(index + 1) % colorsArr.length];
};