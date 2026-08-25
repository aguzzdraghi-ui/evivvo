"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { createClient } from "@/src/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export type UserRole = "paciente" | "profesional" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  isPlus?: boolean
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; redirect?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Obtener sesion inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user)
        loadUserProfile(session.user)
      } else {
        setIsLoading(false)
      }
    })

    // Escuchar cambios de autenticacion
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user)
          await loadUserProfile(session.user)
        } else {
          setUser(null)
          setSupabaseUser(null)
          setIsLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserProfile(supabaseUser: SupabaseUser) {
    const supabase = createClient()
    try {
      // Buscar perfil en tabla profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      const role: UserRole = profile?.rol || 'paciente'
      
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: profile?.nombre 
          ? `${profile.nombre} ${profile.apellido || ''}`.trim()
          : supabaseUser.user_metadata?.nombre 
            || supabaseUser.user_metadata?.full_name 
            || supabaseUser.email?.split('@')[0] 
            || 'Usuario',
        role,
        avatar: profile?.foto_url,
        isPlus: profile?.is_plus || false,
      })
    } catch {
      // Si no hay perfil, crear usuario basico
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.nombre 
          || supabaseUser.user_metadata?.full_name 
          || supabaseUser.email?.split('@')[0] 
          || 'Usuario',
        role: 'paciente',
      })
    }
    setIsLoading(false)
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; redirect?: string }> => {
    const supabase = createClient()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { 
          success: false, 
          error: error.message === "Invalid login credentials" 
            ? "Email o contrasena incorrectos" 
            : error.message 
        }
      }

      if (data.user) {
        // Cargar perfil para determinar redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('rol')
          .eq('id', data.user.id)
          .single()

        const role = profile?.rol || 'paciente'
        const redirect = role === 'admin' ? '/admin' 
          : role === 'profesional' ? '/dashboard' 
          : '/mi-cuenta'

        return { success: true, redirect }
      }

      return { success: false, error: "Error al iniciar sesion" }
    } catch {
      return { success: false, error: "Error de conexion" }
    }
  }

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, supabaseUser, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
