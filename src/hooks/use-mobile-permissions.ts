"use client"

import { useState, useCallback } from "react"

type PermissionType = 'camera' | 'microphone' | 'notifications' | 'location'

interface PermissionState {
  camera: PermissionStatus | null
  microphone: PermissionStatus | null
  notifications: NotificationPermission | null
  location: PermissionStatus | null
}

interface UseMobilePermissionsReturn {
  permissions: PermissionState
  requestPermission: (type: PermissionType) => Promise<boolean>
  requestVideoCallPermissions: () => Promise<boolean>
  isCapacitor: boolean
}

export function useMobilePermissions(): UseMobilePermissionsReturn {
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: null,
    microphone: null,
    notifications: null,
    location: null,
  })

  const isCapacitor = typeof window !== 'undefined' && !!(window as any).Capacitor

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (isCapacitor) {
      try {
        const { Camera } = await import('@capacitor/camera')
        const result = await Camera.requestPermissions()
        return result.camera === 'granted'
      } catch (e) {
        console.error('Camera permission error:', e)
        return false
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(track => track.stop())
        return true
      } catch (e) {
        return false
      }
    }
  }, [isCapacitor])

  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (e) {
      return false
    }
  }, [])

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (isCapacitor) {
      try {
        const { PushNotifications } = await import('@capacitor/push-notifications')
        const result = await PushNotifications.requestPermissions()
        return result.receive === 'granted'
      } catch (e) {
        console.error('Push notification permission error:', e)
        return false
      }
    } else {
      if ('Notification' in window) {
        const result = await Notification.requestPermission()
        return result === 'granted'
      }
      return false
    }
  }, [isCapacitor])

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    if (isCapacitor) {
      try {
        const { Geolocation } = await import('@capacitor/geolocation')
        const result = await Geolocation.requestPermissions()
        return result.location === 'granted'
      } catch (e) {
        console.error('Location permission error:', e)
        return false
      }
    } else {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false)
        )
      })
    }
  }, [isCapacitor])

  const requestPermission = useCallback(async (type: PermissionType): Promise<boolean> => {
    switch (type) {
      case 'camera':
        return requestCameraPermission()
      case 'microphone':
        return requestMicrophonePermission()
      case 'notifications':
        return requestNotificationPermission()
      case 'location':
        return requestLocationPermission()
      default:
        return false
    }
  }, [requestCameraPermission, requestMicrophonePermission, requestNotificationPermission, requestLocationPermission])

  const requestVideoCallPermissions = useCallback(async (): Promise<boolean> => {
    const cameraGranted = await requestCameraPermission()
    const microphoneGranted = await requestMicrophonePermission()
    return cameraGranted && microphoneGranted
  }, [requestCameraPermission, requestMicrophonePermission])

  return {
    permissions,
    requestPermission,
    requestVideoCallPermissions,
    isCapacitor,
  }
}
