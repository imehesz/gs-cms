import React, { useState, useEffect } from 'react';
import { fetchDataFromSheet, getPropFromDriveData } from '../utils/imxUtil';
import loadConfig from '../utils/config';

import "../styles/promo-header.css"

const PromoHeader = () => {
    const [promoBgImg, setPromoBgImg] = useState('https://i.imgur.com/vD0Kur7.jpg')
    const [showTitle, setShowTitle] = useState(false)
    const [headerTitle, setHeaderTitle] = useState('IMRE MEHESZ')
    const [headerSubTitle, setHeaderSubTitle] = useState('Actor // Male Model')
    const [heroMotto, setHeroMotto] = useState('True medicine is laughter.')
    const [heroButtonLabel, setHeroButtonLabel] = useState('Book Now!')
    const [heroButtonUrl, setHeroButtonUrl] = useState('https://www.google.com')

    useEffect(() => {
        const fetchPromoData = async () => {
            const config = await loadConfig()
            const data = await fetchDataFromSheet(`${config.G_SHEET}/values/CONFIG!A1:D500?key=${config.API_KEY}`)
            const bgImg = getPropFromDriveData(data, 'promoBgImg')
            const titleVisible = getPropFromDriveData(data, 'showTitle')

            setPromoBgImg(bgImg || 'https://i.imgur.com/vD0Kur7.jpg')
            setShowTitle(titleVisible)
            setHeaderTitle(getPropFromDriveData(data, 'headerTitle'))
            setHeaderSubTitle(getPropFromDriveData(data, 'headerSubTitle'))
            setHeroMotto(getPropFromDriveData(data, 'heroMotto'))
            setHeroButtonLabel(getPropFromDriveData(data, 'heroButtonLabel'))
            setHeroButtonUrl(getPropFromDriveData(data, 'heroButtonUrl'))
    };

    fetchPromoData();
  }, []);

  return (
    /* <section className="module content" style={{ backgroundImage: `url(${promoBgImg})` }}> */
    <section className="module content promo-header">
      <div className="parallax-container">
        {showTitle && <h1>{headerTitle}</h1>}
        <small>{headerSubTitle}</small>
        <br /><br />
        <p>
            {heroMotto}
            <br /><br />
            <a href={heroButtonUrl} className="btn btn-large">{heroButtonLabel}</a>
            <br /><br />
        </p>
      </div>
    </section>
  );
};

export default PromoHeader;
