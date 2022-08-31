import { App } from './app';
const app = new App();
app.initRoutes();
app
  .initConnection()
  .then((condetails) => {
    console.log('connection details', condetails);
    app.listen();
  })
  .catch((err) => {
    console.log('error occured starting app', err);
  });
