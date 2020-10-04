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

// import {
// AsyncBehaviorTree
// } from "../../AsyncBehaviorTree";


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

  update(tick: number): void {
    // console.log('update ai');
    this.handleSpawn(tick);
  }

  private handleSpawn(tick: number): void {
    const sete = this.newTreeQ.execute();
    for (const e of sete) {
      for (const tree of e.getComponents('BehaviorTree')) {

        console.log("Got a new ai");


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


}

export {
UnitAiSystem,
}

