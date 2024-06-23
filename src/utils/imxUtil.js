import axios from 'axios';

const getPropFromDriveData = (data, prop) => {
  let retval;

  for (let i = 0; i < data.length; i++) {
    let [key, val] = data[i];

    if (key === prop) {
      retval = val;
      break;
    }
  }

  return retval;
};

const fetchDataFromSheet = async (url) => {
  const response = await axios.get(url);
  return response.data.values;
};


const setMetaTags = ({ title, description, keywords, author, canonicalUrl, ogTitle, ogDescription, ogUrl, ogType, ogImage, twitterCard, twitterTitle, twitterDescription, twitterImage }) => {
    // Set document title
    document.title = title;

    // Function to set a meta tag
    function setMetaTag(name, content) {
        let metaTag = document.querySelector(`meta[name="${name}"]`);
        if (metaTag) {
            metaTag.setAttribute('content', content);
        } else {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('name', name);
            metaTag.setAttribute('content', content);
            document.head.appendChild(metaTag);
        }
    }

    // Function to set a property meta tag (Open Graph, Twitter, etc.)
    function setPropertyMetaTag(property, content) {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (metaTag) {
            metaTag.setAttribute('content', content);
        } else {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('property', property);
            metaTag.setAttribute('content', content);
            document.head.appendChild(metaTag);
        }
    }

    // Set standard meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', author);

    // Set canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
    } else {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', canonicalUrl);
        document.head.appendChild(canonicalLink);
    }

    // Set Open Graph meta tags
    setPropertyMetaTag('og:title', ogTitle);
    setPropertyMetaTag('og:description', ogDescription);
    setPropertyMetaTag('og:url', ogUrl);
    setPropertyMetaTag('og:type', ogType);
    setPropertyMetaTag('og:image', ogImage);

    // Set Twitter card meta tags
    setPropertyMetaTag('twitter:card', twitterCard);
    setPropertyMetaTag('twitter:title', twitterTitle);
    setPropertyMetaTag('twitter:description', twitterDescription);
    setPropertyMetaTag('twitter:image', twitterImage);
}

export { getPropFromDriveData, fetchDataFromSheet, setMetaTags };
