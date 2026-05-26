import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import _ from 'lodash';
import { throwError } from 'rxjs';
import { HttpErrorResponseDto } from '../dtos';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject()
    private readonly configService: ConfigService,
    private readonly logger = new Logger(AllExceptionFilter.name),
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const req = ctx?.getRequest();
    const res = ctx?.getResponse();
    const isHttpException = exception instanceof HttpException;
    const isRpcContext = host.getType() === 'rpc';
    const microserviceName = this.configService.get('app.microserviceName');

    const httpStatus = isHttpException
      ? exception.getStatus()
      : (exception as any)?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    const errorData: Partial<HttpErrorResponseDto> = {
      statusCode: httpStatus,
      timestamps: new Date().toISOString(),
      path: req?.url,
    };

    if (isHttpException) {
      let exceptionRes = exception.getResponse();
      if (typeof exceptionRes === 'string') {
        exceptionRes = { message: exceptionRes };
      }

      _.assign(
        errorData,
        {
          statusCode: exception.getStatus(),
          errorService: microserviceName,
        },
        exceptionRes,
      );
    } else {
      this.logger.error({
        context: `AllExceptionFilter.catch`,
        error: exception,
        message: 'A non-http error being throw somewhere',
      });

      const rpcError = exception as any;
      _.assign(errorData, {
        statusCode: rpcError?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: rpcError?.message,
        errorCode: rpcError?.errorCode,
        errorService: microserviceName,
        details: exception,
        // details: convertErrorToObject(exception),
      });
    }

    // ★ Attach the error to the request for use in middleware logging
    (res as any).error = exception;

    const isProductionEnv = this.configService.get('app.isProductionEnv');
    isProductionEnv && delete errorData.details;

    if (isRpcContext) return throwError(() => errorData);

    if (!res.headersSent) {
      httpAdapter.reply(ctx.getResponse(), errorData, httpStatus);
    } else {
      this.logger.warn('Response already sent, skipping error response', {
        url: req.url,
        method: req.method,
      });
    }
  }
}
