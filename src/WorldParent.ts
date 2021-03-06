import * as ComponentExports from './components/Index'
import {Scene} from './Scene'

import {SpriteSystem} from './systems/SpriteSystem'
import {BoardSystem} from './systems/BoardSystem'
import {CellSystem} from './systems/CellSystem'
import {InputSystem} from './systems/InputSystem'
import {HistorySystem} from './systems/HistorySystem'
import {UnitAiSystem} from './systems/UnitAiSystem'

import {
Vec2
} from './Types'

// import {GlobalState} from './components/Components'

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

const boardSize: Vec2 = [12*2,8*2];


class WorldParent extends Scene {
  world: World;

  sprite: SpriteSystem;
  board: BoardSystem;
  cell: CellSystem;
  input: InputSystem;
  history: HistorySystem;
  unitAI: UnitAiSystem;

  eboard: Entity;

  gentity: Entity;
  gamec: Component;
  mouse: Entity;
  snapshots: Entity;

  testMode: boolean = false; // set by unit test

  constructor(game: any, public options: any = {}) {
    super(game);

    this.world = new ApeECS.World({
      entityPool: 4000,
      cleanupPools: false,
    });


    this.registerComponents();
    this.registerTags();
    this.setupFirstEntities();
    this.debugEntities();
    this.setupSystems();
    this.finalInit();


  }

  update(dt?, df?, time?): void {
    // console.log("World Parent Update", dt);
    
    // istanbul ignore if
    if( !this.testMode ) {
      this.input.updateMouse();
    }
    this.world.runSystems('input');
    this.world.tick();

    this.world.runSystems('cell');
    this.world.runSystems('unitAi');
    this.world.runSystems('sprite');
  }


  finalInit(): void {
    this.eboard = this.board.initBoard(...boardSize);
    this.sprite.drawBoundaries();
    this.input.finalInit();
    this.cell.finalInit();

    this.input.changeUIMode('normal');


    this.loadInitialPattern();
  }

  // istanbul ignore next
  loadInitialPattern(): void {
    const pattern = this.options.initialCellPattern;

  }

  setupFirstEntities(): void {
    const gentity = this.world.createEntity({
      id: 'gentity',
      components: [
        {
          type: 'Game',
          key: 'game',
          width: this.options.width,
          height: this.options.height,
          layers: {
            'main': this
          }
        },
        {
          type: 'UIState',
          key: 'ui',
        }
      ]
    });
    this.gentity = gentity;
    this.gamec = gentity.c.game;

    this.mouse = this.world.createEntity({
      id: 'gmouse',
      components: [
        {
          type: 'GMouse',
          key: 'now',
        },
        {
          type: 'GMouse',
          key: 'prev',
        },
        {
          type: 'GMouseState',
          key: 'state',
        }
      ]
    });

    this.snapshots = this.world.createEntity({
      id: 'chistory',
      components: [
        {
          type: 'CellHistory',
          key: 'history',
        },
      ]
    });


  }

  // istanbul ignore next
  debugEntities(): void {
    const game = this.gamec;
    let x = 40;

    if( false ) {
      const entity = this.world.createEntity({
          tags: ['New', 'Station'],
          components: [
            {
              type: 'Sprite',
              frame: 'pearl_01d',
              container: game.layers.main,
              scale: 3,
              color: 0xffffff
            },
            {
              type: 'Position',
              x,
              y: game.height - 20,
              angle: -Math.PI / 2
            }
          ]
        });
    }
  }

  setupSystems(): void {
    this.sprite     = this.world.registerSystem('sprite',  new SpriteSystem(this.world, this));
    this.board      = this.world.registerSystem('board',   new BoardSystem(this.world, this));
    this.cell       = this.world.registerSystem('cell',    new CellSystem(this.world, this));
    this.input      = this.world.registerSystem('input',   new InputSystem(this.world, this));
    this.history    = this.world.registerSystem('history', new HistorySystem(this.world, this));
    this.unitAI     = this.world.registerSystem('unitAi',  new UnitAiSystem(this.world, this));
  }

  registerComponents(): void {
    for (const name of Object.keys(ComponentExports)) {
      this.world.registerComponent(ComponentExports[name]);
      // this.world.registerComponent(GlobalState, 10);
    }
  }

  registerTags(): void {
    let tags: string[] = [];

    tags.push('New');
    tags.push('Station');
    tags.push('UpdateSprite');
    tags.push('Moving');

    this.world.registerTags(...tags);
  }


}

export {
WorldParent,
}