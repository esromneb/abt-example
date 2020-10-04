import {
Vec2,
Vec3,
} from './GTypes'


class Ray3 {
  o: Vec3;
  d: Vec3;
  constructor(o: Vec3 = [0,0,0], d: Vec3 = [0,0,1]) {
    this.o = o;
    this.d = My3D.normalize(d);
  }

  pointAlong(t: number): Vec3 {
    return [ this.o[0] + this.d[0]*t,
             this.o[1] + this.d[1]*t,
             this.o[2] + this.d[2]*t];
  }


  // http://geomalgorithms.com/a05-_intersect-1.html
  // returns valid and result
  intersectZPlane(target: number): [boolean, Vec3] {



    // normal of plane
    const normal: Vec3 = [0,0,1];
    const dot = My3D.dot(normal,this.d);
    if( dot == 0 ) {
      return [false,[0,0,0]];
    }

    // make a plane at the height of our target
    const v0: Vec3 = [0,0,target];

    const p0: Vec3 = this.o;

    const p1: Vec3 = this.pointAlong(1);

    const top: number = My3D.dot(normal, My3D.sub(v0,p0) );

    const bot: number = My3D.dot(normal, My3D.sub(p1,p0) );

    // s1 is the point along our vector of the intersection
    const s1: number = top/bot;

    // call this function and thats our result
    const ret: Vec3 = this.pointAlong(s1);

    return [true,ret];
  }
}


class Rotate {
  static x(vec:Vec3, theta:number): Vec3 {
    const ts = Math.sin(theta);
    const tc = Math.cos(theta);
    
    const x = vec[0];
    const y = vec[1];
    const z = vec[2];

    return [
      x,
      y * tc - z * ts,
      z * tc + y * ts];
  }

  static y(vec:Vec3, theta:number): Vec3 {
    const ts = Math.sin(theta);
    const tc = Math.cos(theta);
    
    const x = vec[0];
    const y = vec[1];
    const z = vec[2];

    return [
      x * tc - z * ts,
      y,
      z * tc + x * ts];
  }


  static z(vec:Vec3, theta:number): Vec3 {
    const ts = Math.sin(theta);
    const tc = Math.cos(theta);
    
    const x = vec[0];
    const y = vec[1];
    const z = vec[2];

    return [
      x * tc - y * ts,
      y * tc + x * ts,
      z];
  }
};


class My3D {

  public static Rotate: Rotate;
  public static Quantize: any; // I get TS2740 unless this is any.  Why is Rotate ok tho?

  static add(v0: Vec3, v1: Vec3): Vec3 {
    const x = v0[0] + v1[0];
    const y = v0[1] + v1[1];
    const z = v0[2] + v1[2];
    return [x,y,z];
  }

  static sub(v0: Vec3, v1: Vec3): Vec3 {
    const x = v0[0] - v1[0];
    const y = v0[1] - v1[1];
    const z = v0[2] - v1[2];
    return [x,y,z];
  }

  static mul(v0: Vec3, v1: Vec3): Vec3 {
    const x = v0[0] * v1[0];
    const y = v0[1] * v1[1];
    const z = v0[2] * v1[2];
    return [x,y,z];
  }

  static div(v0: Vec3, v1: Vec3): Vec3 {
    const x = v0[0] / v1[0];
    const y = v0[1] / v1[1];
    const z = v0[2] / v1[2];
    return [x,y,z];
  }

  static equal(v0: Vec3, v1: Vec3): boolean {
    return ((v0[0] == v1[0]) && (v0[1] == v1[1]) && (v0[2] == v1[2]));
  }

  static mag(v0:Vec3): number {
    let ret = 0;
    for(let i = 0; i < 3; i++) {
      ret += v0[i]*v0[i];
    }
    return Math.sqrt(ret);
  }

  static normalize(v0: Vec3): Vec3 {
    const mag = My3D.mag(v0);
    const x = v0[0] / mag;
    const y = v0[1] / mag;
    const z = v0[2] / mag;
    return [x,y,z];
  }

  static dot(lhs: Vec3, rhs: Vec3): number {
    const tmp: Vec3 = My3D.mul(lhs,rhs);
    const ret: number = tmp[0] + tmp[1] + tmp[2];
    return ret;
  }

  static sum(v0: Vec3): number {
    return v0[0] + v0[1] + v0[2];
  }
};

class My2D {

  static add(v0: Vec2, v1: Vec2): Vec2 {
    const x = v0[0] + v1[0];
    const y = v0[1] + v1[1];
    return [x,y];
  }

  static sub(v0: Vec2, v1: Vec2): Vec2 {
    const x = v0[0] - v1[0];
    const y = v0[1] - v1[1];
    return [x,y];
  }

  static mul(v0: Vec2, v1: Vec2): Vec2 {
    const x = v0[0] * v1[0];
    const y = v0[1] * v1[1];
    return [x,y];
  }

  static div(v0: Vec2, v1: Vec2): Vec2 {
    const x = v0[0] / v1[0];
    const y = v0[1] / v1[1];
    return [x,y];
  }

  static equal(v0: Vec2, v1: Vec2): boolean {
    return ((v0[0] == v1[0]) && (v0[1] == v1[1]));
  }

  static mag(v0: Vec2): number {
    let ret = 0;
    for(let i = 0; i < 2; i++) {
      ret += v0[i]*v0[i];
    }
    return Math.sqrt(ret);
  }

  static normalize(v0: Vec2): Vec2 {
    const mag = My2D.mag(v0);
    const x = v0[0] / mag;
    const y = v0[1] / mag;
    return [x,y];
  }

  static sum(v0: Vec2): number {
    return v0[0] + v0[1];
  }
};

class Quantize {

  private n: number;
  private inv_n: number;
  private range: number;
  private inv_range: number;
  private off: number;

  constructor(n:number) {
    this.n = n;
    this.inv_n = 1/n;
    this.range = 2;
    this.inv_range = 1/this.range;
    this.off = 1 - (1/this.n);
  }
  // Quantize a single value between -1 1 and return as [0,n-1]
  qn(v:number) {
    const a = ((v + this.off) * this.inv_range);
    const b = Math.round(a * (this.n));
    const c = Math.min(Math.max(0,b),this.n-1);

    return c;
  }

  // Reverse, get a raw value from a quantized value
  rawn(b:number) {
    const a = b * this.inv_n;
    const v = (a * this.range) - this.off;
    return v;
  }

  rawv(v:Vec3) {
    return [
      this.rawn(v[0]),
      this.rawn(v[1]),
      this.rawn(v[2])];
  }

  // Accept a raw value, and return a raw value, but quantized
  // to the center
  qraw(v0:Vec3) {
    const x = this.qn(v0[0]);
    const y = this.qn(v0[1]);
    const z = this.qn(v0[2]);
    return this.rawv([x,y,z]);
  }

  // Accept a raw vector
  // return a string
  qstr(v0:Vec3) {
    const x = this.qn(v0[0]);
    const y = this.qn(v0[1]);
    const z = this.qn(v0[2]);
    return '' + x + '_' + y + '_' + z;
  }
};

My3D.Rotate = Rotate;
My3D.Quantize = Quantize;

export {
My3D,
Rotate,
Ray3,
My2D
};


