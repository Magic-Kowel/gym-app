import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Importamos jose para validar JWTs en Edge Runtime

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas permitidas
  if (pathname === '/' || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // Si ni siquiera existe el token, fuera
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // 🔑 AQUí VALIDAMOS EL TOKEN REALMENTE:
    // Reemplaza 'tu-secreto-super-seguro' por la misma clave secreta (Secret) 
    // que usas en tu backend para firmar los tokens (idealmente guárdala en process.env.JWT_SECRET)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '123456789');
    
    // jwtVerify lanzará un error automático si el token expiró o es falso
    const verify = await jwtVerify(token, secret);
    console.log(verify);
    
    // Si la verificación es exitosa, dejamos pasar al usuario
    return NextResponse.next();

  } catch (error) {
    // Si el token es falso, fue modificado o ya expiró, cae aquí:
    console.log("Token inválido o expirado:", error);
    
    // Opcional: Borramos la cookie corrupta/expirada redirigiendo y limpiando
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('token');
    return response;
  }
}