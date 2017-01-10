/** @flow */
import { Ref, BitObject } from '../objects';
import Source from './source';

export type VersionProps = {
  impl: {
    name: string,
    file: Ref
  };
  specs?: {
    name: string,
    file: Ref
  };
  dist: ?Ref;
  compiler?: ?Ref;
  tester?: ?Ref;
  dependencies?: Ref[];
  flattenedDepepdencies?: Ref[];
  packageDependencies?: {[string]: string}; 
  buildStatus?: boolean;
  testStatus?: boolean;
}

export default class Version extends BitObject {
  impl: {
    name: string,
    file: Ref
  };
  specs: {
    name: string,
    file: Ref
  };
  compiler: ?Ref;
  tester: ?Ref;
  dependencies: BitId[];
  flattenedDepepdencies: Ref[];
  packageDependencies: {[string]: string};
  buildStatus: ?boolean;
  testStatus: ?boolean;

  constructor(props: VersionProps) {
    super();
    this.impl = props.impl;
    this.specs = props.specs;
    this.compiler = props.compiler;
    this.tester = props.tester;
    this.dependencies = props.dependencies || [];
    this.flattenedDepepdencies = props.flattenedDepepdencies || [];
    this.packageDependencies = props.packageDependencies || [];
    this.buildStatus = props.buildStatus;
    this.testStatus = props.testStatus;
  }

  id() {
    return JSON.stringify(this.toObject());
  }

  toObject() {
    return {
      impl: {
        file: this.impl.file.toString(),
        name: this.impl.name
      },
      specs: {
        file: this.specs.file.toString(),
        name: this.specs.name        
      },
      compiler: this.compiler ? this.compiler.toString(): '',
      tester: this.tester ? this.tester.toString(): '',
      dependencies: this.dependencies.map(dep => dep.toString()),
      packageDependencies: this.packageDependencies,
      buildStatus: this.buildStatus,
      testStatus: this.testStatus
    };
  }

  toBuffer(): Buffer {
    const obj = this.toObject();
    return Buffer.from(JSON.stringify(obj));
  }

  static parse(contents) {
    const props = JSON.parse(contents);
    return new Version({
      impl: {
        file: Ref.from(props.impl.file),
        name: props.impl.name
      },
      specs: props.specs ? {
        file: Ref.from(props.specs.file),
        name: props.specs.name        
      } : {},
      compiler: props.compiler ? Ref.from(this.compiler): null,
      tester: props.tester ? Ref.from(this.tester): null,
      dependencies: props.dependencies.map(dep => dep.toString()),
      packageDependencies: props.packageDependencies,
      buildStatus: props.buildStatus,
      testStatus: props.testStatus
    });
  }

  static fromComponent(component: Component, impl: Source, specs: Source) {
    return new Version({
      impl: {
        file: impl.hash(),
        name: component.implFile
      },
      specs: {
        file: specs.hash(),
        name: component.specsFile
      },
      // dist: component.build(),
      // compiler: Component.fromBitId('').hash(),
      // tester: Component.fromBitId('').hash(),
      packageDependencies: component.packageDependencies,
      dependencies: []
    });    
  }
}
