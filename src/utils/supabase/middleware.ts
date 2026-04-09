import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isProtectedPath = pathname.startsWith('/admin') || 
                          pathname.startsWith('/management') || 
                          pathname.startsWith('/workspace') || 
                          pathname.startsWith('/bioflow')

  // Redireciona para a raiz se tentar acessar área protegida sem logar
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (user) {
    // Busca a Role no banco
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'individual_user'

    // Lógica de Isolamento por Role
    if (isProtectedPath && role !== 'super_admin') {
      if (role === 'individual_user' && !pathname.startsWith('/bioflow')) {
        const url = request.nextUrl.clone()
        url.pathname = '/bioflow'
        return NextResponse.redirect(url)
      }
      if (role === 'employee' && !pathname.startsWith('/workspace')) {
        const url = request.nextUrl.clone()
        url.pathname = '/workspace'
        return NextResponse.redirect(url)
      }
      if (role === 'company_admin' && !pathname.startsWith('/management')) {
        const url = request.nextUrl.clone()
        url.pathname = '/management'
        return NextResponse.redirect(url)
      }
    }

    // Se estiver logado e na home page, envia para seu respectivo dashboard
    if (pathname === '/') {
      const url = request.nextUrl.clone()
      if (role === 'individual_user') url.pathname = '/bioflow'
      else if (role === 'employee') url.pathname = '/workspace'
      else if (role === 'company_admin') url.pathname = '/management'
      else if (role === 'super_admin') url.pathname = '/admin'
      
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
