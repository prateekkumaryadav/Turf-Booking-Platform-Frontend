import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders the Navbar component via navigation role', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
