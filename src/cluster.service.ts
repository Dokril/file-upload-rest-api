import * as cluster from 'cluster';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { CronJob } from 'cron';

const CLUSTER_COUNT = 3;
@Injectable()
export class AppClusterService {
  constructor() {}
  static clusterize(callback: Function): void {
    const logger = new Logger(AppClusterService.name);
    if (cluster.isMaster) {
      logger.log(`Master server started on ${process.pid}`);
      for (let i = 0; i < CLUSTER_COUNT; i++) {
        cluster.fork();
      }

      AppClusterService.startDeleteCron();

      cluster.on('exit', worker => {
        logger.log(`Worker ${worker.process.pid} died. Restarting`);
        cluster.fork();
      });
    } else {
      logger.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }

  private static startDeleteCron() {
    const cron = new CronJob('30 23 * * *', async () => {
      await new HttpService()
        .delete('http://localhost:3000/api/file/deleteAllMarkedFiles')
        .toPromise();
    });
    cron.start();
  }
}
