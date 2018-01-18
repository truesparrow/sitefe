import { Message, MessageWith1Arg } from './messages'


export const pageTitle: Message = {
    en: "Truesparrow",
    ro: "Truesparrow"
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
