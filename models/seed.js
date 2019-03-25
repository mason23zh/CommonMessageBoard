var seed = function(Student) {
    Student.find(function(err, students) {
        if (students.length) return;

        var stu = new Student({
            name: 'Student one',
            snum: 390901,
            finalPercentage: 89,
            finalGrade: 'A',
        }).save();

        new Student({
            name: 'Student two',
            snum: 390902,
            finalPercentage: 74,
            finalGrade: 'B',
        }).save();

        new Student({
            name: 'Student three',
            snum: 390903,
            finalPercentage: 61,
            finalGrade: 'C',
        }).save();
    });
};

module.exports = {
    seed: seed
}