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


class UnitAISystem extends ApeECS.System {

  // spriteQuery: Query;
  // posQuery: Query;
  // game: any;

  logSimulationStep: boolean = false;

  wp: WorldParent;
  // stepQ: Query;

  spriteSize: number = 0.7;

  constructor(world, worldParent) {
    super(world);
    this.wp = worldParent;
  }

  init() {

    // this.stepQ = this.createQuery()
    //   .fromAll('StepSimulation')
    //   .persist();
  }


}

export {
UnitAISystem,
}

