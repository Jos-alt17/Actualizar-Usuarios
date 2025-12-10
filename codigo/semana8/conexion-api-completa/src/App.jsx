// src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import ListaPosts from './components/ListaPosts';
import DetallePost from './components/DetallePost';
import FormularioPost from './components/FormularioPost'; // Asumido
import ListaUsuarios from './components/ListaUsuarios'; // Asumido
import DetalleUsuario from './components/DetalleUsuario'; // Asumido

function App() {
    // 1. ESTADOS PARA DATOS Y FILTRO
    const [allPosts, setAllPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [loading, setLoading] = useState(true); // <-- NUEVO: Estado de carga

    // 2. CARGA DE DATOS
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Se utiliza Promise.all para cargar Posts y Usuarios concurrentemente
                const [postsRes, usersRes] = await Promise.all([
                    fetch('https://jsonplaceholder.typicode.com/posts'),
                    fetch('https://jsonplaceholder.typicode.com/users')
                ]);

                const postsData = await postsRes.json();
                const usersData = await usersRes.json();
                
                setAllPosts(postsData);
                setUsers(usersData);

            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
                // Aquí podrías agregar un estado para manejar errores si lo necesitas.
            } finally {
                setLoading(false); // La carga finaliza después de ambas peticiones
            }
        };
        fetchAllData();
    }, []);

    // 3. LÓGICA DE FILTRADO
    const filteredPosts = allPosts.filter(post => {
        if (!selectedUserId) {
            return true; // Si no hay filtro, mostrar todos
        }
        // Compara el userId del post (número) con el valor del select (string)
        return post.userId.toString() === selectedUserId;
    });

    return (
        <div className="App">
            <header>
                <h1>App de Posts</h1>
                <p>Aplicación para visualizar posts y sus detalles</p>

                {/* Navegación principal */}
                <nav className="menu-principal">
                    <Link to="/">Posts</Link>
                    <Link to="/usuarios">Usuarios</Link>
                </nav>
            </header>

            <main>
                <p>[x] Paso 1: Instalar React Router</p>
                <p>[x] Paso 2: Crear componentes ListaPosts y DetallePost</p>
                <p>[x] Paso 3: Configurar rutas</p>
                <p>[x] Paso 4: Implementar consumo de API</p>
                <p>[x] Paso 5: Agregar paginación</p>
                <p>[x] Paso 6: Implementar edición (PUT) y eliminación (DELETE)</p>
                <Link to="/posts/new">Crear Nuevo Post</Link>
                
                {/* 4. CONTENEDOR DEL FILTRO */}
                <div className="filter-container">
                    <label htmlFor="user-select">Filtrar Publicaciones por Autor:</label>
                    {loading ? (
                        <span>Cargando usuarios...</span>
                    ) : (
                        <select
                            id="user-select"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            disabled={loading} // Deshabilita mientras carga
                        >
                            <option value="">-- Todos los Autores --</option>
                            {/* Mapear usuarios cargados */}
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                {/* FIN DEL FILTRO */}

                <Routes>
                    {/* 5. MODIFICACIÓN DE LA RUTA: PASAR LOS DATOS FILTRADOS Y EL ESTADO DE CARGA */}
                    <Route 
                        path="/" 
                        element={<ListaPosts posts={filteredPosts} loading={loading} />} 
                    />
                    <Route path="/posts/:id" element={<DetallePost />} />
                    <Route path="/posts/new" element={<FormularioPost />} />
                    <Route path="/posts/:id/edit" element={<FormularioPost />} />

                    {/* Rutas para usuarios */}
                    <Route path="/usuarios" element={<ListaUsuarios />} />
                    <Route path="/usuarios/:id" element={<DetalleUsuario />} />
                </Routes> {/* <--- CIERRE DE ROUTES AÑADIDO */}

            </main> {/* <--- CIERRE DE MAIN AÑADIDO */}
        </div> // <--- CIERRE DE DIV.APP AÑADIDO
    ) // <--- CIERRE DE PARENTESIS DE RETURN AÑADIDO
} // <--- CIERRE DE LA FUNCIÓN APP AÑADIDO

export default App;