import { createClient } from '@/src/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('[v0] OAuth callback error:', error.message)
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
    }

    // Obtener usuario actual
    const user = data.session?.user
    
    if (user) {
      // Verificar si ya tiene perfil
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      // Si no tiene perfil, crear uno con datos de user_metadata
      if (!existingProfile) {
        const metadata = user.user_metadata || {}
        const fullName = metadata.full_name || metadata.name || ''
        const nameParts = fullName.split(' ')
        
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          nombre: nameParts[0] || '',
          apellido: nameParts.slice(1).join(' ') || '',
          foto_url: metadata.avatar_url || metadata.picture || '',
          rol: 'paciente',
        })
      }

      // Obtener rol para redirigir correctamente
      const { data: profile } = await supabase
        .from('profiles')
        .select('rol')
        .eq('id', user.id)
        .single()

      const rol = profile?.rol || 'paciente'
      const redirect = rol === 'admin' ? '/admin' 
        : rol === 'profesional' ? '/dashboard' 
        : '/mi-cuenta'

      return NextResponse.redirect(`${origin}${redirect}`)
    }
  }

  // Si falla, redirigir a login con error
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
