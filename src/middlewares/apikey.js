const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    //console.log("api key" + )

    if ( !apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Invalid API key'});
    }

    next();
};

export default verifyApiKey