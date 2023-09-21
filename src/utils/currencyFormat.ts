export const currencyFormat = (amount?: number, options?: Intl.NumberFormatOptions) =>
  amount
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
      maximumFractionDigits: 2,
        currencyDisplay: 'code',
        ...options,
      }).format(amount)
    : 0;
