// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
import config from '../config.js';

// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: config.MP_AccessToken });

export const preference = new Preference(client);

/*
preference.create({
  body: {
    items: [
      {
        title: 'Mi producto',
        quantity: 2,
        unit_price: 2800
      },
      {
        title: 'Mi producto 2',
        quantity: 3,
        unit_price: 100
      }      
    ],
    back_urls: {
        success: "http://localhost:3000/carrito",
        failure: "http://localhost:3000/carrito",
        pending: "http://localhost:3000/carrito"
    },
    auto_return: "approved",    
  }
})
.then(preferences => console.log(preferences.id))    // se puede expresar como .then(console.log)
.catch(error => console.log(error));              // se puede expresar como .catch(console.log);
*/