export interface Posting {
    id: string
    title: string
    description: string
    price: number
    imageUrl: string
    distance: number
    location: {
      lat: number
      lng: number
    }
    isVerified: boolean
  }
  
  export interface UserLocation {
    lat: number
    lng: number
  }
  
  export interface PostCreationPayload {
    title: string
    description: string
    ingredients: string[]
    price: number
    foodSafeCertified: boolean
    imageFiles: File[]
    certificationImage: File | null
  }