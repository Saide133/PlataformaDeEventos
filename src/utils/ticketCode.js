import crypto from 'crypto';

export const generateReservationCode = () => {
    return crypto.randomUUID();
};