import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyUserCommand } from './verify-user.command';
import { UserRepository } from '../../../../data-access';
import { AppException, ERROR_RESPONSE } from '@repo/nest-common';
import { verifyHashed } from '../../user.util';

@CommandHandler(VerifyUserCommand)
export class VerifyUserHandler implements ICommandHandler<VerifyUserCommand> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: VerifyUserCommand) {
    console.log('in here');
    const user = await this.userRepo.findOne({ username: command.username });
    console.log('going through here?');
    if (!user?.password)
      throw new AppException(ERROR_RESPONSE.INVALID_CREDENTIALS);

    const isPasswordValid = await verifyHashed(user.password, command.password);
    if (!isPasswordValid)
      throw new AppException(ERROR_RESPONSE.INVALID_CREDENTIALS);

    // return token payload data
  }
}
