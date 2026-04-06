import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import packageJson from '../../../package.json';

@ApiTags('state-checker')
@Controller()
export class StateCheckerController {
  @Get('health')
  @ApiOperation({ summary: 'Service liveness check' })
  @ApiOkResponse({ description: 'Service is alive' })
  getHealth(): { healthy: boolean } {
    return { healthy: true };
  }

  @Get('version')
  @ApiOperation({ summary: 'Get application version' })
  @ApiOkResponse({ description: 'Application version' })
  getVersion(): { version: string } {
    return { version: packageJson.version };
  }
}
