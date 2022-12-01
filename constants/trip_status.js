export const status = [
  {
    value: 'pending',
    text: 'Pendiente de asignar',
    color: 'grey darken-2'
  },
  {
    value: 'asigned',
    text: 'Asignado',
    color: 'orange darken-3'
  },
  {
    value: 'unassigned',
    text: 'No-Asignado',
    color: 'orange'
  },

  {
    value: 'started',
    text: 'Iniciado',
    color: 'lime darken-3'
  },
  {
    value: 'arrived',
    text: 'En punto de recogida',
    color: 'cyan'
  },
  {
    value: 'pickedup',
    text: 'En trayecto',
    color: 'blue darken-3'
  },
  {
    value: 'done',
    text: 'Finalizado',
    color: 'green'
  },
  {
    value: 'canceled',
    text: 'Cancelado',
    color: 'red'
  },
  {
    value: 'not-defined',
    text: 'Not Defined',
    color: 'grey'
  }
]

export function getStatus (value) {
  if (
    status.findIndex((element) => {
      return element.value === value
    }) == -1
  ) {
    return status.lastItem
  }
  return status.find(status => status.value === value)
}
