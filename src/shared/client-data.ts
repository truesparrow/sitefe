import {
    MarshalEnum,
    MarshalFrom,
    MarshalWith,
    OptionalOf
} from 'raynor'
import * as r from 'raynor'

import { Env, LanguageMarshaller } from '@truesparrow/common-js'
import { Session } from '@truesparrow/identity-sdk-js'


export class ClientConfig {
    @MarshalWith(MarshalEnum(Env))
    env: Env;

    @MarshalWith(r.WebUriMarshaller)
    origin: string;

    @MarshalWith(OptionalOf(r.StringMarshaller))
    rollbarClientToken: string | null;

    @MarshalWith(LanguageMarshaller)
    language: string;

    @MarshalWith(MarshalFrom(Session))
    session: Session;
}


export class ClientInitialState {
    @MarshalWith(r.StringMarshaller)
    text: string
}
