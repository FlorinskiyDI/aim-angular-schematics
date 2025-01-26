**step 1** create workspace with application

1) created angular workspace with application with command
    > ng new <workspace-name>

**step 2** add schematic @aim/aws-deploy to application

2) add schematics command
    - > ng add  @aim/aws-deploy --registry http://localhost:4873/
    - check that angular.json is updated and has something options like this
    > 	"deploy": {
          "builder": "@aim/aws-deploy:deploy",
          "options": {
            "deleteBeforeUpload": true,
            "sourceFolder": "browser"
          }
        }
    - 'sourceFolder' option will configured the folder from which the files will be deployed to AWS.

3) or we can run specific schematics by this command
    > schematics ../aim-aws-deploy/dist/library/schematics/collection.json:ng-add --dry-run true

4) if we need to reinstall lib @aim/aws-deploy, you can run next command
    > npm uninstall @aim/aws-deploy
    > ng add  @aim/aws-deploy@0.0.13 --registry http://localhost:4873/

5) run deploy command
    > npx cross-env
        NG_DEPLOY_AWS_ACCESS_KEY_ID=<your_key_id>
        NG_DEPLOY_AWS_SECRET_ACCESS_KEY=<your_access_key>
        NG_DEPLOY_AWS_BUCKET=<your_bucket>
        NG_DEPLOY_AWS_REGION=<your_region>
        ng deploy

**useful resources**
- Learn How to Deploy Your Angular Application to AWS S3 (https://www.youtube.com/watch?v=SICYw5sHv8A&list=LL&index=4)
- Learn How to Deploy Your Angular App to AWS S3 - part 2 (https://www.youtube.com/watch?v=JtV8pkX20EM&list=LL&index=4&t=8s)