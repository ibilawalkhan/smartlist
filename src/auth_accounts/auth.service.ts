import { Injectable } from '@nestjs/common';
import { SigninDto, SignupDto } from './dto/auth.dto';
import {
  UserAlreadyExistsException,
  InvalidCredentialsException,
  TermsNotAcceptedException,
} from '../common/exceptions/auth.exceptions';
import { UserRepository } from './repositories/user.repository';
import { AuthMethodRepository } from './repositories/auth-method.repository';
import { PasswordService } from '../common/services/password.service';
import { TokenService } from '../common/services/token.service';
import { LoggerService } from '../common/services/logger.service';
import { TransactionHelper } from '../common/database/transaction.helper';
import { AuthSuccessMessages } from '../common/constants/error-messages';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private authMethodRepository: AuthMethodRepository,
    private passwordService: PasswordService,
    private tokenService: TokenService,
    private logger: LoggerService,
    private transactionHelper: TransactionHelper,
  ) {}

  async signup(data: SignupDto) {
    const { name, email, password, terms_accepted } = data;

    if (!terms_accepted) {
      throw new TermsNotAcceptedException();
    }

    const existingUser = await this.userRepository.existsByEmail(email);
    if (existingUser) {
      this.logger.warn(
        `Signup attempt with existing email: ${email}`,
        'AuthService',
      );
      throw new UserAlreadyExistsException();
    }

    const passwordHash = await this.passwordService.hash(password);

    const user = await this.transactionHelper.executeInTransaction(
      async (client) => {
        const newUser = await this.userRepository.create(
          client,
          email,
          name,
          terms_accepted,
        );

        await this.authMethodRepository.createPasswordAuth(
          client,
          newUser.kuid,
          passwordHash,
        );

        return newUser;
      },
    );

    this.logger.log(
      `User registered successfully: ${user.kuid}`,
      'AuthService',
    );

    return {
      message: AuthSuccessMessages.SIGNUP_SUCCESS,
      user: {
        kuid: user.kuid,
        email: user.email,
        name: user.name,
        terms_accepted: user.terms_accepted,
      },
    };
  }

  async signin(data: SigninDto) {
    const { email, password } = data;

    const user = await this.userRepository.findByEmailWithPassword(email);

    const hashToCompare =
      user?.password_hash || this.passwordService.getFakeHash();
    const isPasswordValid = await this.passwordService.compare(
      password,
      hashToCompare,
    );

    if (!user || !isPasswordValid) {
      this.logger.warn(
        `Failed signin attempt for email: ${email}`,
        'AuthService',
      );
      throw new InvalidCredentialsException();
    }

    const tokens = await this.tokenService.generateTokens(user);

    this.logger.log(`User signed in successfully: ${user.kuid}`, 'AuthService');

    const { password_hash, ...safeUser } = user;

    return {
      message: AuthSuccessMessages.SIGNIN_SUCCESS,
      user: safeUser,
      ...tokens,
    };
  }
}
