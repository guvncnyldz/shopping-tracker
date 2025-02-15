export function customParseFloat(value) {
    const num = parseFloat(value);
    return parseFloat(num.toFixed(2));
  }