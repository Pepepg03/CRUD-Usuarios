'use client';

import { useState, useEffect } from 'react';

export default function UsuarioForm({ usuario, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fechanac: '',
    active_user: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Llenar formulario si se está editando
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        fechanac: usuario.fechanac ? new Date(usuario.fechanac).toISOString().split('T')[0] : '',
        active_user: usuario.active_user !== undefined ? usuario.active_user : true
      });
    }
  }, [usuario]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    // Validar fecha de nacimiento
    if (!formData.fechanac) {
      newErrors.fechanac = 'La fecha de nacimiento es obligatoria';
    } else {
      const fechaNac = new Date(formData.fechanac);
      const fechaActual = new Date();
      const fechaMinima = new Date('1900-01-01');
      
      if (fechaNac > fechaActual) {
        newErrors.fechanac = 'La fecha de nacimiento no puede ser futura';
      } else if (fechaNac < fechaMinima) {
        newErrors.fechanac = 'La fecha de nacimiento no puede ser anterior a 1900';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario comience a escribir
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      // Limpiar formulario si es un nuevo usuario
      if (!usuario) {
        setFormData({
          nombre: '',
          apellido: '',
          fechanac: '',
          active_user: true
        });
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (usuario) {
      // Si estamos editando, restaurar datos originales
      setFormData({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        fechanac: usuario.fechanac ? new Date(usuario.fechanac).toISOString().split('T')[0] : '',
        active_user: usuario.active_user !== undefined ? usuario.active_user : true
      });
    } else {
      // Si es nuevo usuario, limpiar formulario
      setFormData({
        nombre: '',
        apellido: '',
        fechanac: '',
        active_user: true
      });
    }
    setErrors({});
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <div className="form-section">
      <h3 className="mb-4">
        <i className={`bi ${usuario ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}></i>
        {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
      </h3>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ingrese el nombre"
              maxLength={100}
              disabled={isFormDisabled}
              required
            />
            {errors.nombre && (
              <div className="invalid-feedback">
                {errors.nombre}
              </div>
            )}
          </div>
          
          <div className="col-md-6 mb-3">
            <label htmlFor="apellido" className="form-label">
              Apellido <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              placeholder="Ingrese el apellido"
              maxLength={100}
              disabled={isFormDisabled}
              required
            />
            {errors.apellido && (
              <div className="invalid-feedback">
                {errors.apellido}
              </div>
            )}
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="fechanac" className="form-label">
              Fecha de Nacimiento <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className={`form-control ${errors.fechanac ? 'is-invalid' : ''}`}
              id="fechanac"
              name="fechanac"
              value={formData.fechanac}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              min="1900-01-01"
              disabled={isFormDisabled}
              required
            />
            {errors.fechanac && (
              <div className="invalid-feedback">
                {errors.fechanac}
              </div>
            )}
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Estado</label>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="active_user"
                name="active_user"
                checked={formData.active_user}
                onChange={handleInputChange}
                disabled={isFormDisabled}
              />
              <label className="form-check-label" htmlFor="active_user">
                Usuario activo
              </label>
            </div>
            <small className="text-muted">
              Los usuarios inactivos no podrán acceder al sistema
            </small>
          </div>
        </div>
        
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isFormDisabled}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {usuario ? 'Actualizando...' : 'Guardando...'}
              </>
            ) : (
              <>
                {usuario ? 'Actualizar Usuario' : 'Crear Usuario'}
              </>
            )}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isFormDisabled}
          >
            Clear
          </button>
          
          {usuario && onCancel && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={isFormDisabled}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}