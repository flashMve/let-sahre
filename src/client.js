import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';


export const client = sanityClient({
    projectId:process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset:'production',
    useCdn:true,
    apiVersion:'2021-03-25',
    ignoreBrowserTokenWarning: true,
    token:process.env.REACT_APP_SANITY_TOKEN
});

export const urlFor = (source) => {
    return imageUrlBuilder(client).image(source);
}

