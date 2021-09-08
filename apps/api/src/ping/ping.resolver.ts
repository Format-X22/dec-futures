import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql';

@ObjectType()
class Ping {
    @Field()
    status: string;
}

@Resolver()
export class PingResolver {
    @Query(() => Ping)
    async ping(): Promise<Ping> {
        return { status: 'OK' };
    }
}
