import { atom } from 'jotai';
import { exploreInfo } from '../../constants';

export const projectAtom = atom(exploreInfo.projects[0]);
