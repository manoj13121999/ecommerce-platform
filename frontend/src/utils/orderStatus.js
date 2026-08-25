const STATUS_LABELS = {
  PLACED: 'Payment pending',
  PAID: 'Paid',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const STATUS_CLASS = {
  PLACED: 'order-status-pending',
  PAID: 'order-status-paid',
  SHIPPED: 'order-status-shipped',
  DELIVERED: 'order-status-delivered',
  CANCELLED: 'order-status-cancelled',
};

const TRACKING_STEPS = ['PLACED', 'PAID', 'SHIPPED', 'DELIVERED'];

export function orderStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function orderStatusClass(status) {
  return STATUS_CLASS[status] || 'order-status-pending';
}

export function orderTrackingSteps(status) {
  if (status === 'CANCELLED') {
    return [
      { key: 'PLACED', label: 'Order placed', done: true },
      { key: 'CANCELLED', label: 'Cancelled', done: true, cancelled: true },
    ];
  }

  const currentIndex = TRACKING_STEPS.indexOf(status);
  return TRACKING_STEPS.map((step, index) => ({
    key: step,
    label: orderStatusLabel(step),
    done: currentIndex >= index,
    active: currentIndex === index,
  }));
}
