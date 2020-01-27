export const loanAllowed = (shareAmount) => {
  return value => {
    if (value > 100000) {
      return 'Loan amount should not exceed 100,000'
    } else if (value > shareAmount) {
      return "You don't have enough shares to get this loan"
    }
    return undefined
  }
}
