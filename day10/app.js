const employees = [
  {
    name: "John",
    age: 25,
    salary: 10000,
  },
  {
    name: "Jane",
    age: 22,
    salary: 15000,
  },
];

const data = employees.filter((employee) => employee.salary > 3000);

console.log(data);
