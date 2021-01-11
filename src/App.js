import React, {useState} from 'react';
import './App.css';
const randomPrime = require('random-prime').randomPrime;
/* global BigInt */


const App = () => {
  const [a , setA] = useState(0);
  const [p , setP] = useState(0);
  const [y , setY] = useState(0);
  const [k , setK] = useState(0);
  const [r , setR] = useState(0);
  const [s , setS] = useState(0);
  const [alpha , setAlpha] = useState(2);
  const [showPublicKey , setShowPublicKey] = React.useState(false);

  const exponentiation = (bas, exp, modulo)=> {
    let myBinary = parseInt(exp).toString(2).split("").reverse().join("");
    let temp = 1;
    let c = bas;
    if (exp === 0)
      return temp;
    console.log(myBinary[0]);
    if(myBinary[0] === "1")
      temp = bas;
    for (let i=1; i < myBinary.length; i++){
      c = ( c ** 2 ) % modulo;
      if(myBinary[i] === "1")
        temp = (c * temp) % modulo;
    }
    return temp;
  };



  const EE =(number, modulo, x, y) => {
    if(number % modulo === 0)
    {
      x=0;
      y=1;
      return;
    }
    EE(modulo,number % modulo, x, y);
    let temp = x;
    x = y;
    y = temp - y*(number/modulo);
  };

  const modInverse = (number, modulo) =>{
    let x,y;
    EE(number,modulo, x, y);
    if( x < 0 )
      x += modulo;
    return x;
  };


  //GENERATE KEYS
  const generateKeys = () => {
    const p1 = randomPrime(2300, 8000);
    const a1 = randomPrime(1, 2298);
    setP(p1);
    setA(a1);
    // eslint-disable-next-line no-undef
    if (a1 >= p1 - 2 || a1 <= 1)
      while (a1 >= p1 - 2 || a1 <= 1) {
        const p1 = randomPrime(2300, 8000);
        const a1 = randomPrime(1, 2298);
        setP(p1);
        setA(a1);
      }
    else {
      let y = exponentiation(alpha, a1, p1);
      setY(y);
      console.log(y)
    }
  };


  //SHOW PUBLIC KEY
  const generatePublicKey = () => {
    if(p !== 0n)
      setShowPublicKey(!showPublicKey)
  };

  //Compute the GCD of 2 numbers
  const gcd = (c, b) => {
    let rest = 0;
    //we are using Euclid's algorithm for finding the gcd of 2 numbers
    if (c > b){
      while (b > 0){
        rest = c % b;
        c = b;
        b = rest;
        return c
      }
    }
    else
    {
      while (c > 0){
        rest = b % c;
        b = c;
        c = rest;
      }
      return b
    }
  };

  //Determine if 2 numbers are relatively prime
  const toyHash = (message) =>{
    let v = 0;
    let c = 0;
    let w = 0;
    let vowels = ['a', 'e', 'i', 'o', 'u'];
    // eslint-disable-next-line array-callback-return
    for (let letter=0; letter <= message.length -1; letter++) {
      if(vowels.includes(message[letter]))
        v += 1;
      else if(message[letter] === " ")
        w += 1;
      else c += 1
    };
    return (v ** 2 + c * v + w) % 19 ;
  };


  const generateAliceSignature = (toyHashMessage) =>{
    let k1 = Math.floor(Math.random() * 2298);
    setK(k1);
    while(k1 <= 1 || gcd(k1, p-1) !== 1){
      k1 = Math.floor(Math.random() * 2298);
      setK(k1);
    }
    if(gcd(k1, p-1) === 1){
      // eslint-disable-next-line no-undef
      let r1 = (2 ** k1) % parseInt(p);
      setR(r1);
      console.log("k1 " + k1);
      console.log("1/k1 " + modInverse(160, 841));
      let compute = Math.floor((1/k1) % p-1);
      let s_computes = (compute * (toyHashMessage - (a * r1))) % (p-1);
      setS(s_computes);
      console.log(r1 + " " + s_computes);
      return [r1, s]
    }
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <div style={{display: 'flex', flexDirection:  'column'}}>
            <div className="col s8">
              <h2>ElGamal Signature Scheme</h2>
              <p> Ungur Nicoleta & Stupariu Diana</p>
            </div>
          </div>

        </header>
        <div className="App-header2"
             style={{display: 'flex', flexDirection:  'row', justifyContent: 'space-around'}}>
          <div className="btnParent spanChild">
            <div className="btn btn-1 btn-keys"
                 onClick={generateKeys}>Generate Keys</div>
            <br/>
          </div>
          <div className="btnParent spanChild">
            <div className="btn btn-1 btn-keys"
                 onClick={generatePublicKey}>Public key</div>
            {showPublicKey && <div style={{marginTop: 20}}>{`(${p}, 2, ${y})`}</div>}
            <br/>
          </div>
          <div className="btnParent spanChild">
            <div className="btn btn-1"
                 onClick={()=>{
                   alert("Private key is: " + a );
                   let message = "message test sal niiiiiico";
                   let toyHashMessage1 = toyHash(message);
                   console.log(toyHashMessage1)
                   generateAliceSignature(toyHashMessage1);
                 }}>Private Key</div>
            <br/>
          </div>
        </div>

      </div>
    </>
  );

};

export default App;
