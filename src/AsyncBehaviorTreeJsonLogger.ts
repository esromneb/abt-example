import {getRandomId} from './Util'

export interface IJsonFunctionWriterCb {
  (str: string): void;
}

export interface ABTLoggerBase {
  logTransition(uid: number, prev_status: number, status: number): void;
  getNameForUID(u: number): string;
  getForPath(path: string): number;
  parseXML(xml: string): void;
}
export interface ABTJsonLogger extends ABTLoggerBase {
  writeJsonToCallback(cb: IJsonFunctionWriterCb): void;
}


class AsyncBehaviorTreeJsonLogger {

  nodeOffset: number = 100;

  savedXml: string;

  treeId: string;

  start = new Date().getTime();

  constructor(public writeCb: any, public options: any = {print:false}) {
    this.currentNodeId = this.nodeOffset;

    this.treeId = getRandomId();
  }


  parseXML(xml: string): void {
    if(this.options.print) {
      console.log("Saved xml length " + xml.length);
    }
    this.savedXml = xml;

    this.writeCb('boot', {tid: this.treeId, xml:xml});
  }

  transitionCount: number = 0;

  logTransition(uid: number, prev_status: number, status: number): void {
    let now = new Date();
    const path = this.pathForNode[uid];

    let delta: number = now.getTime() - this.start;

    if(this.options.print) {
      console.log(`transition ${path} (${uid}) ${prev_status} -> ${status}   ${delta}`);
    }

    this.writeCb('t', {tid: this.treeId, p:path, t:delta, ps:prev_status, s:status});

    this.transitionCount++;
  }

  getNameForUID(u: number): string {
    if( this.options.print ) {
      console.log(`getNameForUID ${u}`);
    }
    return this.preNames[''+u];
  }
  getForPath(path: string): number {
    if( this.options.print ) {
      console.log(`getForPath ${path}`);
    }
    return this.preWalkPaths[path];
  }

  cb: IJsonFunctionWriterCb;

  writeJsonToCallback(cb: IJsonFunctionWriterCb) {
    this.cb = cb;
  }

  pathForNode = {};

  preNames = {};

  preWalkPaths = {};

  currentNodeId: number;

  preWalkTree(cb: any): void {
    this.preWalkPaths[cb.path] = this.currentNodeId;

    this.pathForNode[this.currentNodeId] = cb.path;

    this.preNames[''+this.currentNodeId] = cb.name || cb.w;

    if( this.options.print ) {
      console.log(`set ${this.currentNodeId} = ${cb.path} = ${this.preNames[''+this.currentNodeId]}`);
    }

    this.currentNodeId++;
  }

}

export {
AsyncBehaviorTreeJsonLogger
}
