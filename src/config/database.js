import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Base de datos conectada');
  } catch (error) {
    console.error('Error al conectar MongoDB', error);
  }
};