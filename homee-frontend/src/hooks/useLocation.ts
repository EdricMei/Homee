import { useState, useEffect } from 'react'
import { UserLocation } from '../types'

interface LocationState {
  location: UserLocation | null
  error: string | null
  isLoading: boolean
}

const defaultLocation: UserLocation = { lat: 49.2827, lng: -123.1207 }

const useLocation = (): LocationState => {
  const [state, setState] = useState<LocationState>({
    location: null,
    error: null,
    isLoading: true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: defaultLocation,
        error: 'Geolocation not supported by your browser. Using Vancouver default.',
        isLoading: false,
      })
      return
    }

    const successHandler = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        error: null,
        isLoading: false,
      })
    }

    const errorHandler = (error: GeolocationPositionError) => {
      console.error(error)
      setState({
        location: defaultLocation,
        error: `Could not retrieve location. Using Vancouver default. Error: ${error.message}`,
        isLoading: false,
      })
    }

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler)
  }, [])

  return state
}

export default useLocation