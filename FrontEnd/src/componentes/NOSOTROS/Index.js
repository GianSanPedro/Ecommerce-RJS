import { useEffect } from 'react'
import './Index.css'

export function Index() {

    useEffect(() => {
        console.log('Componente Index Nosotros (montado)')

        const botonCarrito = document.getElementById('boton-carrito');
        if (botonCarrito) {
            botonCarrito.disabled = false;
        }

        return () => {
            console.log('Componente Index Nosotros (desmontado)')
        }
    },[])

    return (
        <section className="nosotros">
            <div>
                <h1>Nosotros</h1>
            </div>
            <div>
                <img src="./IMG/Somos Velvet.png" alt="Imagen-presentacion-empresa" />
            </div>
            <div className="Presentacion-container">
                <div className="content-container-par">
                    <div className="PresentacionImg">
                        <img src="./IMG/FotoNosotros1.png" alt="Foto cultura empresa 1" />
                    </div>
                    <div className="Presentacion-text">
                        <h2>Lorem ipsum, dolor sit amet consectetur adipisicing.</h2>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam expedita perspiciatis doloribus laborum, voluptatum accusantium velit rem minima nisi dolore at quae inventore ipsum. Dolores labore, reiciendis doloremque totam commodi perspiciatis libero iure accusamus nobis, alias voluptates vitae! Sit incidunt eius culpa, consequuntur molestias deserunt nulla voluptatem officia quod nihil! .</p>
                    </div>
                </div>
                <div className="content-container-impar">
                    <div className="PresentacionImg">
                        <img src="./IMG/FotoNosotros2.png" alt="Foto cultura empresa 2" />
                    </div>
                    <div className="Presentacion-text">
                        <h2>Lorem ipsum, dolor sit amet consectetur adipisicing.</h2>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia itaque velit error aperiam, fugit maxime deserunt sint, ex fugiat ut distinctio obcaecati quis reiciendis enim eos totam id nostrum tenetur labore consequuntur? Blanditiis numquam odit totam qui cumque error ratione, fugiat explicabo laborum, delectus enim! Tempore explicabo ipsum iste laborum reiciendis ipsa veniam eaque obcaecati rem quo pariatur sed consequatur officia enim at atque asperiores ab, impedit mollitia tenetur cupiditate illum cumque. .</p>
                    </div>
                </div>
                <div className="content-container-par">
                    <div className="PresentacionImg">
                        <img src="./IMG/FotoNosotros3.png" alt="Foto cultura empresa 3" />
                    </div>
                    <div className="Presentacion-text">
                        <h2>Lorem ipsum, dolor sit amet consectetur adipisicing.</h2>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam expedita perspiciatis doloribus laborum, voluptatum accusantium velit rem minima nisi dolore at quae inventore ipsum. Dolores labore, reiciendis doloremque totam commodi perspiciatis libero iure accusamus nobis, alias voluptates vitae! Sit incidunt eius culpa, consequuntur molestias deserunt nulla voluptatem officia quod nihil! .</p>
                    </div>
                </div>
                <div className="content-container-impar">
                    <div className="PresentacionImg">
                        <img src="./IMG/FotoNosotros4.png" alt="Foto cultura empresa 4" />
                    </div>
                    <div className="Presentacion-text">
                        <h2>Lorem ipsum, dolor sit amet consectetur adipisicing.</h2>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam expedita perspiciatis doloribus laborum, voluptatum accusantium velit rem minima nisi dolore at quae inventore ipsum. Dolores labore, reiciendis doloremque totam commodi perspiciatis libero iure accusamus nobis, alias voluptates vitae! Sit incidunt eius culpa, consequuntur molestias deserunt nulla voluptatem officia quod nihil! .</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

