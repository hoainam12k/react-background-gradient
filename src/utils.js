const mixColor = (color1, color2) => {
  let ratio = 0.5;
  let hex = function (x) {
    x = x.toString(16);
    return (x.length === 1) ? '0' + x : x;
  };
  let r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
  let g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
  let b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));
  return {
    r: r,
    g: g,
    b: b,
    a: 1,
    hex: '#' + hex(r) + hex(g) + hex(b)
  }
};

export {
  mixColor
}
