'use client';

import { useState, useEffect } from 'react';

export default function UsuarioList({ usuarios, onEdit, onDelete, isLoading }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deletingId, setDeletingId] = useState(null);
  const [currentDate, setCurrentDate] = useState(null); // ← NUEVO: Fecha actual del cliente
  const [isClient, setIsClient] = useState(false); // ← NUEVO: Bandera de cliente

  // ← NUEVO: Establecer fecha actual solo en el cliente
  useEffect(() => {
    setCurrentDate(new Date());
    setIsClient(true);
  }, []);

  // Filtrar y ordenar usuarios
  const filteredAndSortedUsuarios = usuarios
    .filter(usuario => {
      if (filter === 'active' && !usuario.active_user) return false;
      if (filter === 'inactive' && usuario.active_user) return false;
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          usuario.nombre.toLowerCase().includes(searchLower) ||
          usuario.apellido.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'nombre':
        case 'apellido':
          aValue = a[sortBy].toLowerCase();
          bValue = b[sortBy].toLowerCase();
          break;
        case 'fechanac':
        case 'id':
          aValue = new Date(a[sortBy]);
          bValue = new Date(b[sortBy]);
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleDelete = async (usuario) => {
    // ← MEJORADO: Verificar que estamos en el cliente
    if (typeof window === 'undefined') return;
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar al usuario ${usuario.nombre} ${usuario.apellido}?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmDelete) {
      setDeletingId(usuario.id);
      try {
        await onDelete(usuario.id);
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // ← MEJORADO: Formateo de fecha más consistente
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      // Usar toLocaleDateString con configuración específica
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // ← CORREGIDO: Calcular edad solo cuando tenemos la fecha actual del cliente
  const calculateAge = (dateString) => {
    if (!currentDate) return '...'; // Mostrar placeholder mientras carga
    
    try {
      const birthDate = new Date(dateString);
      let age = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = currentDate.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando usuarios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>
          <i className="bi bi-people me-2"></i>
          Lista de Usuarios ({filteredAndSortedUsuarios.length})
        </h3>
      </div>

      {/* Controles de filtrado y búsqueda */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <label htmlFor="search" className="form-label">Buscar usuarios</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="search"
              placeholder="Buscar por nombre o apellido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="col-md-3 mb-2">
          <label htmlFor="filter" className="form-label">Filtrar por estado</label>
          <select
            className="form-select"
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos los usuarios</option>
            <option value="active">Solo activos</option>
            <option value="inactive">Solo inactivos</option>
          </select>
        </div>
        
        <div className="col-md-3 mb-2">
          <label htmlFor="sortBy" className="form-label">Ordenar por</label>
          <select
            className="form-select"
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">Fecha de creación</option>
            <option value="nombre">Nombre</option>
            <option value="apellido">Apellido</option>
            <option value="fechanac">Fecha de nacimiento</option>
          </select>
        </div>
        
        <div className="col-md-2 mb-2">
          <label htmlFor="sortOrder" className="form-label">Orden</label>
          <select
            className="form-select"
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      </div>

      {/* Lista de usuarios */}
      {filteredAndSortedUsuarios.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-person-x display-1 text-muted"></i>
          <h5 className="text-muted mt-3">
            {usuarios.length === 0 
              ? 'No hay usuarios registrados' 
              : 'No se encontraron usuarios con los criterios de búsqueda'
            }
          </h5>
          {searchTerm && (
            <button 
              className="btn btn-outline-primary mt-2"
              onClick={() => setSearchTerm('')}
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="row">
          {filteredAndSortedUsuarios.map((usuario) => (
            <div key={usuario.id} className="col-lg-6 col-xl-4 mb-3">
              <div className={`card user-card h-100 ${!usuario.active_user ? 'inactive' : ''}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">
                      {usuario.nombre} {usuario.apellido}
                    </h5>
                    <span className={`badge ${usuario.active_user ? 'badge-active' : 'badge-inactive'}`}>
                      <i className={`bi ${usuario.active_user ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                      {usuario.active_user ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  
                  <div className="card-text">
                    <div className="mb-2">
                      <small className="text-muted">
                        <i className="bi bi-calendar3 me-1"></i>
                        Nacimiento: {formatDate(usuario.fechanac)}
                      </small>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">
                        <i className="bi bi-person-badge me-1"></i>
                        Edad: {/* ← MEJORADO: Mostrar placeholder mientras carga */}
                        {isClient ? `${calculateAge(usuario.fechanac)} años` : 'Calculando...'}
                      </small>
                    </div>
                  </div>
                  
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => onEdit(usuario)}
                      disabled={deletingId === usuario.id}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(usuario)}
                      disabled={deletingId === usuario.id}
                    >
                      {deletingId === usuario.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-trash me-1"></i>
                          Eliminar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}