
var seed = function(User){
    User.find(function(err,users) {
        if(users.length) return;

        new User({
            userName:'user_1',
            passWord:'test_1',
            isAdmin:false,
            messages:[{message:'user1 first message',timeStamp:12345566123123}]
        }).save();

        new User({
            userName:'user_2',
            passWord:'test_2',
            isAdmin:false,
            messages:[{message:'user2 first message',timeStamp:69845621654654654}]
        }).save();


    });
};

module.exports = {
    seed: seed
}