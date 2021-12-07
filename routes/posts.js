const router = require('express').Router();
const User = require('../models/User');
const verify = require('./verifyToken');

router.get('/', verify, (request, response) => {
    response.json({ posts: { title: 'first post', desc: 'it is fun to use node' } });
    // response.send(request.user);
    // User.findById({ _id: request.user });   //used to find the user
});


module.exports = router;