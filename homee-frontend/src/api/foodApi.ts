import { PostCreationPayload, Posting } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173/api/v1'

export const foodApi = {
  getPostings: async (lat: number, lng: number): Promise<Posting[]> => {
    const response = await fetch(`${API_BASE_URL}/postings?lat=${lat}&lng=${lng}`)
    if (!response.ok) {
      throw new Error('Failed to fetch postings')
    }
    return response.json()
  },

  createPosting: async (payload: PostCreationPayload): Promise<Posting> => {
    const formData = new FormData()

    formData.append('title', payload.title)
    formData.append('description', payload.description)
    formData.append('price', payload.price.toString())
    formData.append('food_safe_certified', payload.foodSafeCertified.toString())
    formData.append('ingredients', JSON.stringify(payload.ingredients))

    payload.imageFiles.forEach((file) => {
      formData.append('image_files', file)
    })

    if (payload.certificationImage) {
      formData.append('certification_image', payload.certificationImage)
    }

    const response = await fetch(`${API_BASE_URL}/postings/create`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to create posting')
    }

    return response.json()
  },
}