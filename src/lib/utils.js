export const t = n => {
  const x = parseInt(n, 10)
  return Math.round(x + Math.pow(2, x / 10))
}
