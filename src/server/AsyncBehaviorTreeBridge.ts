
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
    'save':  this.handleSave.bind(this),
    'boot':  this.handleBoot.bind(this),
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

  handleBoot(id: string, m: any): void {
    console.log(m);
  }


  handleHello(id: string, m: any): void {
    // if( !('id' in m) ) {
    //   console.log("handleHello got malformed", m);
    //   return;
    // }
    console.log('got hello from ' + id + ' with: ' + m.msg);
  }

  handleSave(id: string, m: any): void {
    console.log('got save from ' + id);

    for( let i = 0; i < m.length; i++) {
      // console.log(m[i]);

      console.log(inspect(m[i], {showHidden: false, depth: null, colors: true}))

    }
  }


}


export { 
  AsyncBehaviorTreeBridge,
}

