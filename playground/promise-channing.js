require('../src/db/mongoose');
const User = require('../src/models/user');

// 5cfbe613001a8ec0ffe8bd34

// User.findByIdAndUpdate('5cfbe613001a8ec0ffe8bd34', { age: 1 }).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// }) 

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
};

updateAgeAndCount('5cfbf111ff8625c377e305a7', 2).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})