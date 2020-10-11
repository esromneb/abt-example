import {getRandomId} from './Util'

class AsyncBehaviorTreeBridgeClient {

  logTickEnter: boolean = false;


  // ecs: World;
  // global: Entity;
  // gecs: GEntityComponentSystem;

  constructor(public options:any = {wsPort:8094}) {

  }

  ws: any;

  sessionId: string;

  open(): void {

    this.sessionId = getRandomId();

    const path = `ws://localhost:${this.options.wsPort}`

    console.log("open websocket");
    this.ws = new WebSocket(path);

    this.ws.onopen = this.hello.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);

    // this.hello();
  }


  private onMessage(m): void {
    console.log(m);
  }


  private hello(): void {
    this.write('hello', {msg:'hi'});
    // this.large();
  }

  // private large(): void {
  //   let ret: any = [];
  //   for(let i = 0; i < 10000; i++) {
  //     ret[i] = i*4;
  //   }

  //   this.write('large', ret);

  //   setTimeout(this.large.bind(this), 10);
  // }

  localSave: string;

  write(t: string, m: any): void {
    const o = {t,m,i:this.sessionId};
    const s = JSON.stringify(o);

    // if( t === 'save' ) {
    //   this.localSave = s;
    // }

    this.ws.send(s);
  }

  // dump(): any {
  //   const q = this.world.createQuery().fromAny(
  //     'GUnit',
  //     );
  //   const es = q.execute();

  //   let ret: any = [];

  //   for(const e of es) {
  //     let uo = e.getObject()

  //     // delete uo.c.GMovementPack;
  //     // delete uo.c.GUnit;
  //     // delete uo.c.GMovementPack;
  //     // delete uo.c.GMovementPack;

  //     // delete uo.c.GMovementPack.tile;

  //     // console.log(uo);
  //     // console.log(uo.c.GMovementPack);

  //     ret.push(uo);
  //     // console.log(e);
  //   }

  //   return ret;
  // }


  // loadAtFrame: number|undefined;

  // // debug
  // // local load top
  // localLoad(): void {
  //   // console.log(this.localSave);

  //   // // do the bottom half of the load later
  //   // // as I want the destroy to flush through the system
  //   // this.loadAtFrame = this.gecs.frame()+2

  //   // this.gecs.unit.sellAllUnits();

  // }

  // localLoadBottom(): void {
  //   console.log('load bottom');

  //   let parsed = JSON.parse(this.localSave);

  //   console.log(parsed);

  //   let m = parsed.m;

  //   for(let i = 0; i < m.length; i++) {
  //     console.log(m[i]);

  //     this.ecs.createEntity(m[i]);

  //   }


  //   const global = this.ecs.getEntity('global').c;

  //   console.log('this.global.GlobalState.nextUnitId', global.GlobalState.nextUnitId);


  // }


  // update(tick): void {
  //   if( this.logTickEnter ) {
  //     console.log(`enter trender with tick ${tick}`);
  //   }

  //   if( this.loadAtFrame === tick ) {
  //     this.loadAtFrame = undefined;
  //     this.localLoadBottom();
  //   }




  //   return;
  // }

}

export { 
  AsyncBehaviorTreeBridgeClient,
}
