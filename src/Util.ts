
// from 0 to not including max
function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}


// returns a single character a-z A-Z
function getRandomIdCharAlpha(): string {
  const range = 52; //26+26;

  const got = getRandomInt(range)+10;

  const r2 = got >= 36; //(10+26);

  let c;
  if( r2 ) {
    c = 61 + got;
  } else {
    c = got + 55;
  }
  return String.fromCharCode(c);
}

// returns a single character 0-9 a-z A-Z
function getRandomIdChar(): string {
  const range = 62; //10+26+26;

  let got = getRandomInt(range);

  const r2 = got >= 36; //(10+26);
  const r1 = got >= 10;

  let c;
  if( r2 ) {
    // c = 97 + (got - 10 - 26);
    c = 61 + got;
  } else if( r1 ) {
    c = got + 55;
    // c += 65;
  } else {
    c = got + 48;
  }
  return String.fromCharCode(c);
}

// returns a random string which is a valid js
// identifier
// first char is a-z A-Z
function getRandomId(len: number = 10): string {

  // get the first character which will not include a number
  let ret = getRandomIdCharAlpha();
  for(let i = 0; i < len-1; i++) {
    // get the rest which can include numbers
    ret += getRandomIdChar();
  }

  return ret;
}



export {
getRandomInt,
getRandomId,
getRandomIdChar,
getRandomIdCharAlpha,
}
