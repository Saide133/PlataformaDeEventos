export const errorHandler = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({ status: 'error', message });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
};