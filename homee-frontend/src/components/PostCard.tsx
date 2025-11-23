import React from 'react'
import { Posting } from '../types'
import './PostCard.css'

interface PostCardProps {
  posting: Posting
}

const PostCard: React.FC<PostCardProps> = ({ posting }) => {
  return (
    <div className="post-card">
      <img src={posting.imageUrl} alt={posting.title} className="post-image" />
      <div className="post-info">
        <h3>{posting.title}</h3>
        <p className="description">{posting.description}</p>
        <div className="post-footer">
          <span className="price">${posting.price.toFixed(2)}</span>
          <span className="distance">{posting.distance.toFixed(1)} km away</span>
        </div>
        {posting.isVerified && <span className="verified-badge">✅ Verified</span>}
      </div>
    </div>
  )
}

export default PostCard