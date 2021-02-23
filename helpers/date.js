const dateToISOString = (date) => {
  return new Date(date).toISOString()
}
const dateToString = (date) => {
  return new Date(date).toLocaleString()
}

module.exports = {
  dateToString,
  dateToISOString
}
