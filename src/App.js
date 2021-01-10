import React from 'react';
import './App.css';
// import securityImg from './images/security.png'
import {isPrime} from "random-prime";
const randomPrime = require('random-prime').randomPrime;
/* global BigInt */


const App = () => {
  const [a , setA] = React.useState(0n);
  const [p , setP] = React.useState(0n);
  const [y , setY] = React.useState(0n);
  const [showPublicKey , setShowPublicKey] = React.useState(false);

  const exp_by_squaring  = (x, n) => {
    if ( n < 0 ) return exp_by_squaring(1 / x, -n) ;
    else if (n === 0)  return  1;
    else if (n === 1 ) return  x;
    else if (n % 2 === 0) return exp_by_squaring(x * x,  n / 2);
    else if (n % 2 !== 0) return x * exp_by_squaring(x * x, (n - 1) / 2);
  };

  const gcd = (a, b) =>{
    if (a < b)
      return gcd(b, a);
    else if( a % b === 0)
      return b;
    else
      return gcd(b, a % b)
  };



  // Modular exponentiation
  const power = (a, b, c) => {
    let x = 1;
    let y = a;
    while (b > 0)
      if (b % 2 === 0){
        x = (x * y) % c;
        y = (y * y) % c;

        let b1 = (b / 2);
        b = parseInt(b1, 10);
      }

    return x % c
  };

  const generateKeys = () => {
    const p1 = BigInt(randomPrime(2300, 8000));
    setP(p1);
    const alpha = 2n;
    setA(BigInt(randomPrime(1, 2298)));
    // eslint-disable-next-line no-undef
    if(p !== 0n){
      let y = (alpha ** a) % p;
      setY(y);
    }
  };

  const generatePublicKey = () => {
    if(p !== 0n)
      setShowPublicKey(!showPublicKey)
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
                 onClick={()=>alert("Private key is: " + a )}>Private Key</div>
            <br/>
          </div>
        </div>

      </div>
      {/*<div id="presentation">*/}
      {/*    <PresentationOfTheApp/>*/}
      {/*</div>*/}
    </>
  );

};

export default App;
