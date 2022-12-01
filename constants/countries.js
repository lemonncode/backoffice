export const country = [
  {
    value: 'ES',
    text: 'España'
  }
]

export function getStatus (value) {
  if (
    country.findIndex((element) => {
      return element.value === value
    }) == -1
  ) {
    return country.lastItem
  }
  return country.find(status => status.value === value)
}
