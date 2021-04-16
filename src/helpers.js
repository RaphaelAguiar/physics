export const formatVector = (v, p) => {
  return v.map(v => {
    return +v.toFixed(p)
  })
}

export const distanceBetwenPoints = (v1, v2) => {
  const retorno = Math.sqrt(
    v1.map((p1, i) => {
      const p2 = v2[i]
      const retorno = Math.pow(p2 - p1, 2)
      return retorno
    }).reduce((a, b) => a + b, 0)
  )
  return retorno
}

export const calculateVectorDirection = (p1, p2) => {
  const d = distanceBetwenPoints(p1, p2)
  const retorno = p1.map((a1,i) => {
    const a2 = p2[i]
    const a = (a1 - a2) / d
    return a
  })
  return retorno
}
