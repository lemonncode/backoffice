export const statusShipmentTypes = [
  {
    value: 'documented',
    text: 'Documentado',
    color: 'dark'
  },
  {
    value: 'hub',
    text: 'Hub',
    color: 'primary'
  },
  {
    value: 'out_for_delivery',
    text: 'En reparto',
    color: 'warning'
  },
  {
    value: 'failed_delivery_attempt',
    text: 'Entrega fallida',
    color: 'error'
  },
  {
    value: 'delivered',
    text: 'Entregado',
    color: 'success'
  },
  {
    value: 'returned',
    text: 'Devuelto',
    color: 'error'
  },
  {
    value: 'no_show',
    text: 'No llegado',
    color: 'error'
  },
  {
    value: 'for_return',
    text: 'Pendiente devolución',
    color: 'error'
  },
  {
    value: 'ready_for_delivery',
    text: 'Preparado',
    color: 'warning'
  },
  {
    value: 'losted',
    text: 'Perdido',
    color: 'error'
  },
  {
    value: 'ready_for_pickup',
    text: 'Pendiente de recogida',
    color: 'warning'
  },
  {
    value: 'picked_up',
    text: 'Recogido',
    color: 'success'
  },
  {
    value: 'failed_pickup_attempt',
    text: 'Recogida fallida',
    color: 'error'
  }
]

export const typeShipmentTypes = [
  {
    value: 'delivery',
    text: 'Entrega'
  },
  {
    value: 'pickup',
    text: 'Recogida'
  }
]

export function getStatusShipmentType (value) {
  return statusShipmentTypes.find(type => type.value === value)
}

export function getTypeShipmentType (value) {
  return typeShipmentTypes.find(type => type.value === value)
}
