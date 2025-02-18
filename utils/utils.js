//===============================================
//
//    utils.js :
//
//          contains helper functions
//
//-----------------------------------------------

// uses Passport.js's isAuthenticated() method
// to confirm user authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/login");
    }
}

// Gets the current time and returns it as a String
async function getCurTimeStr() {

    var currentDateObj = new Date();

    // current hours
    let curHours = currentDateObj.getHours();

    // current minutes
    let curMinutes = currentDateObj.getMinutes();

    return (curHours + ":" + curMinutes);
}

// Gets ETA of patient (expected time of arrival), 
// based on a clinic's wait time
async function getEtaTimeStr(waitTimeHours) {
    var waitTimeMlSeconds = waitTimeHours *60 * 60 * 1000;

    var currentDateObj = new Date();
    var currentMlSeconds = currentDateObj.getTime();

    var newDateObj = new Date(currentMlSeconds + waitTimeMlSeconds);

    // eta hours
    let etaHours = newDateObj.getHours();

    // current minutes
    let etaMinutes = newDateObj.getMinutes();

    return (etaHours + ":" + etaMinutes);
}
async function getClinicWaitingTime(queueLength, approxWait) {

    let minWait = approxWait - approxWait * 0.25;
    let maxWait = approxWait + approxWait * 0.25;      

    return (queueLength * (Math.random(Math.random() * (maxWait - minWait) + minWait))); //The maximum is exclusive and the minimum is inclusive
}

module.exports = {
    ensureAuthenticated,
    getClinicWaitingTime,
    getCurTimeStr,
    getEtaTimeStr
}