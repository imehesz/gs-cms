import React from 'react';

const YoutubeWrapper = ({ ytId }) => (
  <iframe
    width="480"
    height="315"
    src={`https://www.youtube.com/embed/${ytId}`}
    frameBorder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
);

export default YoutubeWrapper;
