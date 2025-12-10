// src/components/DetallePost.jsx

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router";
import { useFetch } from '../hooks/useFetch';

function DetallePost() {
    const [usuario, setUsuario] = useState(null);
    const [eliminando, setEliminando] = useState(false);
    
    const { id: postId } = useParams();
    const navigate = useNavigate();

    // useFetch carga el post.
    const { data: post, loading: cargando, error } = useFetch(`/api/posts/${postId}`);

    // NUEVO: useEffect para cargar el USUARIO cuando el POST se cargue
    useEffect(() => {
        // Asegúrate de que el post exista y que el usuario aún no haya sido cargado
        if (post && post.userId && !usuario) {
            const cargarUsuario = async () => {
                try {
                    // Carga el objeto completo del usuario
                    const respuestaUsuario = await fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`);
                    if (!respuestaUsuario.ok) {
                        throw new Error('Error al cargar el usuario');
                    }
                    const datosUsuario = await respuestaUsuario.json();
                    setUsuario(datosUsuario);
                } catch (err) {
                    console.error('Error al cargar usuario:', err);
                }
            };
            cargarUsuario();
        }
    }, [post]); // Se ejecuta cada vez que 'post' cambia

    // Se mantiene el loading mientras useFetch carga el post, O si el post está cargado pero falta el usuario
    if (cargando || (post && !usuario)) { 
        return (
            <div className="cargando">
                <div className="spinner"></div>
                <p>Cargando detalles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <h2>❌ Error</h2>
                <p>{error}</p>
            </div>
        );
    }
    
    // ... (handleEliminar lógica) ...

    if (!post) {
        return <div className="error">Post no encontrado</div>;
    }

    return (
        <div className="detalle-container">
            <Link to="/" className="boton-volver">← Volver a la lista</Link>

            <div className="detalle-post">
                <h2>{post.title}</h2>
                
                {/* INFORMACIÓN DEL AUTOR (NUEVO BLOQUE) */}
                {usuario && (
                    <div className="user-info-card">
                        <h3>Información del Autor</h3>
                        <p><strong>Nombre:</strong> {usuario.name} ({usuario.username})</p>
                        <p><strong>Email:</strong> <a href={`mailto:${usuario.email}`}>{usuario.email}</a></p>
                        <p><strong>Compañía:</strong> {usuario.company.name}</p>
                    </div>
                )}
                
                <div className="contenido">
                    <p>{post.body}</p>
                </div>

                <div className="acciones">
                    <Link to={`/posts/${postId}/edit`} className="btn-editar">
                        ✏️ Editar
                    </Link>
                    <button 
                        onClick={handleEliminar} 
                        className="btn-eliminar"
                        disabled={eliminando}
                    >
                        {eliminando ? 'Eliminando...' : '🗑️ Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DetallePost;