export default (arr, key) => {
  if(arr?.all) return false
  return !arr?.[key]
}