import request from 'supertest'

const baseURL = process.env.TEST_BASE_URL || 'http://localhost:8080'
const api = request(baseURL)

let tokenAdmin = ''
let tokenCliente = ''
let contactoCreado = null
let productoCreado = null

describe('Usuarios', () => {
  test('login admin ok', async () => {
    const res = await api.post('/api/usuarios/login').send({ email: 'admin@test.com', password: 'admin123' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('loginOk')
    expect(res.body.token).toBeTruthy()
    tokenAdmin = res.body.token
  })

  test('login cliente ok', async () => {
    const res = await api.post('/api/usuarios/login').send({ email: 'cliente1@test.com', password: 'cliente123' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('loginOk')
    tokenCliente = res.body.token
  })

  test('login error credenciales', async () => {
    const res = await api.post('/api/usuarios/login').send({ email: 'noexiste@test.com', password: 'bad' })
    expect(res.status).toBe(401)
    expect(res.body.status).toBe('loginError')
  })
})

describe('Productos', () => {
  test('GET productos público', async () => {
    const res = await api.get('/api/productos')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('CRUD producto con admin', async () => {
    const nuevo = {
      nombre: 'Test Producto ' + Date.now(),
      precio: 123.45,
      stock: 9,
      marca: 'TestMarca',
      categoria: 'TestCat',
      detalles: 'Detalles test',
      descripcion: 'Desc test',
      foto: 'http://example.com/test.png',
      envio: true
    }
    const resCreate = await api.post('/api/productos').set('access-token', tokenAdmin).send(nuevo)
    expect(resCreate.status).toBe(200)
    expect(resCreate.body.nombre).toBe(nuevo.nombre)
    productoCreado = resCreate.body

    const resUpdate = await api.put(`/api/productos/${productoCreado.id || productoCreado._id}`).set('access-token', tokenAdmin).send({ stock: 5 })
    expect(resUpdate.status).toBe(200)
    expect(Number(resUpdate.body.stock)).toBe(5)

    const resDelete = await api.delete(`/api/productos/${productoCreado.id || productoCreado._id}`).set('access-token', tokenAdmin)
    expect(resDelete.status).toBe(200)
    expect((resDelete.body.id || resDelete.body._id)).toBe((productoCreado.id || productoCreado._id))
  })

  test('Crear producto sin token debe fallar 401', async () => {
    const res = await api.post('/api/productos').send({ nombre: 'X' })
    expect(res.status).toBe(401)
  })
})

describe('Contacto', () => {
  test('POST contacto público', async () => {
    const res = await api.post('/api/contacto').send({ nombre: 'Tester', email: 'tester@test.com', comentario: 'Mensaje de prueba' })
    expect(res.status).toBe(200)
    contactoCreado = res.body
  })

  test('GET contacto admin', async () => {
    const res = await api.get('/api/contacto').set('access-token', tokenAdmin)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('DELETE contacto admin', async () => {
    const id = contactoCreado?.id || contactoCreado?._id
    const res = await api.delete(`/api/contacto/${id}`).set('access-token', tokenAdmin)
    expect(res.status).toBe(200)
  })
})

describe('Pedidos', () => {
  test('POST pedido con token cliente', async () => {
    const pedido = {
      usuario: { nombre: 'Cliente1', email: 'cliente1@test.com', admin: false },
      compra: { payment_id: 'test', status: 'pending', merchant_order_id: 'test' },
      fyh: new Date().toISOString(),
      carrito: [
        { id: '1', nombre: 'Test', precio: 10, stock: 5, marca: 'X', categoria: 'Y', detalles: 'Z', descripcion: '', foto: 'http://example.com/img.png', envio: true, cantidad: 1 }
      ]
    }
    const res = await api.post('/api/pedidos').set('access-token', tokenCliente || tokenAdmin).send(pedido)
    expect(res.status).toBe(200)
    expect(res.body).toBeTruthy()
  })
})
