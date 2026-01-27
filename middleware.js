import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Routes protégées
  const protectedRoutes = ['/admin'];
  
  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    const token = request.cookies.get('adminToken')?.value;
    
    // Si pas de token, rediriger vers login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    // Optionnel : vérifier le token si vous avez une API
    // Pour l'instant, on accepte simplement s'il y a un token
    // Vous pourrez ajouter la vérification plus tard
  }
  
  return NextResponse.next();
}

// Configurer les routes à protéger
export const config = {
  matcher: ['/admin/:path*'],
};