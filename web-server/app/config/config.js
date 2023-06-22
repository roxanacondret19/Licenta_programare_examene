module.exports = {
    config: {
        jwtSecretKey: process.env.JWT_SECRET_KEY || "secret",
        mailUser: process.env.MAIL_AUTH_USER || "condretroxana144a@gmail.com",
        mailPass: process.env.MAIL_AUTH_PASS || "bswxciqitrkfejgu",
    }
}
