export const source = [
  {
    value: 'dashboard',
    text: 'Dashboard'
  },
  {
    value: 'glovo',
    text: 'Glovo'
  },
  {
    value: 'LastApp',
    text: 'LastApp'
  },

  {
    value: 'Mulesoft',
    text: 'Mulesoft'
  },
  {
    value: 'Deliverry',
    text: 'Deliverry'
  },
  {
    value: 'Cheerfy',
    text: 'Cheerfy'
  },
  {
    value: 'backoffice',
    text: 'Backoffice'
  }
]

export function getSource (value) {
  if (
    source.findIndex((element) => {
      return element.value === value
    }) == -1
  ) {
    return source.lastItem
  }
  return source.find(source => source.value === value)
}
