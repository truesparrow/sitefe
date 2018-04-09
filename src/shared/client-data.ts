import {
    MarshalEnum,
    MarshalFrom,
    MarshalWith,
    OptionalOf
} from 'raynor'
import * as r from 'raynor'

import { Env, LanguageMarshaller } from '@truesparrow/common-js'
import { Event, SubDomainMarshaller } from '@truesparrow/content-sdk-js'
import { Session } from '@truesparrow/identity-sdk-js'


export class ClientConfig {
    @MarshalWith(MarshalEnum(Env))
    env: Env;

    @MarshalWith(r.WebUriMarshaller)
    internalOrigin: string;

    @MarshalWith(r.WebUriMarshaller)
    externalOriginWithSubDomain: string;

    @MarshalWith(SubDomainMarshaller)
    subDomain: string;

    @MarshalWith(r.StringMarshaller)
    styleApplicationName: string;

    @MarshalWith(r.StringMarshaller)
    contentServiceHost: string;

    @MarshalWith(r.PositiveIntegerMarshaller)
    contentServicePort: number;

    @MarshalWith(r.StringMarshaller)
    googleMapsApiKey: string;

    @MarshalWith(OptionalOf(r.StringMarshaller))
    rollbarClientToken: string | null;

    @MarshalWith(LanguageMarshaller)
    language: string;

    @MarshalWith(MarshalFrom(Session))
    session: Session;
}


export class ClientInitialState {
    @MarshalWith(r.BooleanMarshaller)
    eventIsMissing: boolean;

    @MarshalWith(OptionalOf(MarshalFrom(Event)))
    event: Event | null
}
