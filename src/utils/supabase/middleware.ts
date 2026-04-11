import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    // Busca o usuário logado de forma segura
    const { data } = await supabase.auth.getUser()
    const user = data?.user

    const pathname = request.nextUrl.pathname
    const isProtectedPath = pathname.startsWith('/admin') || 
                            pathname.startsWith('/management') || 
                            pathname.startsWith('/workspace') || 
                            pathname.startsWith('/dashboard')

    // 1. Redirecionamento se não estiver logado
    if (isProtectedPath && !user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (user) {
      // 2. Tenta buscar a role no banco (failsafe)
      let role = 'individual_user'
      try {
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()
        
        if (!fetchError && profile?.role) {
          role = profile.role
        }
      } catch (err) {
        // Se houver erro de RLS ou Coerção, usamos a role padrão
        console.error('Middleware: Database fetch issue. Using default role.', err)
      }

      // 3. Lógica de isolamento de rotas
      if (isProtectedPath) {
        if (role === 'super_admin' && !pathname.startsWith('/admin')) {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        if (role === 'company_admin' && !pathname.startsWith('/management')) {
          return NextResponse.redirect(new URL('/management', request.url))
        }
        if (role === 'employee' && !pathname.startsWith('/workspace')) {
          return NextResponse.redirect(new URL('/workspace', request.url))
        }
        if (role === 'individual_user' && !pathname.startsWith('/dashboard')) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }

      // 4. Redireciona logados na Home para seu dashboard
      if (pathname === '/') {
        let dest = '/dashboard'
        if (role === 'super_admin') dest = '/admin'
        else if (role === 'company_admin') dest = '/management'
        else if (role === 'employee') dest = '/workspace'
        
        return NextResponse.redirect(new URL(dest, request.url))
      }
    }
  } catch (globalError) {
    console.error('CRITICAL: Middleware Global Exception.', globalError)
  }

  return supabaseResponse
}
