import { useEffect, useState } from "react"

export function Index(props) {
    const { setFiltroBusqueda } = props

    // Busqueda
    const [valor, setValor] = useState('')

    // Estado para el placeholder
    const [placeholder, setPlaceholder] = useState(''); 

    useEffect(() => {
        setFiltroBusqueda(valor);

        // Actualiza el placeholder en función del tamaño de la pantalla
        const updatePlaceholder = () => {
            if (window.innerWidth <= 600) {
                setPlaceholder('Búsqueda');
            } else {
                setPlaceholder('');
            }
        };

        // Llama a la función una vez para establecer el estado inicial
        updatePlaceholder(); 

        // Añade el manejador de eventos de redimensionamiento
        window.addEventListener('resize', updatePlaceholder); 

        // Limpia el evento cuando el componente se desmonta
        return () => {
            window.removeEventListener('resize', updatePlaceholder);
        };
    },[valor,setFiltroBusqueda])

    function onSubmit(e) {
        e.preventDefault()
        setFiltroBusqueda(valor)
    }

    return (
        <div id="Barra-busqueda">
            <form action="#" onSubmit={onSubmit}>
                {/* <label className="responsive-hidden" >Búsqueda</label> */}
                <input type="text" value={valor} onChange={ e => setValor(e.target.value) } placeholder={placeholder} />
                <input className="responsive-hidden" type="submit" value="" />
            </form>
        </div>
    )
}
