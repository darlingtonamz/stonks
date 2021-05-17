import { Controller, DELETE } from 'fastify-decorators';
import { TradesService } from '../providers/trades.service';

@Controller({ route: '/erase' })
export class TradeAdminController {
  constructor(public service: TradesService) {}

  @DELETE('/')
  async deleteAllTrades() {
    return this.service.deleteAllTrades();
  }
}

export default TradeAdminController;