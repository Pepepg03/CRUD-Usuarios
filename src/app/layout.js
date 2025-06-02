import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer'; // Componente separado

export const metadata = {
  title: 'CRUD Usuarios - Gestión de Usuarios',
  description: 'Sistema de gestión de usuarios con operaciones CRUD usando Next.js, Prisma y MySQL',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand" href="/">
              <i className="bi bi-people-fill me-2"></i>
              CRUD Usuarios
            </a>
          </div>
        </nav>
        <main className="container mt-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}