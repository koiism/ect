import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Title } from '@/components/ui/title'

test('Title', () => {
  render(<Title title="Home" />)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})
