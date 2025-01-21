
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
4) publish
    > npm publish --registry http://localhost:4873/