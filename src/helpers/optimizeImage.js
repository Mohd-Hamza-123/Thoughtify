
const toOptimizedImage = (url, { w, h, q }) => {

    if (!url) return "";

    const viewUrl = url.replace("/preview", "/view");
    const params = new URLSearchParams({
        url: viewUrl, // URLSearchParams encodes this for you
        w,
        h,
        output: "webp",
        q,
    });

    return `https://images.weserv.nl/?${params}`;
}

export default toOptimizedImage;