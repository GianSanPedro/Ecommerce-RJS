import React from 'react';
import { screen } from '@testing-library/react';
import { Navbar } from '../componentes/Navbar';
import { renderWithProviders } from '../test-utils';

describe('Navbar', () => {
  test('muestra Alta cuando admin es true', () => {
    renderWithProviders(<Navbar admin={true} login={true} />);
    expect(screen.getByText(/Alta/i)).toBeInTheDocument();
  });

  test('no muestra Alta y si muestra Carrito cuando admin es false', () => {
    renderWithProviders(<Navbar admin={false} login={true} />);
    expect(screen.queryByText(/Alta/i)).toBeNull();
    expect(screen.getByText(/Carrito/i)).toBeInTheDocument();
  });

  test('Chat solo aparece si login es true', () => {
    renderWithProviders(<Navbar admin={false} login={false} />);
    expect(screen.queryByText(/Chat/i)).toBeNull();
  });
});
