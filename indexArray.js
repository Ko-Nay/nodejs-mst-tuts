
//indexOf[values]

const empArray = [
    {
        "id" : "1", 
        "name" : "Employee 1",
        "age" : "20",
        "profession" : "Web Developer",
    },
    {
        "id" : "2", 
        "name" : "Employee 2",
        "age" : "22",
        "profession" : "App Developer",
    },
    {
        "id" : "3", 
        "name" : "Employee 3",
        "age" : "25",
        "profession" : "App Developer",
    },
];

console.log(empArray[0]);
console.log(empArray[0].name);
console.log(empArray[0].profession);
console.log(empArray[2].name , empArray[2].profession);


const userArray = [
   { 
        User : {
            "id" : "1", 
            "name" : {
                "firstname" : "Leon",
                "lastname" : "Hein",
            },
            "age" : "20",
            "profession" : [
                "Web Developer", 
                "Application Developer",
                "Software Engineer",
            ],
        },
    }
]

console.log(userArray[0].User.name);
console.log(userArray[0].User.name.firstname);
console.log(userArray[0].User.name.lastname);
console.log(userArray[0].User.profession);
console.log(userArray[0].User.profession[2]);