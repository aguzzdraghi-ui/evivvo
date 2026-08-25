import { NextResponse } from "next/server"

// API route to create Daily.co rooms
// Requires DAILY_API_KEY environment variable

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    const apiKey = process.env.DAILY_API_KEY

    // If no API key, return demo mode message
    if (!apiKey || apiKey === "demo" || apiKey.length < 10) {
      return NextResponse.json({
        success: true,
        roomUrl: null,
        roomName: null,
        isDemoMode: true,
        message: "Configura DAILY_API_KEY para habilitar videollamadas reales"
      })
    }

    // Create room via Daily.co API
    const roomName = `evivvo-${sessionId.slice(0, 8)}-${Date.now()}`
    
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "private",
        properties: {
          exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours
          enable_recording: false,
          enable_chat: true,
          enable_screenshare: true,
          max_participants: 2,
          enable_prejoin_ui: false,
          start_video_off: false,
          start_audio_off: false,
          lang: "es",
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error creating Daily.co room")
    }

    const roomData = await response.json()

    return NextResponse.json({
      success: true,
      roomUrl: roomData.url,
      roomName: roomData.name,
      isDemoMode: false,
    })

  } catch (error: any) {
    console.error("[Daily] Error creating room:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Error al crear la sala de video" 
      },
      { status: 500 }
    )
  }
}

// Get room info
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const roomName = searchParams.get("roomName")

  if (!roomName) {
    return NextResponse.json(
      { success: false, error: "roomName is required" },
      { status: 400 }
    )
  }

  const apiKey = process.env.DAILY_API_KEY

  if (!apiKey) {
    return NextResponse.json({
      success: true,
      exists: true,
      isDemoMode: true,
    })
  }

  try {
    const response = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    })

    if (response.status === 404) {
      return NextResponse.json({ success: true, exists: false })
    }

    if (!response.ok) {
      throw new Error("Error checking room")
    }

    const roomData = await response.json()

    return NextResponse.json({
      success: true,
      exists: true,
      roomUrl: roomData.url,
      roomName: roomData.name,
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
