import * as hypExp from 'hyper-express';

const port = 8080;

let server:any = new hypExp.Server();

server.listen(port)
  .then((_socket: any) => console.log('Webserver started on port ' + port))
  .catch((_error: any) => console.log('Failed to start webserver on port ' + port));
