const jwt = require('jsonwebtoken');

const JWT_TOKEN = 'sarangtawon123';

// {HEADER:ALGORITHM & TOKEN TYPE} {PAYLOAD:DATA} {VERIFY SIGNATURE}

// create basic token with synchronous process
const token = jwt.sign({ name: 'sarang' }, JWT_TOKEN);
console.log(token);

// async - create token
jwt.sign({ data: {kelas: 'microservice'}}, JWT_TOKEN, (err, token) => {
    console.log(token);
});

console.log('aaaaaa');


// Expired / kadaluarsa synchronous
const token2 = jwt.sign({ name: 'sarang' }, JWT_TOKEN, {expiresIn: 3600}); //({expiresIn: "1h"})
console.log(token2);

// expired / async
jwt.sign({ data: {kelas: 'microservice'}}, JWT_TOKEN, {expiresIn: '1m'}, (err, token) => {
    console.log(token);
});

// verified
const token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImtlbGFzIjoibWljcm9zZXJ2aWNlIn0sImlhdCI6MTcyNzAyNjM2NywiZXhwIjoxNzI3MDI2NDI3fQ.uCvsd_XBDlppVO-qvlr0x4GwgAC-sFoDaUOgX-bN02k';

// cara1

jwt.verify(token1, JWT_TOKEN, (err, decoded) => {
    if(err){
        console.log(err.message);
        return;
    }
    console.log(decoded);
});

 /* cara 2 */
try{
    const decoded = jwt.verify(token1, JWT_TOKEN);
    console.log(decoded)
} catch (error) {
    console.log(error.message);
}