export const objectToQueryString = (obj: Record<string, any>) => {
  const params = new URLSearchParams()
  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      obj[key] !== undefined &&
      obj[key] !== null
    ) {
      params.append(key, obj[key])
    }
  }
  return params.toString()
}
