import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
    plugins: [react()],
    server: {
        port: 15002, // Définir le port ici
        open: false, // (optionnel) Ouvre automatiquement le navigateur
        fs: {
            allow: ['.', '/home/webnunu/paris']
          }
      },
    resolve: {
        extensions: ['.js', '.jsx'], //-> les extensions pour le rendus
    },
});

