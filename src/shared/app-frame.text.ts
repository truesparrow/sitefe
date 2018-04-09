import { Message, MessageWith1Arg } from '@truesparrow/common-js'

import * as config from './config'


export const pageTitle: Message = {
    en: config.STYLE_APPLICATION_NAME,
    ro: config.STYLE_APPLICATION_NAME
};

export const home: Message = {
    en: "Home",
    ro: "Acasă"
};

export const post: Message = {
    en: "Post",
    ro: "Postare"
};

export const thisIsBlog: MessageWith1Arg = {
    en: (foo: string) => `This is blog ${foo}`,
    ro: (foo: string) => `Acesta este blog ${foo}`
};
