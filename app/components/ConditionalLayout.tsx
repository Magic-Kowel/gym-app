import MainMenu from './MainMenu';
import Menu from './Menu';
import { cookies } from 'next/headers'; // 🟢 Usamos la API del servidor de Next.js
export const dynamic = 'force-dynamic';
export default async function ConditionalLayout({ children }: { children: React.ReactNode }) {
    // 🟢 Esperamos y leemos la cookie directamente desde el servidor
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    // Si no hay token, muestra el menú público
    if (!token) {
        return (
            <Menu>
                {children}
            </Menu>
        );
    }

    // Si hay token, muestra el menú de usuario autenticado
    return <MainMenu>{children}</MainMenu>;
}