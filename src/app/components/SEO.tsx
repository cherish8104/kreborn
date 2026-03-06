import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonical?: string;
    lang?: string;
}

export function SEO({
    title = 'koreaname - Get Your Authentic Korean Name Based on Saju',
    description = 'Discover your parallel universe identity. Authentic Korean names and destiny analysis based on Saju astrology.',
    keywords = 'koreaname, Korean name generator, Saju reading, authentic Korean name, K-culture, ชื่อเกาหลี',
    ogTitle,
    ogDescription,
    ogImage = 'https://k-reborn.vercel.app/og-image.jpg',
    canonical = 'https://k-reborn.vercel.app/',
    lang = 'en'
}: SEOProps) {
    return (
        <Helmet>
            <html lang={lang} />
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            <link rel="canonical" href={canonical} />

            {/* Open Graph */}
            <meta property="og:title" content={ogTitle || title} />
            <meta property="og:description" content={ogDescription || description} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:title" content={ogTitle || title} />
            <meta name="twitter:description" content={ogDescription || description} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    );
}
