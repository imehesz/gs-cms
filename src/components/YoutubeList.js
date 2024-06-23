import React, { useState, useEffect } from 'react';
import { fetchDataFromSheet, getPropFromDriveData } from '../utils/imxUtil';
import YoutubeWrapper from './YoutubeWrapper';
import loadConfig from '../utils/config';

import "../styles/youtube-list.css"

const YoutubeList = () => {
  const [ytIds, setYtIds] = useState([]);

  useEffect(() => {
    const fetchYoutubeData = async () => {
      const config = await loadConfig();
      const data = await fetchDataFromSheet(`${config.G_SHEET}/values/CONFIG!A1:D500?key=${config.API_KEY}`);
      const ytVids = getPropFromDriveData(data, 'ytVids');
      setYtIds(ytVids.split(','));
    };

    fetchYoutubeData();
  }, []);

  return (
    <div class="media-list">
      {ytIds.map((ytId, index) => (
        <YoutubeWrapper key={index} ytId={ytId} />
      ))}
    </div>
  );
};

export default YoutubeList;
