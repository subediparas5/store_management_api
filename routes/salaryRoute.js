const router = require('express').Router();
const Salary = require('../models/Salary');
const verify = require('./verifyToken');

router.post('/pay', verify, async (request, response) => {
    const salary = new Salary({
        staff_name: request.body.staff_name,
        staff_phone: request.body.staff_phone,
        paid_amount: request.body.paid_amount,
        cheque_no: request.body.cheque_no,
        month: request.body.month,
        remarks:request.body.remarks
    });
    try {
        const savedSalary = await salary.save();
        response.send({ salary: savedSalary._id });
    }
    catch (err) {
        response.status(400).send(err);
    }
});
module.exports = router;