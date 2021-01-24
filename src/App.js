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
  const [v1 , setV1] = useState(0);
  const [v2 , setV2] = useState(0);
  const [alpha , setAlpha] = useState(2);
  const [showPublicKey , setShowPublicKey] = React.useState(false);
  const [aliceMessage , setAliceMessage] = React.useState('');
  const [popUp, setPopUp] = React.useState(false);

  const exponentiation = (bas, exp, modulo)=> {
    let myBinary = parseInt(exp).toString(2).split("").reverse().join("");
    let temp = 1;
    let c = bas;
    if (exp === 0)
      return temp;
    // console.log(myBinary[0]);
    if(myBinary[0] === "1")
      temp = bas;
    for (let i=1; i < myBinary.length; i++){
      c = ( c ** 2 ) % modulo;
      if(myBinary[i] === "1")
        temp = (c * temp) % modulo;
    }
    return temp;
  };


  const modInverse = (number, modulo) =>{
    let listOfDivisors = [number];
    let listOfReminders = [];

    let divider = modulo;
    let myNumber = number;
    let reminder;


    while (myNumber !== 1){
      console.log(myNumber);
      console.log(divider);

      listOfDivisors.push(Math.floor(divider % myNumber));
      listOfReminders.push(Math.floor(divider / myNumber));

      reminder = divider;
      divider = myNumber;
      myNumber =  Math.floor(reminder % myNumber);
    }

    let myFinal = listOfDivisors[listOfDivisors.length-1];
    for (let i = listOfReminders.length; i > 0; i-- ){

    }

    console.log(listOfDivisors);
    console.log(listOfReminders);
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
      // let y2 = (2 ** a1) % parseInt(p1);
      // console.log(y2);
      setY(y);
    }
  };


  //SHOW PUBLIC KEY
  const generatePublicKey = () => {
    if(p !== 0n)
      setShowPublicKey(!showPublicKey)
  };

  const verifyV1 = () => {
   alert(`${p}, ${alpha}, ${y}`);
    if(1 <= r && r <= p-2) {
      let step1 = exponentiation(y, r, p);
      let step2 = exponentiation(r, s, p);
      let v = (step1 * step2) % p;
      console.log(v);
    }
  };

  const verifyV2 = () => {
    let toyHashMessage1 = toyHash(aliceMessage);
    console.log(toyHashMessage1);
    let v2 = exponentiation(alpha, toyHashMessage1, p);
    console.log(v2)
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

  const modInverseSecond = (a,  m) => {
    let m0 = m;
    let y = 0;
    let x = 1;

    if (m === 1)
      return 0;

    while (a > 1) {
      // q is quotient
      let q = Math.floor(a / m);
      let t = m;

      // m is remainder now, process same as
      // Euclid's algo
      m = a % m;
      a = t;
      t = y;

      // Update y and x
      y = x - q * y;
      x = t;
    }

    // Make x positive
    if (x < 0)
      x += m0;

    return Math.floor(x);
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
      console.log(toyHashMessage);
      let compute = modInverseSecond(k1, p-1);
      let s_computes = Math.floor(compute * (toyHashMessage - (a * r1)) % (p-1));
      setS(s_computes);
      if (s_computes < 0){
        s_computes = (p-1) + s_computes;
      }
      return [r1, s_computes]
    }
  };

  const handleChange = (event) => {
    setAliceMessage(event.target.value);
  };

  const handleSubmit = (event) =>{
    let toyHashMessage1 = toyHash(aliceMessage);
    let aliceSign = generateAliceSignature(toyHashMessage1);
    if(aliceSign[0] === null || aliceSign[0] === 0 || aliceSign[1] === null || aliceSign[1] === 0){
      alert("Please generate other keys")
    }
    else {
      setPopUp(true);
      setR(aliceSign[0]);
      setS(aliceSign[1]);
    }
    console.log(aliceSign);
    event.preventDefault();
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
            {showPublicKey && <div style={{marginTop: 20}}>{`(p: ${p}, α: 2, y: ${y})`}</div>}
            <br/>
          </div>
          <div className="btnParent spanChild">
          <div className="btn btn-1"
               onClick={()=>{
                 alert("Private key is: " + a );
               }}>Private Key</div>
          <br/>
        </div>
        </div>

        <div className="App-header2"
             style={{display: 'flex', flexDirection:  'row', justifyContent: 'space-around'}}>
          {
            <form onSubmit={handleSubmit} style={{ width: '80%'}}>
              <label style={{fontSize: 25, marginLeft: 20}}>
                Message:
                <input type="text"
                       style={{padding: 20, width: 300, fontSize: 25, margin: 30}}
                       value={aliceMessage}
                       onChange={handleChange}/>
              </label>
              <input type="submit" value="Send text" className="btn btn-1"
                     style={{padding: 20, fontSize: 20, marginRight: 20}}/>
            </form>
          }
          {
            popUp === true &&
           <div style={{display: 'flex', flexDirection:  'row', justifyContent: 'space-around'}}>
             <div>
               {r !== 0 && r !== null && s !== 0 && s!== null && `Alice's sign: (${r},  ${s})`}
             </div>
             <div className="btn btn-1"
                  style={{padding: 20, margin: 30}}
                  onClick={verifyV1}>
               Verify v1
             </div>
             <br/>
             <div className="btn btn-1"
                  style={{padding: 20, margin: 30}}
                  onClick={verifyV2}>
               Verify v2
             </div>
           </div>
          }
        </div>
      </div>
    </>
  );

};

export default App;
