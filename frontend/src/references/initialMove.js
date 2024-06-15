export const initialMove = {
    id: "",
    circle: {
      cX: 0,
      cY: 0,
      radiusX: 0,
      radiusY: 0,
    },
    rect: {
      width: 0,
      height: 0,
    },
    path: [],
    options: {
      shape: "line",
      mode: "draw",
      lineWidth: 1,
      fontSize:16,
      lineColor: { r: 0, g: 0, b: 0, a: 0 },
      fillColor: { r: 0, g: 0, b: 0, a: 0 },
      selection: null,
    },
    img: {
      base64: "",
    },
    timestamp: 0,
  };
  