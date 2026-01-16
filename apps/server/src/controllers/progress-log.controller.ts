import {
  type HTTPRequest,
  type ProgressLogCreateDTO,
  type HTTPResponse,
  type ProgressLogResponseDTO,
  ProgressLogCreateSchema,
  HTTPStatusCode,
  EntityIdSchema,
} from '@fokus/shared';

import type { IProgressLogController } from '../interfaces/progress-log.interfaces.js';
import { formatHTTPErrorResponse } from '../helpers/controller.helpers.js';
import { ProgressLogService } from '../services/progress-log.services.js';
import { mapProgressLogDocToPublicDTO } from '../helpers/mappers.js';

export class ProgressLogController implements IProgressLogController {
  private readonly progressLogService = new ProgressLogService();

  async create(
    req: HTTPRequest<ProgressLogCreateDTO>,
  ): Promise<HTTPResponse<ProgressLogResponseDTO>> {
    try {
      const progressLog = ProgressLogCreateSchema.parse({
        ...req.body,
        userId: req.userId,
      });

      const createdProgressLogDoc =
        await this.progressLogService.create(progressLog);
      const createdProgressLog = mapProgressLogDocToPublicDTO(
        createdProgressLogDoc,
      );

      return { statusCode: HTTPStatusCode.CREATED, body: createdProgressLog };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ProgressLogResponseDTO>> {
    try {
      const progressLogId = EntityIdSchema.parse(req.params?.progressLogId);
      const userId = EntityIdSchema.parse(req.userId);

      const progressLogDoc = await this.progressLogService.findOneById(
        progressLogId,
        userId,
      );
      const progressLog = mapProgressLogDocToPublicDTO(progressLogDoc);

      return { statusCode: HTTPStatusCode.OK, body: progressLog };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
