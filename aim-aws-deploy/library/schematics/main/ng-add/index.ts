import { Tree, Rule, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks'

export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {

    context.logger.info('Hello world!');

    // context.logger.info('Installing dependencies... .');
    // context.addTask(new NodePackageInstallTask())

    return tree;
  }
}
