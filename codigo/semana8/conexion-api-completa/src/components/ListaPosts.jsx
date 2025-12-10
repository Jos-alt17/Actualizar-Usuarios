// src/components/ListaPosts.jsx

import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"; // Asegúrate de usar 'react-router-dom' para Link

// ⚠️ NOTA IMPORTANTE: Este componente AHORA recibe los posts y el estado de carga
// como propiedades (props) desde App.jsx, donde se aplica el filtro.

function ListaPosts({ posts: allPostsFromApp, loading: appLoading }) {
  // Mantenemos la lógica de paginación
  const [pagina, setPagina] = useState(1);
  const [postsPagina, setPostsPagina] = useState([]);
  const limite = 4;
  
  // ⚠️ La lógica de useEffect de carga se ELIMINA de aquí.

  // NUEVO useEffect: Se ejecuta cuando la lista filtrada de App.jsx cambia, o cuando cambia la página.
  useEffect(() => {
    // 1. Calcular el inicio y el fin del segmento de posts
    const inicio = (pagina - 1) * limite;
    const fin = inicio + limite;

    // 2. Extraer el segmento de posts del array completo (filtrado)
    const postsParaPagina = allPostsFromApp.slice(inicio, fin);
    setPostsPagina(postsParaPagina);

    // 3. Si la página actual queda vacía (ej. al aplicar un filtro), volvemos a la página 1
    if (postsParaPagina.length === 0 && pagina > 1) {
      setPagina(1);
    }

  }, [allPostsFromApp, pagina, limite]); // Depende de la lista completa y la página

  
  if (appLoading) {
    return (
      <div className="cargando">
        <div className="spinner"></div>
        <p>Cargando posts...</p>
      </div>
    );
  }
  
  // Si la lista completa de posts (filtrados) está vacía y ya terminó la carga.
  if (allPostsFromApp.length === 0) {
    return (
      <div className="no-encontrado">
        <h2>Sin Posts</h2>
        <p>No se encontraron posts con los criterios de filtro seleccionados.</p>
      </div>
    );
  }


  // Calcular el número total de páginas
  const totalPaginas = Math.ceil(allPostsFromApp.length / limite);
  
  return (
    <div>
      <h2>📝 Lista de Posts</h2>
      <div className="posts-grid">
        {/* Mapeamos el array postsPagina */}
        {postsPagina.map(post => (
          <div key={post.id} className="post-card">
            
            <h3>{post.title}</h3>
            <p>{post.body.substring(0, 100)}...</p>
            <Link to={`/posts/${post.id}`} className="post-link">Ver Detalle</Link>
          </div>
        ))}
      </div>
      
      {/* Controles de paginación */}
      <div className="paginacion">
        <button 
          onClick={() => setPagina(p => Math.max(1, p - 1))}
          disabled={pagina === 1}
          className="btn-paginacion"
        >
          ← Anterior
        </button>
        <span className="pagina-actual">Página {pagina} de {totalPaginas}</span>
        <button 
          onClick={() => setPagina(p => p + 1)}
          disabled={pagina >= totalPaginas}
          className="btn-paginacion"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

export default ListaPosts;