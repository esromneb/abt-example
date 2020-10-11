
// import {
// AsyncBehaviorTree,
// ABTZmqLogger,
// } from "async-behavior-tree";


// export interface ABTZmqLogger {
//   dataCallback(buf: Uint8Array, flushBuf: Vec2[]): void;
//   run(): Promise<void>;
// }

import fs from "fs"

const inspect = require('util').inspect;
// console.log(util.inspect(dut.exe, {showHidden: false, depth: null}))

export type Vec4 = [number,number,number,number];

function _catbuf(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (const arr of arrays) {
        totalLength += arr.length;
    }
    const result = new resultConstructor(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

function buildUint32(x: number): Vec4 {
  let a = (x >> 24) & 0xff;
  let b = (x >> 16) & 0xff;
  let c = (x >>  8) & 0xff;
  let d = (x)       & 0xff
  return [d,c,b,a];
}


class AsyncBehaviorTreeFileSink {

  // wss: any;

  logQueueDrain: boolean = false;

  fd: number;

  constructor(public options:any={wsPort:8094}) {

  }

  setFilePath(path: string): Promise<void> {

    const that = this;

    return new Promise((resolve, reject)=>{
      fs.open(path, 'w', function(err, fd) {
        if (err) {
          reject(err);
          // throw 'could not open file: ' + err;
          return;
        }
        that.fd = fd;
        resolve();
      });
    });
  }

  // acts like a mutex
  mutexBusy: boolean = false;
  queue: Uint8Array[] = [];

  writes: number = 0;

  write(buf: Uint8Array): void {
    if( this.writes === 0 ) {
      this.handleFirstWrite(buf);
    } else {
      this.queue.push(buf);
    }
    this.writes++;

    this.triggerWrite();
  }

  triggerWrite(): void {
    setTimeout(this.drainQueue.bind(this),0);
  }

  flush(): void {
    this.triggerWrite();
  }


  async drainQueue(): Promise<void> {
    if( this.logQueueDrain && this.queue.length !== 0) {
      console.log(`About to drain ${this.queue.length} messages`);
    }

    if( this.mutexBusy ) {
      return;
    }

    // const that = this;

    this.mutexBusy = true;
    while(this.queue.length) {
      const buffer = this.queue.shift();

      await this.theWrite(buffer);

      // await this.sendData(this.queue.shift());
    }
    this.mutexBusy = false;
  }

  async theWrite(buffer): Promise<void> {
    const that = this;
    return new Promise((resolve, reject)=>{
      fs.write(that.fd, buffer, 0, buffer.length, null, function(err) {
      if (err) {
        reject(err);
        // throw 'could not open file: ' + err;
        return;
      }
        resolve();
      // if (err) throw 'error writing file: ' + err;
      // fs.close(fd, function() {
      //     console.log('wrote the file successfully');
      // });
      });

    });

  }

  handleFirstWrite(buf: Uint8Array): void {
    const len = buf.length;
    console.log(`First write was ${len} long`);

    let hdr = Uint8Array.of(...buildUint32(len));

    let final = _catbuf(Uint8Array, hdr, buf);

    this.queue.push(final);
  }


}


export { 
  AsyncBehaviorTreeFileSink,
}

