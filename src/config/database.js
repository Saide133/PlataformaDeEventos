import mongoose from 'mongoose';
import dns from 'dns';

if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(','));
}

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Base de datos conectada');
  } catch (error) {
    console.error('Error al conectar MongoDB', error);
  }
};