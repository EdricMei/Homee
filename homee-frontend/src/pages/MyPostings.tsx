import React, { useState } from 'react'
import { foodApi } from '../api/foodApi'
import { PostCreationPayload } from '../types'
import './MyPostings.css'

const initialPayload: PostCreationPayload = {
  title: '',
  description: '',
  ingredients: [],
  price: 0,
  foodSafeCertified: false,
  imageFiles: [],
  certificationImage: null,
}

const MyPostings: React.FC = () => {
  const [formData, setFormData] = useState<PostCreationPayload>(initialPayload)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setFormData({ ...formData, [name]: e.target.checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.name === 'imageFiles') {
        setFormData({ ...formData, imageFiles: Array.from(e.target.files) })
      } else if (e.target.name === 'certificationImage') {
        setFormData({ ...formData, certificationImage: e.target.files[0] || null })
      }
    }
  }

  const handleIngredientsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const ingredientList = e.target.value.split('\n').filter((i) => i.trim() !== '')
    setFormData({ ...formData, ingredients: ingredientList })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsSubmitting(true)

    if (formData.imageFiles.length === 0) {
      setMessage('Please upload at least one picture of the food and ingredients.')
      setIsSubmitting(false)
      return
    }

    if (!formData.foodSafeCertified && !formData.certificationImage) {
      setMessage('Please confirm food safety certification or upload proof.')
      setIsSubmitting(false)
      return
    }

    try {
      await foodApi.createPosting(formData)
      setMessage('✅ Posting created successfully and sent for verification!')
      setFormData(initialPayload)
    } catch (error) {
      setMessage(`❌ Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="my-postings-page">
      <h2>Create New Meal Posting</h2>
      {message && <div className={`form-message ${message.startsWith('❌') ? 'error' : 'success'}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="posting-form">
        <label>
          Meal Title:
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </label>

        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>

        <label>
          Price ($):
          <input
            type="number"
            name="price"
            min="0.01"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>

        <h3>Verification & Safety 🛡️</h3>
        <p className="verification-note">
          To ensure quality and safety, all postings require verification.
        </p>

        <label>
          Ingredients (One per line):
          <textarea
            name="ingredients"
            placeholder="e.g.
Flour
Sugar
Eggs
..."
            onChange={handleIngredientsChange}
            required
          />
        </label>

        <label className="file-upload">
          Pictures of Food & Ingredients (for LLM verification):
          <input type="file" name="imageFiles" onChange={handleFileChange} multiple accept="image/*" required />
          <p className="file-info">Upload pictures of the final meal AND the raw ingredients listed above.</p>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="foodSafeCertified"
            checked={formData.foodSafeCertified}
            onChange={handleChange}
          />
          I confirm I hold a relevant food safety certification (e.g., FoodSafe 1 in BC).
        </label>

        {!formData.foodSafeCertified && (
          <label className="file-upload">
            Upload Certification Proof (Optional if you checked the box):
            <input
              type="file"
              name="certificationImage"
              onChange={handleFileChange}
              accept="image/*, application/pdf"
            />
          </label>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}

export default MyPostings