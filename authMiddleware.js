module.exports = function validateAdmin(req, res, next) {
    const token = req.header('x-auth');
    if (!token || token !== 'admin') {
        return res.status(403).json({ message: 'Acceso no autorizado (se requiere rol admin)' });
    }
    next();
};