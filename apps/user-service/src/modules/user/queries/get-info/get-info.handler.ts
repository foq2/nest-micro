import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInfoQuery } from './get-info.query';
import { UserRepository } from '../../../../data-access';
import { GetInfoResponseDto } from '../../dto';

@QueryHandler(GetInfoQuery)
export class GetInfoHandler implements IQueryHandler<GetInfoQuery> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(query: GetInfoQuery): Promise<GetInfoResponseDto> {
    return this.userRepo.findOneOrFail(query.userId);
  }
}
