const config = {
    imageFolder: './src/statics',
    database: {
        url: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cv8je.mongodb.net/social?retryWrites=true&w=majority`,
    },
    jwt: {
        secret:"3737eee28282",
    },
    hostname: 'https://ss-vf.herokuapp.com/'
}


module.exports = config