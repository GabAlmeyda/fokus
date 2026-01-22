import {
  type HTTPRequest,
  type ProgressLogCreateDTO,
  type HTTPResponse,
  type ProgressLogResponseDTO,
  ProgressLogCreateSchema,
  HTTPStatusCode,
  EntityIdSchema,
  ProgressLogFilterQuerySchema,
} from '@fokus/shared';

import type {
  IProgressLogController,
  IProgressLogService,
} from '../interfaces/progress-log.interfaces.js';
import { formatHTTPErrorResponse } from '../helpers/controller.helpers.js';

export class ProgressLogController implements IProgressLogController {
  private readonly progressLogService;
  constructor(progressLogService: IProgressLogService) {
    this.progressLogService = progressLogService;
  }

  async create(
    req: HTTPRequest<ProgressLogCreateDTO>,
  ): Promise<HTTPResponse<ProgressLogResponseDTO>> {
    try {
      const newData = ProgressLogCreateSchema.parse({
        ...req.body,
        userId: req.userId,
      });

      const progressLog = await this.progressLogService.create(newData);
      return { statusCode: HTTPStatusCode.CREATED, body: progressLog };
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

      const progressLog = await this.progressLogService.findOneById(
        progressLogId,
        userId,
      );
      return { statusCode: HTTPStatusCode.OK, body: progressLog };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ProgressLogResponseDTO[]>> {
    try {
      const { date, interval, goalId, habitId } =
        ProgressLogFilterQuerySchema.parse(req.query);
      const userId = EntityIdSchema.parse(req.userId);

      const filter = {
        habitId,
        goalId,
        period: date && interval ? { date, interval } : undefined,
      };

      const progressLogs = await this.progressLogService.findByFilter(
        filter,
        userId,
      );
      return { statusCode: HTTPStatusCode.OK, body: progressLogs };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>> {
    try {
      const progressLogId = EntityIdSchema.parse(req.params?.progressLogId);
      const userId = EntityIdSchema.parse(req.userId);

      await this.progressLogService.delete(progressLogId, userId);
      return { statusCode: HTTPStatusCode.NO_CONTENT, body: null };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
