import {AsyncBehaviorTreeBridge} from './AsyncBehaviorTreeBridge'

let cnt: number = 0;

let fn = () => {
  console.log(`server: ${cnt}`);

  cnt++;

  setTimeout(fn, 30000);
};


fn();



const sg = new AsyncBehaviorTreeBridge();
