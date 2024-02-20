const isPalindrom = () =>{
  const num = 121;
  const reverseNum = num.toString().split('').reverse().join('');
  if(+reverseNum === num){ return true;}
  return false;
}

// console.log(isPalindrom());


const fibbonachiSeries = (n) => {
    let series = [0,1];
 
    for(let i = 2; i<=n; i++){
        series.push(series[i-2] + series[i-1]);
    }
    return series;
};

// console.log(fibbonachiSeries(10));

const isAnagram = (input1,input2) => {
    if(input1.length !== input2.length) {return false;}
    const modifiedStr = input1.toLowerCase().split('').sort().join('');
    const modifiedInputStr = input2.toLowerCase().split('').sort().join('');
    console.log(modifiedStr, modifiedInputStr)
    if(modifiedStr === modifiedInputStr) { return true; }
    else return false;
   
}

console.log(isAnagram('Anagram','nagaram'));