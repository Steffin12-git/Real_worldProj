const bcrypt = require('bcrypt');

const HashingPasswords = async (password) => {
    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);      
        const hashedPassword = await bcrypt.hash(password, salt); 
        return hashedPassword; 

    } catch (err) {
        console.error(err);
        throw new Error('Error in hashing password');
    }
};
 
const decrypt = async (password,hash)=>{

    const result = await bcrypt.compare(password,hash);
    return result

}
module.exports = {
    HashingPasswords,
    decrypt,
};
// // HashingPasswords("passowrd")
// decrypt("Passowrd","$2b$10$gwNm1ODVTeTB0UfFCUNi4.g3qDOOddc/34lT2Jd7BNP2zQKTHwLEO")