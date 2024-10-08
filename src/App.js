import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PromoHeader from './components/PromoHeader';
import Section from './components/Section';
import CustomNavbar from './components/Navbar';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import loadConfig, { fetchDataFromSheet, getPropFromDriveData } from './utils/config'
import { setMetaTags, dateToUnix } from './utils/imxUtil';
import moment from 'moment'

import './styles/global.css';

function App() {
    const schema = {
        ...defaultSchema,
        tagNames: [...defaultSchema.tagNames, 'iframe'],
        attributes: {
            ...defaultSchema.attributes,
            iframe: [
                'src',
                'width',
                'height',
                'frameborder',
                'allow',
                'allowfullscreen',
            ],
        }
    }

    const [backgrounds, setBackgrounds] = useState([])
    const [sections, setSections] = useState([])
    const [cssLocal, setCssLocal] = useState(null)
    const [navLinks, setNavLinks] = useState([])
    const [brand, setBrand] = useState({ label: "", url: "/" })
    const [showHero, setShowHero] = useState(false)

    const _defaultMetaTags = {
        title: "GS-CMS v.1.0",
        description: "This is a dynamically set meta description.",
        keywords: "dynamic, SEO, meta tags, JavaScript",
        author: "Sad Boi Works",
        canonicalUrl: "https://IMstandup.com",
        ogTitle: "GS-CMS v.1.0",
        ogDescription: "This is a dynamically set meta description for social media.",
        ogUrl: "https://IMstandup.com",
        ogType: "website",
        ogImage: "https://i.imgur.com/ZyTab4O.png",
        twitterCard: "summary_large_image",
        twitterTitle: "GS-CMS v.1.0",
        twitterDescription: "This is a dynamically set meta description for Twitter.",
        twitterImage: "https://i.imgur.com/ZyTab4O.png"
    }

    useEffect(() => {
        const fetchConfig = async () => {
            const config = await loadConfig();
            const data = await fetchDataFromSheet(`${config.G_SHEET}/values/CONFIG!A1:D500?key=${config.API_KEY}`);
            const bgUrls = getPropFromDriveData(data, 'bgPics');

            setBrand({label: getPropFromDriveData(data, 'brandLabel'), url: getPropFromDriveData(data, 'brandUrl')})
            setBackgrounds(bgUrls.split('\n'));
            setShowHero(getPropFromDriveData(data,'showHero') === 'Y')

            setMetaTags(Object.assign({}, _defaultMetaTags, {
                title: config.metaTitle ?? _defaultMetaTags.title,
                description: config.metaDescription ?? _defaultMetaTags.description,
                keywords: config.metaKeywords ?? _defaultMetaTags.keywords,
                canonicalUrl: config.metaCanonicalUrl ?? _defaultMetaTags.canonicalUrl,
                ogTitle: config.metaOgTitle ?? _defaultMetaTags.ogTitle,
                ogDescription: config.metaOgDescription ?? _defaultMetaTags.ogDescription,
                ogUrl: config.metaOgUrl ?? _defaultMetaTags.ogUrl,
                ogType: config.metaOgType ?? _defaultMetaTags.ogType,
                ogImage: config.metaOgImage ?? _defaultMetaTags.ogImage,
                twitterCard: config.metaTwitterCard ?? _defaultMetaTags.twitterCard,
                twitterTitle: config.metaTwitterTitle ?? _defaultMetaTags.twitterTitle,
                twitterDescription: config.metaTwitterDescription ?? _defaultMetaTags.twitterDescription,
                twitterImage: config.metaTwitterImage ?? _defaultMetaTags.twitterImage
            }))
        };

        const fetchSections = async () => {
            const config = await loadConfig();
            const data = await fetchDataFromSheet(`${config.G_SHEET}/values/SECTIONS!A1:E500?key=${config.API_KEY}`);

            const rows = data;
            const headers = rows[0];
            const dataRows = rows.slice(1);
            const thisIsNow = moment().unix()

            setSections(dataRows.map(row => {
                if(row.length != 0) {
                    return {
                        sectionID: row[0],
                        sectionLabel: row[1],
                        showInNav: row[2] === 'Y',
                        sectionContent: row[3],
                        publishDate: dateToUnix(row[4])
                    }
                }
            }).filter(s => s != undefined && s.publishDate <= thisIsNow))
        }

        const fetchCss = async () => {
            const config = await loadConfig()
            const data = await fetchDataFromSheet(`${config.G_SHEET}/values/CSS!A1:A500?key=${config.API_KEY}`)

            // if sheet has CSS set, it takes precedence over 
            // the custom CSS from the file system
            if( data && data[0] && data[0][0]) {
                let cssString = ""

                for(let cssList of data) {
                    if( cssList.length > 0) {
                        cssString += cssList.join('\n')
                    }
                }
                
                let styleElement = document.createElement('style')
                styleElement.type = "text/css"
                styleElement.appendChild(document.createTextNode(cssString))
                document.head.appendChild(styleElement)
            } else {
                const link = document.createElement('link')
                link.rel = 'stylesheet'
                link.href = `css/custom.css?v=${new Date().getTime()}`
                document.head.appendChild(link)
            }
        }

        fetchConfig()
        fetchSections()
        fetchCss()
    }, []);

    useEffect(() => {
        if (backgrounds.length > 0) {
            const randomIndex = Math.floor(Math.random() * backgrounds.length);
            document.body.style.backgroundImage = `url(${backgrounds[randomIndex]}), url(${backgrounds[randomIndex]})`;
        }

        if(sections.length > 0) {
            setNavLinks(sections.map(s => {
                if(s && s.showInNav) {
                    if(s.sectionID.startsWith('#')) {
                        s.sectionID = s.sectionLabel.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + Math.random().toString(36).substring(2, 6)
                    }

                    return s.sectionContent.startsWith('http') ? 
                        { label: s.sectionLabel, url: s.sectionContent } :
                        { label: s.sectionLabel, url: `#${s.sectionID}` }
                }
            }).filter(s => s != undefined))
        }
    }, [backgrounds, sections]);


  return (
    <div className="App">
        <CustomNavbar links={navLinks} brand={brand} />
        
        { showHero && <PromoHeader /> }

        {sections.map((section) => (
            <Section title={section.sectionLabel} id={section.sectionID} key={section.sectionID} hidden={section?.sectionContent?.startsWith('http')}>
                <ReactMarkdown 
                    rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
                    remarkPlugins={[remarkGfm]}>
                        {section.sectionContent}
                </ReactMarkdown>
            </Section>
        ))}


      <footer>
            Made by <strong>Sad Boi Works</strong> with :) & ♥
            <p><a href="./index-static.html">Static Index</a></p>
      </footer>
    </div>
  );
}

export default App;
