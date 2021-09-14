import * as CryptoJS from "crypto-js";

class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  //블록을 생성하지않아도 메소드를 사용할수 있름(static으로 만들었기 때문.)
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  //들어온 블록의 구조가 유효한지 아닌지를 판단.
  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";

  constructor(
    index: number,
    hash: string,
    previous: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previous;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, "20202020202", "", "hello", 123456);

//블록체인은 블록들의 연결이다 따라서 블록의 배열!
//블록만 블록체인에 추가하도록 체크할 것이다.
//다른것을 여기에 push하면 에러가 발생.
let blockchain: Block[] = [genesisBlock];
//블록을 추가하려면 해시 값을 계산해야한다.
//그것을 위해서 yarn add crypto-js

const getBlockchain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];
//가장 최근의 블록을 반환 함.

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimestamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimestamp,
    data
  );

  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimestamp
  );
  addBlock(newBlock);
  return newBlock;
};

const getHashforBlock = (aBlock: Block): string =>
  Block.calculateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.timestamp,
    aBlock.data
  );

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockchain.push(candidateBlock);
  }
};
console.log(blockchain);
console.log(createBlock("hello"), createBlock("bye"));

export {};
// // interface Human {
// //   name: string;
// //   age: number;
// //   gender: string;
// // }
// //person 객체를 넘겨주기 위헤 인터페이스를 만들어 준것.
// //neme:string 이런식으로 파라미터를 정해줬듯이
// //person:Human 이라고 정해줄 수 있게 된다.
// //인터페이스는 자바스크립트에서는 작동하지 않고, 타입스크립트에서만 작동함.

// //인터페이스는 js로 컴파일 되지 않는다.

// //만약 js로 컴파일 하고 싶다면 클래스를 사용한다.

// //js에서는 클래스가 어떤 속성을 갖는지 명시 하지 않아도 되지만
// //ts에서는 해야 함.(속성이 가지는 권한도 명시해야 함.)

// //속성이 가지는 권한을 private로한다면 클래스 밖에서 직접적으로 접근은 불가능.

// class Human {
//   public name: string;
//   public age: number;
//   public gender: string;
//   constructor(name: string, age: number, gender: string) {
//     this.name = name;
//     this.age = age;
//     this.gender = gender;
//   }
// }
// //gender?: string 생성자에 이런식으로 써서 선택적으로 넣을 수 도 있다.

// // const person = {
// //   name: "kim",
// //   age: 22,
// //   gender: "male",
// // };
// const person = new Human("kim", 25, "male");

// const sayHi = (person: Human): string => {
//   //console.log(`Hello ${name}, ${age}, ${gender}!`);
//   //return이 void니까 어떤 값을 리턴한다 적으면 에러.
//   //return을 string으로하면 string을 리턴 가능.
//   return `hello ${person.name}, ${person.age} ${person.gender}`;
// };

// console.log(sayHi(person));
// //넘겨준 오브젝트가 Human이라는 인터페이스와 같은지 판단.
