*Tasks*

**step 1** create workspace

1) created angular workspace with command
    > ng new <workspace-name> --no-create-application

**step 2** create project library.

1) created angular library project with command 
    > ng g library library
2) moved the library folder from projects/library to the root of workspace


**step 3** setup local package manager - verdaccio

1) install verdaccio
    > npm install --global verdaccio 
2) run verdaccio (host by default - http://localhost:4873)
    > verdaccio
3) login (username - dmytro; password - 12345; email - dev.gmail.com)
    > npm adduser --registry http://localhost:4873/
4) publish. publishing process should be from folder dist!!!
    > npm publish --registry http://localhost:4873/

**step 4** add ng-add and setup all needed configurations for schemantics.
1) for some step we need to use utility - copyfiles. so we can install it in project by command:
    > npm install copyfiles --save-dev

**step 5** update ng-ad to set custom "deploy" target
1) implement logic that will add a custom "deploy" target to the angular.json configuration.

**step 6** implement builder and deployer logic
1) add library 
    - (library) > npm install --save-dev @types/node
    - (library) > npm install --save-dev @aws-sdk/client-s3
    - (library) > npm install --save-dev @aws-sdk/client-cloudfront

*Deploy*

1) run scripts for publishing our package to verdaccio package manager.
    - (root) > verdaccio
    - (root) > npm run build
    - (library) > npm run build
    - (dist/<folder>) > npm publish --registry http://localhost:4873/

*Usseful resources*

    - Angular Schematics — Implementing NG-ADD support for Libraries (advanced) - https://www.youtube.com/watch?v=MVqVBbM_gvw&list=LL&index=13
    - example - https://github.com/Jefiozie/ngx-aws-deploy- 
    - angular schematics doc - https://angular.dev/tools/cli/schematics-for-libraries#creating-a-schematics-collection