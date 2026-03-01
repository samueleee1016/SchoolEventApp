const service = require('../services/service');
const path = require('path');

exports.insering = async (req, res) => {
    const result = await service.insering(req.courseData, req.nRel, req.elencoRelData);
    return res.status(200).sendFile(path.join(__dirname, '../public/successInsering.html'));
};

exports.registration = async (req, res) => {
    const {result1, result2} = await service.registration(req.registrationData);
    return res.status(200).sendFile(path.join(__dirname, '../public/successRegistration.html'));
};