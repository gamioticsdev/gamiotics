import { createDbConnection } from './common/db';
import controllers from './controllers';
import { AuthService } from './services/AuthService';
import { createExpressServer, Action } from 'routing-controllers';
import { middlewares } from './middlewares';
import { createServer } from 'http';

export class App {
  private app: any;
  private server: any;
  public async initConnection(): Promise<string> {
    return createDbConnection();
  }
  initRoutes(): void {
    this.app = createExpressServer({
      currentUserChecker: async (action: Action) => {
        const token = action.request.headers['authorization'];

        return new AuthService().authorizeUser(token);
      },
      cors: true,
      controllers: controllers,
      middlewares: middlewares,
      defaultErrorHandler: false,
    });
    this.server = createServer(this.app);
  }
  listen(): void {
    this.server.listen(4000);
    console.log('listening on 4000');
  }
  close(): void {
    this.server.close();
  }
}
