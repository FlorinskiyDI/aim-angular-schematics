**step 1** create workspace with application

1) created angular workspace with application with command
    > ng new <workspace-name>

**step 2** add schematic @aim/aws-deploy to application

1) add schematics command
    > ng add  @aim/aws-deploy --registry http://localhost:4873/

2) or we can run specific schematics by this command
    > schematics ../aim-aws-deploy/dist/library/schematics/collection.json:ng-add --dry-run true 