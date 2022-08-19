import { Options as PacoteOptions } from 'pacote'
import ArboristNode = require('../node')

export interface ArboristIndex {
  options: ArboristOptions
  cache: string
  path: string
  workspaceDependencySet(
    tree: ArboristNode,
    workspaces: string[],
    includeWorkspaceRoot?: boolean
  ): Set<ArboristNode>
  excludeWorkspacesDependencySet(tree: ArboristNode): Set<ArboristNode>
  workspaceNodes(tree: ArboristNode, workspaces: string[]): ArboristNode[]
}

// Circular type reference break
export interface ArboristApi {
  loadVirtual(options?: {root?: string}): Promise<ArboristNode>
  loadActual(options?: {root?: string}): Promise<ArboristNode>
  reify(options?: ArboristReifyOptions)
}

interface ArboristCircular {
  options: import('./index')['options'];
  cache: import('./index')['cache'];
  path: import('./index')['path'];
  workspaceDependencySet: import('./index')['workspaceDependencySet'];
  excludeWorkspacesDependencySet: import('./index')['excludeWorkspacesDependencySet'];
  workspaceNodes: import('./index')['workspaceNodes'];
  loadVirtual: InstanceType<ReturnType<typeof import('./load-virtual')>>['loadVirtual'];
  loadActual: InstanceType<ReturnType<typeof import('./load-actual')>>['loadActual'];
  reify: InstanceType<ReturnType<typeof import('./reify')>>['reify'];
}

type SaveType = 'dev' | 'optional' | 'prod' | 'peerOptional' | 'peer';
export interface ArboristOptions extends RemoveIndexSignature<PacoteOptions> {
  global?: boolean;
  lockfileVersion?: number;
  path?: string;
  workspacesEnabled?: boolean;
  nodeVersion?: string;
  replaceRegistryHost?: string;
  saveType?: SaveType;

  // build-ideal-tree
  follow?: boolean;
  force?: boolean;
  globalStyle?: boolean;
  actualTree?: ArboristNode | null;
  idealTree?: ArboristNode | null;
  virtualTree?: ArboristNode | null;
  includeWorkspaceRoot?: boolean;
  installLinks?: boolean;
  legacyPeerDeps?: boolean;
  packageLock?: boolean;
  strictPeerDeps?: boolean;
  workspaces?: string[];

  // rebuild
  ignoreScripts?: boolean;
  scriptShell?: import('@npmcli/run-script').Options['scriptShell'];
  binLinks?: boolean;
  rebuildBundle?: boolean;
  foregroundScripts?: boolean;

  // reify
  savePrefix?: string;
  packageLockOnly?: boolean;
  dryRun?: boolean;
  formatPackageLock?: boolean;
}

export interface ArboristLoadOptions {
  root?: string;
}

export interface ArboristLoadActualOptions extends ArboristLoadOptions {
  filter?: () => boolean;
  transplantFilter?: () => boolean;
  ignoreMissing?: boolean;
  forceActual?: boolean;
}

export interface ArboristBuildIdealTreeOptions {
  rm?: string[];
  add?: string[];
  saveType?: SaveType;
  saveBundle?: boolean;
  update?: boolean | { all?: boolean; names?: string[] };
  prune?: boolean;
  preferDedupe?: boolean;
  legacyBundling?: boolean;
  engineStrict?: boolean;
}

export interface ArboristReifyOptions extends ArboristBuildIdealTreeOptions {
  omit?: ('dev' | 'optional' | 'peer')[]
  preferDedupe?: boolean;
}

type UnionToIntersection<U> = (
  U extends never ? never : (k: U) => void
) extends (k: infer I) => void
  ? I
  : never

type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : K]: T[K]
}

type Mixins =
  | typeof import('../tracker.js')
  | typeof import('./pruner.js')
  | typeof import('./deduper.js')
  | typeof import('./audit.js')
  | typeof import('./build-ideal-tree.js')
  | typeof import('./load-workspaces.js')
  | typeof import('./load-actual.js')
  | typeof import('./load-virtual.js')
  | typeof import('./rebuild.js')
  | typeof import('./reify.js')

export type Base = new (options: object) => UnionToIntersection<
  InstanceType<ReturnType<Mixins>>
>
