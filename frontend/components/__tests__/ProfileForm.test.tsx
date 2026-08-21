// frontend/components/__tests__/ProfileForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileForm from '../forms/ProfileForm';

test('renders profile form', () => {
  render(<ProfileForm />);
  expect(screen.getByText('Create Your Profile')).toBeInTheDocument();
});