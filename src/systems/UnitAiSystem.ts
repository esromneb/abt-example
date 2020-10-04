import {WorldParent} from '../WorldParent'

import {
Vec2
} from '../Types'


import {
  System,
  World,
  Component,
  Entity,
  EntityRef,
  EntitySet,
  EntityObject,
  Query,
} from 'ape-ecs';

const ApeECS = {
  World,
  System,
  Component,
};

import {
AsyncBehaviorTree
} from "async-behavior-tree";

const treeAi1 = require("../btrees/ai1.xml");


class UnitAiSystem extends ApeECS.System {

  // spriteQuery: Query;
  // posQuery: Query;
  // game: any;

  newTreeQ: Query;

  logSimulationStep: boolean = false;

  wp: WorldParent;
  // stepQ: Query;

  // spriteSize: number = 0.7;

  constructor(world, worldParent) {
    super(world);
    this.wp = worldParent;
  }

  init() {

    this.newTreeQ = this.createQuery()
      .fromAll('BehaviorTree', 'New')
      .persist();

    // this.stepQ = this.createQuery()
    //   .fromAll('StepSimulation')
    //   .persist();
  }


  public f: number; // frame number we are currently on
  public runables: any[] = [];

  // https://stackoverflow.com/questions/9882284/looping-through-array-and-removing-items-without-breaking-for-loop
  runRunnables() {
    let i = this.runables.length;
    while(i--) {
      const remove = this.runables[i](this.f);
      if( remove ) {
        this.runables.splice(i, 1);
      }
    }
  }

  // all runables must resolve if we are destroyed
  waitFrames(frames: number): Promise<boolean> {
    console.log('waitFrames', this.world.currentTick, frames);
    return new Promise((resolve, reject)=>{
      if( frames < 0 ) {
        reject(new Error(`waitFrames can't accept negative value ${frames}`));
        return;
      }
      if( frames === 0 /*|| this.destroyed */ ) {
        resolve(true);
        return true;
      }
      const start = this.f;
      this.runables.push((fc:number)=>{
        const delta = fc - start;
        if( delta >= frames ) {
          console.log('finished', frames);
          resolve(true);
          return true;
        }
        return false;
      });
    });
  }


  log(msg: string): boolean {
    console.log(msg);
    return true;
  }



  async moveTo(x: number, y: number): Promise<boolean> {
    return true;
  }







  update(tick: number): void {
    this.f = tick;
    // console.log('update ai');
    this.handleSpawn(tick);

    this.runRunnables();
  }

  private handleSpawn(tick: number): void {
    const sete = this.newTreeQ.execute();
    for (const e of sete) {
      for (const tree of e.getComponents('BehaviorTree')) {
        console.log("Got a new ai");

        tree.abt = this.newTree();

        console.log(tree.destroyed);

        tree.runner = setTimeout(async ()=>{
          while(!tree.entity.destroyed) {
            // console.log('top');
            await tree.abt.execute();
            // console.log("bottom of tree");
          }
        }, 0);


        // sprite.sprite = Pixi.Sprite.from(sprite.frame);
        // sprite.sprite.anchor.set(0,0);
        // sprite.sprite.scale.set(sprite.scale);
        // sprite.sprite.tint = sprite.color;
        // if (!sprite.container) {
        //   sprite.container = this.game.layers.main;
        // }
        // if (sprite.container)
        //   sprite.container.addChild(sprite.sprite);
      }
      e.removeTag('New');
      // console.log('New Sprite');
    }
  }

  private newTree(): any {

    const that = this;

    const prx: any = new Proxy({}, {
      get(obj, prop) {

        if( prop in that ) {

          // if( prop === 'bumpDNC' ) {
          //   return that[prop].bind(that, e);
          // }

          return that[prop];//.bind(this);
        }

        // if( prop === 'e' ) {
        //   return e;
        // }

        // console.log("Get for ");
        // // console.log(obj);
        // console.log(prop);
        return undefined;
      },
      has(target, key) {
        
        if( key in that ) {
          return true;
        }

        return key in target;
      },
      set(obj, prop, value) {

          // if( prop in e.c.state ) {
          //   e.c.state[prop] = value;
          //   return true;
          // }
          // if( prop in e.c.base ) {
          //   e.c.base[prop] = value;
          //   return true;
          // }

          console.log("BT unable to set");
          console.log(prop);
          console.log("to value: " + value);
          console.log("(because it doesn't already exist)");
          return false;
      },
      deleteProperty(obj, prop) {
        return true;
      }
    });

    let tree = new AsyncBehaviorTree(treeAi1, prx);
    return tree;
  }


}

export {
UnitAiSystem,
}

