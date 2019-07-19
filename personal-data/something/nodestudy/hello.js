'use strict';
var s = 'Hello';
function getting(name){
    console.log(`${s}, ${name}!`);
}

function getName(age){
    console.log(`age: ${age}`)
}

module.exports.getting = getting;
module.exports.getName = getName;