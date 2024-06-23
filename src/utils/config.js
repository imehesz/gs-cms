import yaml from 'js-yaml';
import axios from 'axios';

const loadConfig = async () => {
    const response = await fetch('config.yml');
    const text = await response.text();
    const config = yaml.load(text);
    return config;
};

export default loadConfig

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

export { getPropFromDriveData, fetchDataFromSheet };
