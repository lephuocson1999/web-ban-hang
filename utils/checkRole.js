const { sign, verify } = require('../utils/jwt')
module.exports = async function (req, res, next) {
    // let token = req.cookies['token'];
    let { token } = req.session;
    if (!token)
        return res.redirect('/users/dang-nhap');
    let checkRole = await verify(token);
    if (checkRole.data.role !== 0 )
        return res.redirect('/');
    next();
}