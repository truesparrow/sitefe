import { Message, MessageWith0Arg } from '@truesparrow/common-js'

import * as config from './config'


export const siteName: MessageWith0Arg = {
    en: config.STYLE_APPLICATION_NAME,
    ro: config.STYLE_APPLICATION_NAME
};

export const loading: Message = {
    en: "Loading ...",
    ro: "Se încarca"
};

export const loadingFailed: Message = {
    en: "Loading failed",
    ro: "Încarcarea a eșuat"
};

export const add: Message = {
    en: "Add",
    ro: "Adaugă"
};

export const remove: Message = {
    en: "Remove",
    ro: "Șterge"
};

export const signUp: Message = {
    en: 'Sign Up',
    ro: 'Intrați'
};

export const save: Message = {
    en: 'Save',
    ro: 'Salvează'
};

export const reset: Message = {
    en: 'Reset',
    ro: 'Resetează'
};
