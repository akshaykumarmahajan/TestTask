'use strict';

const config = {

    staging: {
        port: 5109,
        db: {
            user: 'C2CMarketplace',
            password: 'C2CMarketplace2018',
            url: 'mongodb://localhost:27017/C2CMarketplace'
        },
        baseUrl: 'http://52.34.207.5:5109/',
        smtp: {
            service: 'Gmail',
            username: 'c2cmarketplace.sdn@gmail.com',
            password: 'Password@aa01',
            host: 'smtp.gmail.com',
            mailUsername: 'C2CMarketplace',
            verificationMail: 'c2cmarketplace.sdn@gmail.com'
        },
        cryptoAlgorithm: 'aes-256-ctr',
        cryptoPassword: 'd6F3Efeq',
        secret: 'C2CMarketplace',
        googleApiKey: 'AIzaSyDzmSSIf0sBm22lbD2KSlGJTtfX_b_lchU',
    },
    local: {
        port: 5109,
        db: {
            user: 'C2CMarketplace',
            password: 'C2CMarketplace2018',
            url: 'mongodb://52.34.207.5:27017/C2CMarketplace'
        },
        baseUrl: 'http://localhost:5109/',
        smtp: {
            service: 'Gmail',
            username: 'c2cmarketplace.sdn@gmail.com',
            password: 'Password@aa01',
            host: 'smtp.gmail.com',
            mailUsername: 'C2CMarketPlace',
            verificationMail: 'c2cmarketplace.sdn@gmail.com'
        },
        cryptoAlgorithm: 'aes-256-ctr',
        cryptoPassword: 'd6F3Efeq',
        secret: 'C2CMarketplace',
        googleApiKey: 'AIzaSyDzmSSIf0sBm22lbD2KSlGJTtfX_b_lchU',
    },

};

module.exports.get = function get(env) {
    return config[env] || config.default;
}