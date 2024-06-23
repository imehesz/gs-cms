import React from 'react'
import '../styles/section.css'

const Section = ({ id, title, children, hidden }) => {
  if (hidden) return null

  return (<section id={id} className="module content">
    <div className="parallax-container">
      <h2>{title}</h2>
      {children}
    </div>
  </section>)
}

export default Section
