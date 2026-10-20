import { Command, CommandRunner, InquirerService } from 'nest-commander';
import {
  USER_CLI_COMMAND_CONSTANTS,
  USER_CLI_QUESTION_CONSTANTS,
} from '../user.constants';
import { CommonCqrsBus } from '@repo/nest-core';
import { CreateUserCommand } from '../commands';

@Command({
  name: USER_CLI_COMMAND_CONSTANTS.CREATE_ADMIN,
  description: 'Creates a admin user',
  arguments: '[username] [password]',
})
export class CreateAdminCli extends CommandRunner {
  constructor(
    private readonly inquirer: InquirerService,
    private readonly commonCqrsBus: CommonCqrsBus,
  ) {
    super();
  }

  async run(): Promise<void> {
    const answers = await this.inquirer.prompt<{
      username: string;
      password: string;
    }>(USER_CLI_QUESTION_CONSTANTS.CREATE_ADMIN, undefined);
    const username = answers?.username.trim();
    const password = answers?.password.trim();

    try {
      await this.commonCqrsBus.executeCommand(
        new CreateUserCommand({ username, password }),
      );

      console.log(`\n✅ Admin created successfully: ${username}`);
    } catch (e) {
      console.error(`\n❌ Failed to create admin: ${e.message}`);
    }
  }
}
