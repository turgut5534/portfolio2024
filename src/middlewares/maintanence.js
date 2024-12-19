const Setting = require('../models/Settings')

const maintanence = async (req,res,next) => {

    try {
        
        const setting = await Setting.findOne()

        if(setting.maintanence_enabled == 1) {
            return res.render('maintanence')
        }

    }catch(e) {
        console.log(e)
        res.redirect('/maintanence')
    }

    next()

}

module.exports = maintanence