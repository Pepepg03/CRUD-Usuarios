'use client';

import { useState, useEffect } from 'react';
import UsuarioForm from './components/UsuarioForm';
import UsuarioList from './components/UsuarioList';

export default function HomePage() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');

  // Función para mostrar alertas
  const showAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    
    // Auto-ocultar alerta después de 5 segundos
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000);
  };

  // Función para ocultar alerta manualmente
  const hideAlert = () => {
    setAlertMessage(null);
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Obtener todos los usuarios
  const fetchUsuarios = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/usuarios');
      const result = await response.json();

      if (result.success) {
        setUsuarios(result.data);
      } else {
        showAlert('Error al cargar usuarios: ' + result.error, 'danger');
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      showAlert('Error de conexión al cargar usuarios', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  // Crear nuevo usuario
  const handleCreateUsuario = async (formData) => {
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setUsuarios(prevUsuarios => [result.data, ...prevUsuarios]);
        showAlert(`Usuario ${result.data.nombre} ${result.data.apellido} creado correctamente`, 'success');
      } else {
        showAlert('Error al crear usuario: ' + result.error, 'danger');
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      if (error.message !== 'Error al crear usuario: ' + error.message) {
        showAlert('Error de conexión al crear usuario', 'danger');
      }
      throw error;
    }
  };

  // Actualizar usuario existente
  const handleUpdateUsuario = async (formData) => {
    try {
      const response = await fetch(`/api/usuarios/${usuarioEditar.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setUsuarios(prevUsuarios =>
          prevUsuarios.map(usuario =>
            usuario.id === usuarioEditar.id ? result.data : usuario
          )
        );
        showAlert(`Usuario ${result.data.nombre} ${result.data.apellido} actualizado correctamente`, 'success');
        setUsuarioEditar(null);
      } else {
        showAlert('Error al actualizar usuario: ' + result.error, 'danger');
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      if (error.message !== 'Error al actualizar usuario: ' + error.message) {
        showAlert('Error de conexión al actualizar usuario', 'danger');
      }
      throw error;
    }
  };

  // Eliminar usuario
  const handleDeleteUsuario = async (id) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        const usuarioEliminado = usuarios.find(u => u.id === id);
        setUsuarios(prevUsuarios => prevUsuarios.filter(usuario => usuario.id !== id));
        showAlert(
          `Usuario ${usuarioEliminado?.nombre} ${usuarioEliminado?.apellido} eliminado correctamente`, 
          'success'
        );
        
        // Si estamos editando el usuario que se eliminó, cancelar edición
        if (usuarioEditar && usuarioEditar.id === id) {
          setUsuarioEditar(null);
        }
      } else {
        showAlert('Error al eliminar usuario: ' + result.error, 'danger');
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      if (error.message !== 'Error al eliminar usuario: ' + error.message) {
        showAlert('Error de conexión al eliminar usuario', 'danger');
      }
      throw error;
    }
  };

  // Manejar edición de usuario
  const handleEditUsuario = (usuario) => {
    setUsuarioEditar(usuario);
    
    // Scroll al formulario
    document.querySelector('.form-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setUsuarioEditar(null);
  };

  // Manejar envío del formulario (crear o actualizar)
  const handleFormSubmit = async (formData) => {
    if (usuarioEditar) {
      await handleUpdateUsuario(formData);
    } else {
      await handleCreateUsuario(formData);
    }
  };

  return (
    <div>
      {/* Alerta de notificaciones */}
      {alertMessage && (
        <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
          <i className={`bi ${alertType === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
          {alertMessage}
          <button
            type="button"
            className="btn-close"
            onClick={hideAlert}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Título principal */}
      <div className="mb-4">
        <h1 className="display-4 text-center mb-2">
          <i className="bi bi-people-fill text-primary me-3"></i>
          Sistema de Gestión de Usuarios
        </h1>
      </div>

      {/* Formulario de usuario */}
      <UsuarioForm
        usuario={usuarioEditar}
        onSubmit={handleFormSubmit}
        onCancel={usuarioEditar ? handleCancelEdit : undefined}
        isLoading={isLoading}
      />

      {/* Lista de usuarios */}
      <UsuarioList
        usuarios={usuarios}
        onEdit={handleEditUsuario}
        onDelete={handleDeleteUsuario}
        isLoading={isLoading}
      />
    </div>
  );
}