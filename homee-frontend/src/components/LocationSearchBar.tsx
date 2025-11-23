import React, { useRef, useEffect } from 'react'
import { Autocomplete } from '@react-google-maps/api'

interface LocationSearchBarProps {
  onPlaceSelect: (lat: number, lng: number) => void
}

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({ onPlaceSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      const location = place.geometry?.location
      if (location) {
        onPlaceSelect(location.lat(), location.lng())
      } else {
        console.error('No geometry location found for selected place.')
      }
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['geometry', 'name'],
        componentRestrictions: { country: 'ca' },
      })
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect)
    }
    
    return () => {
      // Clean up listener if needed
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [])

  return (
    <div className="search-bar">
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter your location (e.g., street address or city)"
      />
    </div>
  )
}

export default LocationSearchBar