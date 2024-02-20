//1. reverse the each word of string

function reverseEachWord() {
  const str = "This is java code";
  const array = str.split(" ");
  const result = array.map((e) => e.split("").reverse().join("")).join(" ");
  return result;
}

// console.log(reverseEachWord())

//2. Write a function that takes an array (a) and a value (b) as argument. The function should remove all elements equal to 'b' from the array. Return the filtered array.

//myFunction([1,2,3], 2) Expected[1, 3]

function myFunction(a, b) {
  return a.filter((cur) => cur !== b);
}

//3.  Write a function that takes an array of strings as argument. Return the longest string.

function findLongestString(strings) {
  let longestString = "";
  for (let i = 0; i < strings.length; i++) {
    if (strings[i].length > longestString.length) {
      longestString = strings[i];
    }
  }
  return longestString;
}

// Example usage
const stringArray = ["apple", "banana", "kiwi", "strawberry", "orange"];
const longestString = findLongestString(stringArray);
// console.log("Longest String:", longestString);

// second method
function myFunction(arr) {
  return arr.reduce((a, b) => (a.length <= b.length ? b : a));
}

//4. Write a function that takes an array as argument. It should return true if all elements in the array are equal. It should return false otherwise.

function allElementsEqual(arr) {
  if (arr.length === 0) {
    return true;
  }

  const firstElement = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== firstElement) {
      return false;
    }
  }

  return true;
}

//second method
function myFunction(arr) {
  return new Set(arr).size === 1;
}

//5. Write a function that takes arguments an arbitrary number of arrays. It should return an array containing the values of all arrays.
function mergeArrays(...arrays) {
  let merged = [];
  for (let arr of arrays) {
    merged.push(...arr);
  }
  return merged;
}

function myFunction(...arrays) {
  return arrays.flat();
}

//6.Write a function that takes an array of objects as argument. Sort the array by property b in ascending order. Return the sorted array

function sortByPropertyB(arr) {
  // Using the sort() method with a custom comparison function
  arr.sort((a, b) => a.b - b.b);
  return arr;
}

function myFunction(arr) {
  const sort = (x, y) => x.b - y.b;
  return arr.sort(sort);
}

//6.Write a function that takes two arrays as arguments. Merge both arrays and remove duplicate values. Sort the merge result in ascending order. Return the resulting array

function mergeAndSortArrays(arr1, arr2) {
  const mergedArray = arr1.concat(arr2); // Merge both arrays
  const uniqueArray = [...new Set(mergedArray)]; // Remove duplicates using Set
  const sortedArray = uniqueArray.sort((a, b) => a - b); // Sort in ascending order
  return sortedArray;
}

function myFunction(a, b) {
  return [...new Set([...a, ...b])].sort((x, y) => x - y);
}

//7.Write a function that takes a number (a) as argument. Split a into its individual digits and return them in an array. Tipp: you might want to change the type of the number for the splitting

function myFunction(a) {
  const string = a + "";
  const strings = string.split("");
  return strings.map((digit) => Number(digit));
}

function myFunction(a) {
  return a
    .toString()
    .split("")
    .map((digit) => Number(digit));
}

//8.find maximum characters in a string

function findMaxCharacter(str) {
  const charFrequency = {};

  for (let char of str) {
    charFrequency[char] = (charFrequency[char] || 0) + 1;
  }

  let maxChar = "";
  let maxFrequency = 0;

  for (let char in charFrequency) {
    if (charFrequency[char] > maxFrequency) {
      maxChar = char;
      maxFrequency = charFrequency[char];
    }
  }

  return maxChar;
}

const inputString = "this is a string of characters";
const maxChar = findMaxCharacter(inputString);
// console.log("Maximum occurring character:", maxChar);

// 9. Write a function that takes a number (a) as argument. Round a to the 2nd digit after the decimal point. Return the rounded number

function myFunction(a) {
  return Number(a.toFixed(2));
}

function roundTo2DecimalPlaces(a) {
  const roundedNumber = Math.round(a * 100) / 100;
  return roundedNumber;
}

//10.

const users = [
  { fname: "john", lname: "shina", isActive: true, id: "1", age: "40" },
  { fname: "nitish", lname: "patel", isActive: false, id: "2", age: "30" },
  { fname: "sachin", lname: "kumar", isActive: true, id: "3", age: "31" },
  { fname: "gholtan", lname: "singh", isActive: true, id: "4", age: "31" },
];

const fullName = users.map((user) => `${user.fname} ${user.lname}`);
// console.log(fullName, "fn");

const obj = users.reduce((acc, user) => {
  if (acc[user.age]) {
    acc[user.age] = ++acc[user.age];
  } else {
    acc[user.age] = 1;
  }

  return acc;
}, {});
// console.log(obj, "obj");

//------------------- simple for loping------------------------------------------------

const names = [];

for (let i = 0; i < users.length; i++) {
  names.push(users[i].name);
}

// console.log(names);

//-------------for each method call----------------------------------------------------
const userNames = [];
users.forEach(function (user) {
  userNames.push(user.name);
});

// console.log(userNames);

//---------------------- map method----------------------------------------------------

const userNames1 = users.map((user) => user.name);
// console.log(userNames1);

// ------------------getting active users--------------------------------

const activeUsers = [];

for (let i = 0; i < users.length; i++) {
  if (users[i].isActive) {
    activeUsers.push(users[i].name);
  }
}

// console.log(activeUsers)

const activeUsers1 = users
  .filter((user) => user.isActive)
  .map((user) => user.name);
// console.log(activeUsers)

const sortedUsers = users
  .sort((a, b) => a.age - b.age)
  .filter((user) => user.isActive)
  .map((user) => user.name);

// console.log(sortedUsers);

function add() {
  console.log(arguments.length);
}

// --------------find max value in array

const arr = [1, 5, 3, 6, 4, 5, 9, 10];

const maxNum = arr.reduce((acc, curr) => (curr > acc ? curr : acc), 0);

// console.log("maxNum:", maxNum);

//finding second max value in array

// const arr = [10, 5, 8, 20, 15];
let max = 0;
let smax = 0;

for (let i = 0; i < arr.length; i++) {
  if (arr[i] > max) {
    smax = max;
    max = arr[i];
  } else if (arr[i] > smax) {
    smax = arr[i];
  }
}

// console.log(smax, max);

// console.log(sMax, max);

// another method
function findSecondMax(arr) {
  const sortedArray = arr.sort((a, b) => b - a);
  return sortedArray[1];
}

const numbers = [10, 5, 8, 20, 15];
const secondMax = findSecondMax(numbers);
// console.log("Second maximum:", secondMax); // Output: Second maximum: 15

function findSecondMax(arr) {
  let max = -Infinity;
  let secondMax = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      secondMax = max;
      max = arr[i];
    } else if (arr[i] > secondMax && arr[i] < max) {
      secondMax = arr[i];
    }
  }

  return secondMax;
}

// const numbers = [10, 5, 8, 20, 15];
// const secondMax = findSecondMax(numbers);
// console.log("Second maximum:", secondMax); // Output: Second maximum: 15

const array = [10, 5, 8, 20, 15, 15, 5];

// console.log(...new Set (array));

// palindrome question

function checkPalindrome(str) {
  for (let i = 0; i < str.length / 2; i++) {
    if (str[i] === str[str.length - 1 - i]) {
      return "palindrom";
    } else {
      return "not a palindrom";
    }
  }
}

// console.log(checkPalindrome('lol'));

// dont add yourself problem

const myArray = [2, 7, 11, 4, -2];

let sum = 0;
for (let i = 0; i < myArray.length; i++) {
  sum = sum + myArray[i];
}

// console.log(sum);
let nArr = [];
for (let i = 0; i < myArray.length; i++) {
  nArr.push(sum - myArray[i]);
}
// console.log(nArr);

//Question
const input1 = { a: 1, b: 2, c: 3, d: 10, e: 12 };
const input2 = { a: 2, e: 12, f: 6, d: 10 };
// const output = {d:10,e:12};
const output = {};

for (let key in input1) {
  if (input2[key] === input1[key]) {
    output[key] = input1[key];
  }
}

// console.log(output);

// Anagrams are words or phrases that have the same characters, but arranged differently. In JavaScript, you can check if two strings are anagrams by comparing whether they have the same characters in the same quantities. Here's a function to determine if two strings are anagrams:

function areAnagrams(str1, str2) {
  const cleanStr1 = str1.replace(/[^a-zA-Z]/g, "").toLowerCase();
  const cleanStr2 = str2.replace(/[^a-zA-Z]/g, "").toLowerCase();

  if (cleanStr1.length !== cleanStr2.length) {
    return false;
  }

  const charCount = {};

  for (const char of cleanStr1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  for (const char of cleanStr2) {
    if (!charCount[char]) {
      return false;
    }
    charCount[char]--;
  }

  return true;
}

// console.log(areAnagrams("listen", "silent")); // Output: true
// console.log(areAnagrams("hello", "world"));   // Output: false

// another method

function areAnagrams(str1, str2) {
  const sortedStr1 = str1.toLowerCase().split("").sort().join("");
  const sortedStr2 = str2.toLowerCase().split("").sort().join("");

  return sortedStr1 === sortedStr2;
}

const word1 = "listen";
const word2 = "silent";
// console.log(areAnagrams(word1, word2)); // Output: true

// removing 2 element from the beginning of the array

const newArray = [2, 5, 1, 3, 9, 4, 7];

for (let i = 0; i < newArray.length - 2; i++) {
  newArray[i] = newArray[i + 2];
}
newArray.length = newArray.length - 2;
// console.log(newArray)

// rotating an array by the second element

function rotateArray(array, k = 2) {
  const newArray = [2, 5, 1, 3, 9, 4, 7];

  // adding the k element in the last to the array
  for (let i = 0; i < k; i++) {
    newArray[newArray.length] = newArray[i];
  }

  //removing the k element from the array
  for (let i = 0; i < newArray.length - k; i++) {
    newArray[i] = newArray[i + k];
  }
  newArray.length = newArray.length - k;
  console.log(newArray);
}

async function getCountryName(code) {
  // write your code here
  // API endpoint: https://jsonmock.hackerrank.com/api/countries?page=<PAGE_NUMBER>

  const countries = await fetch(
    "https://jsonmock.hackerrank.com/api/countries?page=2?alpha2Code=AF"
  );
  const response = await countries.json();

  console.log(response.data.filter((data) => data.alpha2Code === "AF")[0].name);
}

// getCountryName();

function incriment(num) {
  return ++num;
}

// console.log(incriment(1));

// reverse each word of the sentence

var string = "Welcome to this Javascript Guide!";
const reverse = string
  .split(" ")
  .map((str) => str.split("").reverse().join(""))
  .join(" ");
// console.log (reverse);

//find duplicates in a array

function findDuplicateNum(arr) {
  const newArray = arr.filter((n, i, array) => {
    if (array.indexOf(n) !== i) {
      return n;
    }
  });
  console.log(newArray);
}

// findDuplicateNum([2,5,4,7,8,2,5,6])

// by using for loops
function findDuplicateNum(arr) {
  const duplicatesNum = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && duplicatesNum[i] === undefined) {
        duplicatesNum[i] = arr[i];
      }
    }
  }
  console.log(duplicatesNum);
}

// findDuplicateNum([2, 5, 4, 7, 8, 2, 5, 6]);

function findDuplicates(arr) {
  const duplicates = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicatesContains(duplicates, arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }

  return duplicates;
}

function duplicatesContains(arr, num) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === num) {
      return true;
    }
  }
  return false;
}

const numbers1 = [2, 5, 4, 7, 8, 2, 5, 6, 5, 2];
const duplicateValues = findDuplicates(numbers1);

// console.log(duplicateValues); // Output: [2, 5]

//find number of duplicates in array

function countOfDuplicates(array) {
  const obj = array.reduce((acc, curr) => {
    if (acc[curr] == undefined) {
      acc[curr] = 1;
      return acc;
    } else {
      acc[curr]++;
      return acc;
    }
    // return acc = acc + curr;
  }, {});

  console.log(obj);
}

// countOfDuplicates([2,5,4,7,8,2,5,6])

// to check num is integer number

function isInteger(num) {
  return num % 1 === 0;
}

// console.log(isInteger(1.2));

function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}

const unSortedArray = [1, 3, 5, 2, 9, 6, 8];
bubbleSort(unSortedArray);

// console.log(unSortedArray); // Output: [1, 2, 3, 5, 6, 8, 9]

// comapre two array

const arr1 = [4, 8, 10, 9, 5];
const arr2 = [5, 10, 8, 9, 4];

const is_same =
  arr1.length === arr2.length &&
  arr1.every((e) => {
    if (arr2.indexOf(e) > -1) {
      return true;
    }
  });
// console.log(is_same)

// finding missing value

const input = [1, 2, 3, 5, 6, 7, 9, 10];

const minNum = Math.min(...input);
const maxNumber = Math.max(...input);

const missingNum = [];

for (let i = minNum; i <= maxNumber; i++) {
  if (input.indexOf(i) < 0) {
    missingNum.push(i);
  }
}

// console.log(missingNum);

const array1 = [2, 4, 7, 3, 5, 6, 13, 14, 9];

const oddNumber = [];
const evenNumber = [];

for (let i = 0; i < array1.length; i++) {
  if (array1[i] % 2 === 0) {
    evenNumber.push(array1[i]);
  } else {
    oddNumber.push(array1[i]);
  }
}

// console.log(evenNumber,oddNumber);

function factorial(n) {
  if (n === 0) return 1;
  else {
    return n * factorial(n - 1);
  }
}

// console.log(factorial(4));

// convert array into object

const inputarray = ["a", "b", "c"];

let obj1 = inputarray.reduce((acc, curr) => {
  acc[curr] = curr;
  return acc;
}, {});

// console.log(obj1);

const object = {};

for (let e of inputarray) {
  object[e] = e;
}

// console.log(object);

function findAverageOfArray() {
  let array = [2, 3, 4, 5, 7, 8];

  let sum = array.reduce((acc, curr) => acc + curr, 0);

  let average = sum / array.length;

  console.log(average);
}

// findAverageOfArray();

function convertFirstLetterToUppercase() {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  for (let day of days) {
    day = day.charAt(0).toUpperCase() + day.substring(1);
    console.log(day);
  }
}

// convertFirstLetterToUppercase();

function createSentence() {
  const array = ["welcome", "to", "javascript", "tutorial."];

  const joined = array.join(" ");
  console.log(joined);
}
// createSentence();

// how to check if an array is contains any element of another array

function isArrayContains() {
  const array = [2, 3, 4, 5];
  const otherArray = [2, 6, 8, 5];
  // const arrayContains = [];

  // for(let e of array){
  //   if(otherArray.indexOf(e) > -1){
  //     arrayContains.push(e);
  //     console.log(arrayContains)
  //   }else{
  //     console.log(false);
  //   }
  // }

  let result = array.some((ele) => otherArray.includes(ele));
  console.log(result);
}

// isArrayContains();

// Q. how can you extract a few fields from the given json object and form a new array?

const inputvalue = {
  students: [
    { name: "saurya", id: 10 },
    { name: "ram", id: 11 },
    { name: "nitish", id: 12 },
  ],
};

const outputVal = inputvalue.students.map((item) => item.name);
// console.log(outputVal)

// Q how to check  if the variable passes is an array or not?

// console.log(Array.isArray([1,2]));

//Q. What is IIFEs(immediately invoked function Expression) ?

// (function hello(){
//   console.log('i am a function Expression');
// })();

const greet = function () {
  console.log("i am a function Expression");
};

// greet();

//Q. how to  empty an array

function emptyArray(params) {
  let array = [1, 2, 3, 4, 5, 6];

  array.length = 0; // 1st method

  array.splice(0, array.length); // 2nd method

  array = []; // 3rd method

  while (array.length > 0) {
    //4th method
    array.pop();
  }

  console.log(array);
}

// emptyArray();

function isPalindrome() {
  let str = "level";

  // for(let i = 0; i <str.length/2; i++) {
  //   if(str[i] === str[str.length - 1 -i]) {
  //     console.log('is palindrome');
  //   }else{
  //     console.log('not a palindrome');
  //   }
  // }

  const strLowercase = str.toLowerCase();
  const reverseStr = str.split("").reverse().join("");
  console.log(reverseStr === strLowercase);
}

// isPalindrome();

function countCharacters() {
  const str = "java";
  const obj = {};
  for (let e of str) {
    // if(obj[e] !== e || obj[e] === undefined){
    // obj[e] = 1;
    // }else {
    //   obj[e] += 1
    // }
    obj[e] = (obj[e] || 0) + 1;
  }

  console.log(obj);
}
// countCharacters();

function combineTwoArray(arr1, arr2) {
  const combinedArray = [...arr1, ...arr2];
  console.log(combinedArray);
}

// combineTwoArray([1, 2, 3],[3,4, 5]);

//Q. how to sort and reverse an array without changing the original array?

function reverseAnArray() {
  const array = [3, 4, 1, 5, 2];
  const reverseArray = array.slice().reverse();
  const sortedArray = array.slice().sort();
  console.log(array, reverseArray, sortedArray);
}

// reverseAnArray();

//Q how to replace an element in an array at a specific index in an array?

function replaceElement() {
  const array = [1, 2, 3, 5, 4];
  const index1 = array.indexOf(5);
  const index2 = array.indexOf(4);
  array.splice(index1, 1, 4);
  array.splice(index2, 1, 5);
  console.log(array);
}

// replaceElement();

// Q. clone a object

function cloneObj() {
  const obj = {
    firstname: "nitish",
    lastname: "patel",
    age: 29,
  };

  //methods to clone object
  const obj2 = obj;

  const obj3 = { ...obj };

  const obj4 = Object.assign({}, obj);

  console.log(obj, obj2, obj3, obj4);
}
// cloneObj();

//Q add element to begining of an array

function addElement() {
  const array = [2, 3, 4];
  // array.unshift(1)

  // const newArray = [1,...array]
  console.log(array, newArray);
}

// addElement();

function splitSentenceIntoArray() {
  const str = "welcome to javascript!";
  const array = str.split(" ");
  console.log(array);
}

// splitSentenceIntoArray();

// Q. how can you replace an existing element in an object? !imp

function replceKeyinObj() {
  const Origionalobj = {
    firstname: "nitish",
    lastname: "patel",
    age: 29,
  };

  const modifiedobj = {
    ...Origionalobj,
    age: 30,
  };

  console.log(modifiedobj);
}

// replceKeyinObj();

function renameKeyinObj() {
  // Create an object with the old key
  const person = {
    firstName: "John",
    lastName: "Doe",
  };

  // Step 1: Rename the key
  person.newFirstName = person.firstName; // Create a new key
  delete person.firstName; // Delete the old key

  console.log(person);
}

// renameKeyinObj();

let num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let slicednum = num.slice(1); //this will remove first element from array
// console.log(slicednum);

function combineTwoObjects() {
  const obj1 = {
    name: "foo",
    age: 10,
  };

  const obj2 = {
    city: "patna",
    state: "bihar",
  };

  console.log({ ...obj1, ...obj2 });
}

// combineTwoObjects();

function findSum(...args) {
  let sum = 0;
  for (let i = 0; i < args.length; i++) {
    sum += args[i];
  }
  console.log(sum);
}

// findSum(1,2,3,4);

// console.log(1.2345.toFixed(1));

// console.log('nitish'.charAt(0)); //it used to get a character from string to a specific index

function printPattern(n) {
  for (let i = 1; i <= 2 * n - 1; i++) {
    let line = "";
    const maxStars = i <= n ? i : 2 * n - i;

    for (let j = 1; j <= maxStars; j++) {
      line += "*";
    }

    console.log(line);
  }
}
// printPattern(3);

function isPalindrome(str) {
  const cleanStr = str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const length = cleanStr.length;

  for (let i = 0; i < length / 2; i++) {
    if (cleanStr[i] !== cleanStr[length - 1 - i]) {
      return false;
    }
  }

  return true;
}

// Test cases
// console.log(isPalindrome("racecar")); // true
// console.log(isPalindrome("hello"));   // false
// console.log(isPalindrome("A man, a plan, a canal, Panama")); // true

function factorial(n) {
  if (n === 0) {
    return 1;
  } else return n * factorial(n - 1);
}

// console.log(factorial(3));

const isPalindromeStr = function (x) {
  return x === x.toString().split("").reverse().join("");
};

// console.log(isPalindromeStr('lol'));

// Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

// You may assume that each input would have exactly one solution, and you may not use the same element twice.

// You can return the answer in any order.

// Example 1:

// Input: nums = [2,7,11,15], target = 9
// Output: [0,1]
// Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
// Example 2:

// Input: nums = [3,2,4], target = 6
// Output: [1,2]
// Example 3:

// Input: nums = [3,3], target = 6
// Output: [0,1]

var twoSum = function (nums, target) {
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    // console.log(nums[i], i, "i");
    const temp = nums[i];
    for (let j = i + 1; j < nums.length; j++) {
      // console.log(nums[j], j, "j");
      if (temp + nums[j] === target) {
        result.push(i, j);
      }
    }
  }
  return result;
};

// console.log(twoSum([1,3,4,5],8));

// Given a string s, find the length of the longest
// substring
//  without repeating characters.

// Example 1:

// Input: s = "abcabcbb"
// Output: 3
// Explanation: The answer is "abc", with the length of 3.
// Example 2:

// Input: s = "bbbbb"
// Output: 1
// Explanation: The answer is "b", with the length of 1.
// Example 3:

// Input: s = "pwwkew"
// Output: 3
// Explanation: The answer is "wke", with the length of 3.
// Notice that the answer must be a substring, "pwke" is a subsequence and not a substring

var lengthOfLongestSubstring = function (s) {
  let str = "";
  for (let i = 0; i < s.length; i++) {
    let temp = s[i];
    if (s[i] !== s[i + 1] && str[temp] !== undefined) {
      str += s[i];
      console.log(str[temp], str);
    }
  }
  return str;
};

// console.log(lengthOfLongestSubstring("abcabcbb"));

function fibonacci(n) {
  const newarr = [];
  if (n === 1) {
    newarr.push(0);
  } else if (n === 2) {
    newarr.push(0, 1);
  } else {
    let arr = [0, 1];
    for (let i = 2; i < n; i++) {
      sum = arr[i - 2] + arr[i - 1];
      arr.push(sum);
    }
    console.log(arr);
  }
  // console.log(newarr);
}

// fibonacci(2)

function generateFibonacci(n) {
  const fibonacciSeries = [0, 1];

  for (let i = 2; i < n; i++) {
    const nextFib = fibonacciSeries[i - 1] + fibonacciSeries[i - 2];
    fibonacciSeries.push(nextFib);
  }

  return fibonacciSeries;
}

// const n = 10; // Change this to the desired number of Fibonacci numbers
// const result = generateFibonacci(n);
// console.log(result); // Output the Fibonacci series

function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let start = 0;
  const charIndexMap = {};

  for (let end = 0; end < s.length; end++) {
    const currentChar = s[end];

    if (
      charIndexMap[currentChar] !== undefined &&
      charIndexMap[currentChar] >= start
    ) {
      // If the current character has been seen before in the current substring, update the start index
      start = charIndexMap[currentChar] + 1;
    }

    // Update the index of the current character
    charIndexMap[currentChar] = end;

    // Calculate the length of the current substring and update the maximum length
    const currentLength = end - start + 1;
    maxLength = Math.max(maxLength, currentLength);
  }

  return maxLength;
}

// Example usage:
// const inputString = "abcabcbb";
// const result = lengthOfLongestSubstring(inputString);
// console.log(result); // Output should be 3 (for "abc")

function findLongestSubstring(s) {
  let maxLength = 0;
  let start = 0;
  let longestSubstring = "";
  const charIndexMap = {};

  for (let end = 0; end < s.length; end++) {
    const currentChar = s[end];

    if (
      charIndexMap[currentChar] !== undefined &&
      charIndexMap[currentChar] >= start
    ) {
      // If the current character has been seen before in the current substring, update the start index
      start = charIndexMap[currentChar] + 1;
    }

    // Update the index of the current character
    charIndexMap[currentChar] = end;
    // Calculate the length of the current substring and update the maximum length
    const currentLength = end - start + 1;
    if (currentLength > maxLength) {
      maxLength = currentLength;
      longestSubstring = s.substring(start, end + 1);
    }
  }

  return { length: maxLength, substring: longestSubstring };
}

// Example usage:
const inputString1 = "abcabcbb";
const result = findLongestSubstring(inputString1);
console.log("Longest Substring Length:", result.length); // Output should be 3
console.log("Longest Substring:", result.substring); // Output should be "abc"

function countChar(str) {
  let obj = {};
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (obj[char] !== undefined && obj[char] >= 0) {
      obj[char] = obj[char] + 1;
    } else {
      obj[char] = 1;
    }
  }
  console.log(obj);
}

// countChar("abcabcbb");

function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Swap if the element found is greater than the next element
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return arr;
}

// Example array of numbers
// const numbers = [5, 2, 8, 1, 3];

// Sorting the array using Bubble Sort
const sortedArray = bubbleSort(numbers.slice());

// console.log('Sorted Array:', sortedArray);

let mainArray1 = [
  [3, 5, 1],
  [2, 5, 8],
];

let sortedArrays = mainArray.map((subArray) =>
  subArray.slice().sort((a, b) => a - b)
);

// console.log(sortedArrays);

//second method
function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements if they are in the wrong order
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

let mainArray = [
  [3, 5, 1],
  [2, 5, 8],
];

for (let i = 0; i < mainArray.length; i++) {
  mainArray[i] = bubbleSort(mainArray[i]);
}

// console.log(mainArray);
