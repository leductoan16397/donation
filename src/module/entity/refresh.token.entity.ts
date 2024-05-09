import { DEFAULT_SCHEMA } from 'src/common/constant';
import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { User } from 'src/module/entity/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'refresh_tokens', schema: DEFAULT_SCHEMA })
export class RefreshToken extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;

  @Column()
  token: string;
}
