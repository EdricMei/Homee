import React, { useEffect, useState, useMemo } from 'react'
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'
import useLocation from '../hooks/useLocation'
import { Posting, UserLocation } from '../types'
import { foodApi } from '../api/foodApi'
import PostCard from '../components/PostCard'
import LocationSearchBar from '../components/LocationSearchBar' // <-- NEW IMPORT
import './Home.css'

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = ['places']
const defaultLocation: UserLocation = { lat: 49.2827, lng: -123.1207 }

const Home: React.FC = () => {
  const { location: initialLocation, isLoading: isLocationLoading, error: locationError } = useLocation()
  
  // State to hold the current location, which can be updated by the search bar
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null)

  const [postings, setPostings] = useState<Posting[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)

  // Use the useLoadScript hook to load the Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  })

  // Use the initial GPS location when the app first loads
  useEffect(() => {
    if (initialLocation && !currentLocation) {
      setCurrentLocation(initialLocation)
    }
  }, [initialLocation, currentLocation])


  const mapCenter = useMemo(() => currentLocation || defaultLocation, [currentLocation])

  const fetchPostings = async (userLocation: UserLocation) => {
    setIsFetching(true)
    setFetchError(null)
    try {
      const data = await foodApi.getPostings(userLocation.lat, userLocation.lng)
      setPostings(data)
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : 'An unknown error occurred')
    } finally {
      setIsFetching(false)
    }
  }
  
  // Fetch postings whenever the location state changes
  useEffect(() => {
    if (currentLocation) {
      fetchPostings(currentLocation)
    }
  }, [currentLocation])

  const handlePlaceSelect = (lat: number, lng: number) => {
    const newLocation = { lat, lng }
    setCurrentLocation(newLocation)
    // Note: fetchPostings will be called via the useEffect above
  }

  if (isLocationLoading) {
    return <div className="loading">🌍 Getting your location...</div>
  }

  if (locationError) {
    // Show location error but proceed with default map center
    console.warn(`Initial location error: ${locationError}`)
  }
  
  if (loadError) {
    return <div className="error-message">❌ Google Maps Load Error: {loadError.message}</div>
  }
  
  // Wait until maps script is loaded before showing the search bar
  if (!isLoaded) {
    return <div className="loading">Loading Map Services...</div>
  }

  return (
    <div className="home-page">
      <h2>Closest Meals to You</h2>
      
      {/* 📍 Location Search Bar */}
      <LocationSearchBar onPlaceSelect={handlePlaceSelect} />
      
      {/* 🗺️ Google Maps Display */}
      <div className="map-container" style={{ height: '350px', width: '100%', marginBottom: '20px' }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={13}
        >
          {currentLocation && <MarkerF position={currentLocation} label="You" />}
          {postings.map((post) => (
            <MarkerF key={post.id} position={post.location} title={post.title} />
          ))}
        </GoogleMap>
      </div>

      {(fetchError || postings.length === 0) && (
        <div className="status-message">
          {fetchError
            ? `Failed to load postings: ${fetchError}`
            : 'No postings found nearby. Try a different location!'}
        </div>
      )}

      <div className="postings-grid">
        {postings.map((post) => (
          <PostCard key={post.id} posting={post} />
        ))}
      </div>
    </div>
  )
}

export default Home