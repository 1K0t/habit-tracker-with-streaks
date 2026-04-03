import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse } from "@nestjs/swagger";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require("../../../package.json");

@ApiTags("state-checker")
@Controller()
export class StateCheckerController {
  @Get("health")
  @ApiOperation({ summary: "Service liveness check" })
  @ApiOkResponse({ description: "Service is alive" })
  getHealth(): { healthy: boolean } {
    return { healthy: true };
  }

  @Get("version")
  @ApiOperation({ summary: "Get application version" })
  @ApiOkResponse({ description: "Application version" })
  getVersion(): { version: string } {
    return { version };
  }
}
