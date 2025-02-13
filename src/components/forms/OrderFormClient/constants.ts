export type FormStep = {
  readonly id: 'contact' | 'details' | 'review'
  readonly title: string
}

export const BASE_FORM_STEPS: readonly FormStep[] = [
  { id: 'contact', title: 'Contact' },
  { id: 'details', title: 'Details' },
  { id: 'review', title: 'Review' },
]

export const getFormSteps = (hasRequiredInfo: boolean): readonly FormStep[] => {
  if (!hasRequiredInfo) {
    return BASE_FORM_STEPS.filter(step => step.id !== 'details')
  }
  return BASE_FORM_STEPS
}
