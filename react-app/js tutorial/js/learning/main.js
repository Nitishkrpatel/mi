// let a = 1;
// function outer() {
//     let b = 2;
//     function inner() {
//         let c = 3;
//         console.log(a,b,c);
//     };
//     inner();
// }
// outer();

// function outer() {
//     let count = 0;
//     function inner() {
//         count++;
//         console.log(count);
//     };
//     return inner;
// }

// let fn = outer();
// fn();
// fn();


function findmaxInarray(array) {

    console.log(array.sort((a, b) => a-b))
    console.log(array[array.length-1]);
}

findmaxInarray([1, 5, 2])