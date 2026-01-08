const bcrypt = require('bcryptjs');
let hashedPwd;
// const student = {
//     name: 'Amit',
//     roll: 101,
//     // branch: {
//     //     name:'CSE',
//     //     year: 3,
//     //     sem: 5,
//     // },
// }
// console.log(student.roll);
// console.log(student?.branch?.year);
// console.log(student?.branch?.name);
// console.log(student?.branch?.sem);

async function genHashPwd(pwd) {
    const salt = await bcrypt.genSalt(1);
    console.log('salt', salt);
    hashedPwd = await bcrypt.hash(pwd, salt);
    console.log('original pwd', pwd)
    console.log('hashedpwd', hashedPwd)
}

async function comparePwd(pwd) {
    const result = await bcrypt.compare(pwd, hashedPwd);
    console.log('result', result);
}

async function run() {
    const pwd = 'sachin';
    await genHashPwd(pwd);

    await comparePwd(pwd);
}

run();