import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { Index as Inicio } from '../componentes/INICIO/Index';

jest.mock('../servicios/productos', () => ({
  getAll: jest.fn()
}));
import { getAll } from '../servicios/productos';

describe('Inicio', () => {
  beforeEach(() => {
    getAll.mockReset();
  });

  test('renderiza productos obtenidos del servicio', async () => {
    getAll.mockResolvedValue([
      {
        id: '1',
        nombre: 'Producto Test',
        precio: 10,
        stock: 5,
        marca: 'Marca',
        categoria: 'Categoria',
        detalles: 'Detalles',
        descripcion: '',
        foto: 'http://example.com/img.png',
        envio: true,
      },
    ]);

    renderWithProviders(<Inicio filtro="" esAdmin={false} />);

    expect(await screen.findByText(/Producto Test/i)).toBeInTheDocument();
    expect(await screen.findByText(/Precio:/i)).toBeInTheDocument();
  });
});
