export const startTypes = [
  {
    value: 'asap',
    text: 'Inmediato',
    color: 'red'
  }, {
    value: 'reservation',
    text: 'Reserva',
    color: 'grey'
  }
]

export function getStartType (value) {
  return status.find(type => type.value === value)
}
