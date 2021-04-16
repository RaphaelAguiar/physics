export const formatVector = (v, p) => {
  return v.map(v => {
    return +v.toFixed(p)
  })
}