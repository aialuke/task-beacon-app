
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Home, Settings, Calendar } from 'lucide-react';
import { SimpleNavbar } from '../simple-navbar';

describe('SimpleNavbar', () => {
  const mockItems = [
    { name: 'Home', value: 'home', icon: Home },
    { name: 'Settings', value: 'settings', icon: Settings },
    { name: 'Calendar', value: 'calendar', icon: Calendar }
  ];

  const mockOnItemChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all navigation items', () => {
    render(
      <SimpleNavbar 
        items={mockItems}
        activeItem="home"
        onItemChange={mockOnItemChange}
      />
    );

    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('highlights active item', () => {
    render(
      <SimpleNavbar 
        items={mockItems}
        activeItem="settings"
        onItemChange={mockOnItemChange}
      />
    );

    const buttons = screen.getAllByRole('button');
    const settingsButton = buttons[1]; // Second button is settings
    
    expect(settingsButton).toHaveClass('text-white');
  });

  it('calls onItemChange when item is clicked', () => {
    render(
      <SimpleNavbar 
        items={mockItems}
        activeItem="home"
        onItemChange={mockOnItemChange}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]); // Click settings button

    expect(mockOnItemChange).toHaveBeenCalledWith('settings');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SimpleNavbar 
        items={mockItems}
        activeItem="home"
        onItemChange={mockOnItemChange}
        className="custom-navbar"
      />
    );

    expect(container.firstChild).toHaveClass('custom-navbar');
  });

  it('renders icons for each item', () => {
    const { container } = render(
      <SimpleNavbar 
        items={mockItems}
        activeItem="home"
        onItemChange={mockOnItemChange}
      />
    );

    // Check that SVG icons are rendered
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(mockItems.length);
  });
});
