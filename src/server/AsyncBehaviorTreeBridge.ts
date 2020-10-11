
import {
AsyncBehaviorTree,
ABTZmqLogger,
} from "async-behavior-tree";

import {
AsyncBehaviorTreeFileSink
} from "./AsyncBehaviorTreeFileSink";


// export interface ABTZmqLogger {
//   dataCallback(buf: Uint8Array, flushBuf: Vec2[]): void;
//   run(): Promise<void>;
// }

import {
BehaviorTreeFlatBuffer
} from "behavior-tree-flat-buffer";

import {
BehaviorTreeZmq
} from "behavior-tree-zmq";

const WebSocket = require('ws');


const inspect = require('util').inspect;
// console.log(util.inspect(dut.exe, {showHidden: false, depth: null}))


class AsyncBehaviorTreeBridge {

  wss: any;

  constructor(public options:any={wsPort:8094}) {

    console.log('---------------------------------');

    this.wss = new WebSocket.Server({ port: this.options.wsPort });

    const that = this;

    this.wss.on('connection', function connection(ws) {
      // ws.on('message', function incoming(message) {
      //   console.log('received: %s', message);
      // });

      ws.on('message', (m)=>{that.parseMessageOuter(ws, m)});

      ws.send('something');
    });

  }

  parseMessageOuter(ws, m): void {

    let o;
    try {
      o = JSON.parse(m)
    } catch (e) {
      console.log("failed to parse",e,m);
      // Oh well, but whatever...
      return ;
    }

    if( (!('t' in o)) || (!('m' in o)) || (!('i' in o)) ) {
      console.log("illegal message",o,m);
      return;
    }

    // console.log(o);

    this.parseMessage(o['t'], o['i'], o['m']);

    // let o = JSON.parse(m);

  }

  sessions: any = {};

  matrix: any = {
    'hello': this.handleHello.bind(this),
    'boot':  this.handleBoot.bind(this),
    't':     this.handleTransition.bind(this),
  };

  parseMessage(t: string, id: string, m: any): void {

    if(t in this.matrix) {
      const cb = this.matrix[t];
      cb(id, m);
    } else {
      console.log("parseMessage got unknown type " + t);
    }
    // if( )
    // switch(t): {
    //   case 'hello':
    //     this.handleHello()

    // }
  }


  // client sent us a transition
  handleTransition(id: string, m: any): void {

    if( (!('p' in m)) || (!('t' in m)) || (!('ps' in m)) || (!('s' in m)) ) {
      console.log("illegal message",id,m);
      return;
    }

    const sess = this.getSession(id);

    if( !sess.initialized ) {
      console.log("Dropping", m);
      return;
    }

    const path = m.p;
    const delta = m.t;
    const prev = m.ps;
    const cur = m.s;



    const uid = sess.logger.getForPath(path);

    sess.logger.logTransitionDuration(uid, prev, cur, delta);



    // console.log("got transition", m);
  }

  chooseFilename(): string {
    const name = `log_${process.pid}.fbl`;
    return name;
  }



  async setZmqLogger(sess: any, bt: any, l: any, z: ABTZmqLogger, file: any): Promise<void> {
    sess.logger = l;
    sess.zmq = z;
    sess.bt = bt;
    sess.file = file;

    await sess.logger.start();

    const fname = this.chooseFilename();
    console.log(`Writing log to ${fname}`);
    
    await file.setFilePath(fname);

    


    // sess.logger.writeToCallback(sess.gotTransition.bind(sess));
    sess.logger.writeToCallback((b)=>{
      // console.log(b);
      // this.gotTransition(sess, b);
      z.dataCallback(b, undefined);
      file.write(b);

    });



    // console.log(bt.getActionNodes());

    sess.logger.registerActionNodes(bt.getActionNodes());
    sess.logger.registerConditionNodes(bt.getConditionNodes());
    sess.logger.parseXML(sess.xml);
  }







  handleBoot(id: string, m: any): void {
    const sess = this.getSession(id);
    sess.xml = m.xml;

    // debugger;

    let bt = new AsyncBehaviorTree(sess.xml, {});
    let l = new BehaviorTreeFlatBuffer();
    let z = new BehaviorTreeZmq();
    let file = new AsyncBehaviorTreeFileSink();

    // z.logQueueDrain = true;

    this.setZmqLogger(sess, bt, l, z, file).then(async ()=>{

      await z.run();

      sess.initialized = true;

      let fn = () => {
        console.log(`fake log`);

        // l.logTransition(1, 1, 2);

        setTimeout(fn, 3000);
      };

      fn();

    });

    // sess.abt = new AsyncBehaviorTree(sess.xml, {});


    // console.log(sess, m);
  }

  newSession(id: string): void {
    this.sessions[id] = {
      start:new Date(),
      transitions:0,
      initialized: false,
    };
  }

  getSession(id: string): any {
    return this.sessions[id];
  }


  handleHello(id: string, m: any): void {
    // if( !('id' in m) ) {
    //   console.log("handleHello got malformed", m);
    //   return;
    // }
    console.log('got hello from ' + id + ' with: ' + m.msg);
    this.newSession(id);
  }

}


export { 
  AsyncBehaviorTreeBridge,
}

